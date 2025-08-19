from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.finance.models import Account, Transaction
from app.finance.schemas import account_schema, accounts_schema, transaction_schema, transactions_schema
from app.finance.budget_models import Budget
from app.finance.budget_schemas import budget_schema, budgets_schema
from app.ai.categorizer import auto_categorize_transaction
from app.extensions import db
from app.finance.services import process_uploaded_transactions
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from app.wealth.models import Investment

finance_bp = Blueprint("finance", __name__)

# ===== ACCOUNTS ROUTES =====
@finance_bp.route("/accounts", methods=["GET"])
@jwt_required()
def get_accounts():
    user_id = get_jwt_identity()
    accounts = Account.query.filter_by(user_id=user_id, is_active=True).all()
    return jsonify(accounts_schema.dump(accounts))

@finance_bp.route("/accounts", methods=["POST"])
@jwt_required()
def create_account():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    errors = account_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    
    try:
        account = account_schema.load(data)
        account.user_id = get_jwt_identity()  # Set user_id after loading
        db.session.add(account)
        db.session.commit()
        return jsonify(account_schema.dump(account)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create account"}), 500

@finance_bp.route("/accounts/<int:account_id>", methods=["PUT"])
@jwt_required()
def update_account(account_id):
    user_id = get_jwt_identity()
    account = Account.query.filter_by(id=account_id, user_id=user_id).first()
    if not account:
        return jsonify({"error": "Account not found"}), 404
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    errors = account_schema.validate(data, partial=True)
    if errors:
        return jsonify(errors), 400
    
    try:
        # Load data with partial=True to allow partial updates
        updated_account_data = account_schema.load(data, partial=True)
        
        # Update account attributes from the loaded data
        for key, value in updated_account_data.items():
            setattr(account, key, value)
            
        db.session.commit()
        return jsonify(account_schema.dump(account))
    except ValidationError as err:
        db.session.rollback()
        return jsonify(err.messages), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update account"}), 500

# ===== TRANSACTIONS ROUTES =====
@finance_bp.route("/transactions", methods=["POST"])
@jwt_required()
def create_transaction():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    user_id = get_jwt_identity()
    
    # Validate account ownership if account_id provided
    if data.get("account_id"):
        account = Account.query.filter_by(id=data["account_id"], user_id=user_id).first()
        if not account:
            return jsonify({"error": "Account not found or access denied"}), 404
    
    # Validate budget ownership if budget_id provided
    if data.get("budget_id"):
        budget = Budget.query.filter_by(id=data["budget_id"], user_id=user_id).first()
        if not budget:
            return jsonify({"error": "Budget not found or access denied"}), 404
    
    # Auto-categorize if no category provided
    if not data.get("category") and data.get("description"):
        data["category"] = auto_categorize_transaction(data["description"])
    
    errors = transaction_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    
    try:
        transaction = transaction_schema.load(data)
        transaction.user_id = user_id  # Set user_id after loading
        db.session.add(transaction)
        db.session.commit()
        return jsonify(transaction_schema.dump(transaction)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create transaction"}), 500

@finance_bp.route("/transactions", methods=["GET"])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    account_id = request.args.get('account_id')
    budget_id = request.args.get('budget_id')
    
    query = Transaction.query.filter_by(user_id=user_id)
    if account_id:
        query = query.filter_by(account_id=account_id)
    if budget_id:
        query = query.filter_by(budget_id=budget_id)
    
    transactions = query.order_by(Transaction.timestamp.desc()).all()
    return jsonify(transactions_schema.dump(transactions))

@finance_bp.route("/transactions/<int:transaction_id>", methods=["DELETE"])
@jwt_required()
def delete_transaction(transaction_id):
    user_id = get_jwt_identity()
    transaction = Transaction.query.filter_by(id=transaction_id, user_id=user_id).first()
    if not transaction:
        return jsonify({"error": "Transaction not found"}), 404
    
    try:
        db.session.delete(transaction)
        db.session.commit()
        return jsonify({"message": "Transaction deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete transaction"}), 500

# ===== BUDGETS ROUTES =====
@finance_bp.route("/budgets", methods=["GET"])
@jwt_required()
def get_budgets():
    user_id = get_jwt_identity()
    budgets = Budget.query.filter_by(user_id=user_id).all()
    return jsonify(budgets_schema.dump(budgets))

@finance_bp.route("/budgets", methods=["POST"])
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

@finance_bp.route("/budgets/<int:budget_id>", methods=["PUT"])
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
        # Load data with partial=True to allow partial updates
        updated_budget_data = budget_schema.load(data, partial=True)
        
        # Update budget attributes from the loaded data
        for key, value in updated_budget_data.items():
            setattr(budget, key, value)
            
        db.session.commit()
        return jsonify(budget_schema.dump(budget))
    except ValidationError as err:
        db.session.rollback()
        return jsonify(err.messages), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update budget"}), 500

@finance_bp.route("/budgets/<int:budget_id>", methods=["DELETE"])
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

# ===== TRANSACTION FILE UPLOAD ROUTES =====
@finance_bp.route("/transactions/upload", methods=["POST"])
@jwt_required()
def upload_transactions():
    user_id = get_jwt_identity()
    account_id = request.args.get('account_id') # Assuming account_id is passed as a query parameter

    if not account_id:
        return jsonify({"error": "Account ID is required"}), 400

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        try:
            result = process_uploaded_transactions(file.stream, file.filename, user_id, account_id)
            message = f"Successfully processed {result['processed_count']} transactions. "                       f"{result['skipped_count']} duplicates were skipped."
            return jsonify({
                "message": message,
                "transactions": transactions_schema.dump(result['saved_transactions'])
            }), 200
        except Exception as e:
            db.session.rollback() # Rollback any partial changes
            return jsonify({"error": str(e)}), 500

# ===== ANALYTICS ROUTES =====
@finance_bp.route("/analytics/spending-by-category", methods=["GET"])
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

@finance_bp.route("/analytics/monthly-trends", methods=["GET"])
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

@finance_bp.route("/analytics/budget-performance", methods=["GET"])
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

@finance_bp.route("/analytics/financial-summary", methods=["GET"])
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