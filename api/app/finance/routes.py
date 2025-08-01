from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.finance.models import Account, Transaction
from app.finance.schemas import account_schema, accounts_schema, transaction_schema, transactions_schema
from app.planning.models import Budget
from app.ai.categorizer import auto_categorize_transaction
from app.extensions import db

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
        for key, value in data.items():
            if hasattr(account, key) and key != 'user_id':
                setattr(account, key, value)
        db.session.commit()
        return jsonify(account_schema.dump(account))
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
        
        # Update account balance
        if transaction.account_id:
            account = Account.query.get(transaction.account_id)
            if transaction.transaction_type == 'expense':
                account.balance -= transaction.amount
            elif transaction.transaction_type == 'income':
                account.balance += transaction.amount
        
        # Update budget spent amount if budget_id provided
        if transaction.budget_id and transaction.transaction_type == 'expense':
            budget = Budget.query.get(transaction.budget_id)
            budget.spent += transaction.amount
        
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
        # Update account balance
        if transaction.account_id:
            account = Account.query.get(transaction.account_id)
            if transaction.transaction_type == 'expense':
                account.balance += transaction.amount  # Reverse the expense
            elif transaction.transaction_type == 'income':
                account.balance -= transaction.amount  # Reverse the income
        
        # Update budget spent amount
        if transaction.budget_id and transaction.transaction_type == 'expense':
            budget = Budget.query.get(transaction.budget_id)
            budget.spent -= transaction.amount
        
        db.session.delete(transaction)
        db.session.commit()
        return jsonify({"message": "Transaction deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to delete transaction"}), 500