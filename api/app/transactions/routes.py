from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.transactions.models import Transaction
from app.extensions import db

transactions_bp = Blueprint("transactions", __name__)

@transactions_bp.route("/transactions", methods=["POST"])
@jwt_required()
def create_transaction():
    data = request.get_json()
    trx = Transaction(
        amount=data.get("amount"),
        category=data.get("category"),
        description=data.get("description"),
        budget_id=data.get("budget_id"),
        timestamp=data.get("timestamp")  # optional, expects ISO string or None
    )
    db.session.add(trx)
    db.session.commit()
    return jsonify({"id": trx.id}), 201

@transactions_bp.route("/transactions/<int:budget_id>", methods=["GET"])
@jwt_required()
def list_transactions(budget_id):
    transactions = Transaction.query.filter_by(budget_id=budget_id).all()
    results = [{
        "id": trx.id,
        "amount": trx.amount,
        "category": trx.category,
        "description": trx.description,
        "timestamp": trx.timestamp.isoformat()
    } for trx in transactions]
    return jsonify(results)
