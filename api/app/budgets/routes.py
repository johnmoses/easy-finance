from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.budgets.models import Budget
from app.extensions import db

budgets_bp = Blueprint("budgets", __name__)

@budgets_bp.route("/budgets", methods=["GET"])
@jwt_required()
def get_budgets():
    user_id = get_jwt_identity()
    budgets = Budget.query.filter_by(user_id=user_id).all()
    results = [{
        "id": b.id,
        "name": b.name,
        "limit": b.limit,
        "period_start": b.period_start.isoformat(),
        "period_end": b.period_end.isoformat()
    } for b in budgets]
    return jsonify(results)

@budgets_bp.route("/budgets", methods=["POST"])
@jwt_required()
def create_budget():
    data = request.get_json()
    user_id = get_jwt_identity()
    budget = Budget(
        name=data.get("name"),
        limit=data.get("limit"),
        user_id=user_id,
        period_start=data.get("period_start"),
        period_end=data.get("period_end"),
    )
    db.session.add(budget)
    db.session.commit()
    return jsonify({
        "id": budget.id,
        "name": budget.name,
        "limit": budget.limit,
        "period_start": budget.period_start.isoformat(),
        "period_end": budget.period_end.isoformat()
    }), 201
