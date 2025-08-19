from app.extensions import db
from datetime import datetime
from sqlalchemy import event
from app.planning.models import Budget

class Account(db.Model):
    __tablename__ = "accounts"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    account_type = db.Column(db.String(50), nullable=False)  # checking, savings, credit, investment
    balance = db.Column(db.Float, default=0.0)
    currency = db.Column(db.String(3), default='USD')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Transaction(db.Model):
    __tablename__ = "transactions"
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(20), nullable=False, default='expense')  # expense, income, transfer
    category = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.id"), nullable=False)
    budget_id = db.Column(db.Integer, db.ForeignKey("budgets.id"), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

@event.listens_for(Transaction, 'after_insert')
def after_transaction_insert(mapper, connection, target):
    if target.account_id:
        account = Account.query.get(target.account_id)
        if account:
            if target.transaction_type == 'expense':
                account.balance -= target.amount
            elif target.transaction_type == 'income':
                account.balance += target.amount

    if target.budget_id and target.transaction_type == 'expense':
        budget = Budget.query.get(target.budget_id)
        if budget:
            budget.spent += target.amount
    db.session.commit()

@event.listens_for(Transaction, 'after_delete')
def after_transaction_delete(mapper, connection, target):
    if target.account_id:
        account = Account.query.get(target.account_id)
        if account:
            if target.transaction_type == 'expense':
                account.balance += target.amount
            elif target.transaction_type == 'income':
                account.balance -= target.amount

    if target.budget_id and target.transaction_type == 'expense':
        budget = Budget.query.get(target.budget_id)
        if budget:
            budget.spent -= target.amount
    db.session.commit()