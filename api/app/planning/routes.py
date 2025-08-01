from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.planning.models import Budget
from app.planning.schemas import budget_schema, budgets_schema
from app.finance.models import Transaction
from app.wealth.models import Investment
from app.extensions import db
from sqlalchemy import func, extract
from datetime import datetime, timedelta

planning_bp = Blueprint("planning", __name__)

# ===== BUDGETS ROUTES =====
@planning_bp.route("/budgets", methods=["GET"])
@jwt_required()
def get_budgets():
    user_id = get_jwt_identity()
    budgets = Budget.query.filter_by(user_id=user_id).all()
    return jsonify(budgets_schema.dump(budgets))

@planning_bp.route("/budgets", methods=["POST"])
@jwt_required()
def create_budget():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    errors = budget_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    
    try:
        budget = budget_schema.load(data)
        budget.user_id = get_jwt_identity()  # Set user_id after loading
        db.session.add(budget)
        db.session.commit()
        return jsonify(budget_schema.dump(budget)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create budget"}), 500

@planning_bp.route("/budgets/<int:budget_id>", methods=["PUT"])
@jwt_required()
def update_budget(budget_id):
    user_id = get_jwt_identity()
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
    if not budget:
        return jsonify({"error": "Budget not found"}), 404
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    errors = budget_schema.validate(data, partial=True)
    if errors:
        return jsonify(errors), 400
    
    try:
        for key, value in data.items():
            if hasattr(budget, key) and key != 'user_id':
                if key == "username" and Budget.query.filter_by(username=value).filter(Budget.id != budget.id).first():
                    return jsonify({"error": "Username already exists"}), 409
                if key == "email" and Budget.query.filter_by(email=value).filter(Budget.id != budget.id).first():
                    return jsonify({"error": "Email already registered"}), 409
                setattr(budget, key, value)
        db.session.commit()
        return jsonify(budget_schema.dump(budget))
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update budget"}), 500

@planning_bp.route("/budgets/<int:budget_id>", methods=["DELETE"])
@jwt_required()
def delete_budget(budget_id):
    user_id = get_jwt_identity()
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
    if not budget:
        return jsonify({"error": "Budget not found"}), 404
    
    try:
        db.session.delete(budget)
        db.session.commit()
        return jsonify({"message": "Budget deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete budget"}), 500

# ===== ANALYTICS ROUTES =====
@planning_bp.route("/analytics/spending-by-category", methods=["GET"])
@jwt_required()
def spending_by_category():
    user_id = get_jwt_identity()
    results = db.session.query(
        Transaction.category,
        func.sum(Transaction.amount).label('total')
    ).filter_by(
        user_id=user_id,
        transaction_type='expense'
    ).group_by(Transaction.category).all()
    
    return jsonify([{
        "category": result.category,
        "total": result.total
    } for result in results])

@planning_bp.route("/analytics/monthly-trends", methods=["GET"])
@jwt_required()
def monthly_trends():
    user_id = get_jwt_identity()
    
    # Get last 6 months of data
    six_months_ago = datetime.now() - timedelta(days=180)
    
    income = db.session.query(
        extract('month', Transaction.timestamp).label('month'),
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == user_id,
        Transaction.transaction_type == 'income',
        Transaction.timestamp >= six_months_ago
    ).group_by(extract('month', Transaction.timestamp)).all()
    
    expenses = db.session.query(
        extract('month', Transaction.timestamp).label('month'),
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == user_id,
        Transaction.transaction_type == 'expense',
        Transaction.timestamp >= six_months_ago
    ).group_by(extract('month', Transaction.timestamp)).all()
    
    return jsonify({
        "income": [{"month": int(r.month), "total": r.total} for r in income],
        "expenses": [{"month": int(r.month), "total": r.total} for r in expenses]
    })

@planning_bp.route("/analytics/budget-performance", methods=["GET"])
@jwt_required()
def budget_performance():
    user_id = get_jwt_identity()
    budgets = Budget.query.filter_by(user_id=user_id).all()
    
    results = [{
        "name": budget.name,
        "limit": budget.limit,
        "spent": budget.spent,
        "remaining": budget.remaining,
        "percentage_used": budget.percentage_used,
        "status": "over" if budget.spent > budget.limit else "on_track"
    } for budget in budgets]
    
    return jsonify(results)

@planning_bp.route("/analytics/financial-summary", methods=["GET"])
@jwt_required()
def financial_summary():
    user_id = get_jwt_identity()
    
    # Total income/expenses this month
    current_month = datetime.now().month
    current_year = datetime.now().year
    
    monthly_income = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == user_id,
        Transaction.transaction_type == 'income',
        extract('month', Transaction.timestamp) == current_month,
        extract('year', Transaction.timestamp) == current_year
    ).scalar() or 0
    
    monthly_expenses = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == user_id,
        Transaction.transaction_type == 'expense',
        extract('month', Transaction.timestamp) == current_month,
        extract('year', Transaction.timestamp) == current_year
    ).scalar() or 0
    
    # Investment portfolio value
    investments = Investment.query.filter_by(user_id=user_id).all()
    portfolio_value = sum(inv.total_value for inv in investments)
    
    # Budget summary
    budgets = Budget.query.filter_by(user_id=user_id).all()
    total_budget_limit = sum(b.limit for b in budgets)
    total_budget_spent = sum(b.spent for b in budgets)
    
    return jsonify({
        "monthly_income": monthly_income,
        "monthly_expenses": monthly_expenses,
        "net_income": monthly_income - monthly_expenses,
        "portfolio_value": portfolio_value,
        "total_budgets": len(budgets),
        "total_budget_limit": total_budget_limit,
        "total_budget_spent": total_budget_spent,
        "budget_utilization": (total_budget_spent / total_budget_limit * 100) if total_budget_limit > 0 else 0
    })