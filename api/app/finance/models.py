from app.extensions import db
from datetime import datetime
from sqlalchemy import event

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

class Budget(db.Model):
    __tablename__ = "budgets"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False, default='general')
    limit = db.Column(db.Float, nullable=False)
    spent = db.Column(db.Float, nullable=False, default=0.0)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    period_start = db.Column(db.Date, nullable=False, default=datetime.today)
    period_end = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    @property
    def remaining(self):
        return self.limit - self.spent
    
    @property
    def percentage_used(self):
        return (self.spent / self.limit * 100) if self.limit > 0 else 0

@event.listens_for(Transaction, 'after_insert')
def after_transaction_insert(mapper, connection, target):
    if target.account_id:
        account = db.session.get(Account, target.account_id)
        if account:
            if target.transaction_type == 'expense':
                account.balance -= target.amount
            elif target.transaction_type == 'income':
                account.balance += target.amount

    if target.budget_id and target.transaction_type == 'expense':
        budget = db.session.get(Budget, target.budget_id)
        if budget:
            budget.spent += target.amount

@event.listens_for(Transaction, 'after_delete')
def after_transaction_delete(mapper, connection, target):
    if target.account_id:
        account = db.session.get(Account, target.account_id)
        if account:
            if target.transaction_type == 'expense':
                account.balance += target.amount
            elif target.transaction_type == 'income':
                account.balance -= target.amount

    if target.budget_id and target.transaction_type == 'expense':
        budget = db.session.get(Budget, target.budget_id)
        if budget:
            budget.spent -= target.amount
