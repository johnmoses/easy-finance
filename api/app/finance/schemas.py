from app.extensions import ma
from app.finance.models import Account, Transaction, Budget
from marshmallow import fields, validates, ValidationError

class AccountSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Account
        load_instance = True
        exclude = ('user_id',)
    
    @validates('account_type')
    def validate_account_type(self, value):
        valid_types = ['checking', 'savings', 'credit', 'investment']
        if value not in valid_types:
            raise ValidationError(f"Account type must be one of: {valid_types}")
    
    @validates('currency')
    def validate_currency(self, value):
        if len(value) != 3:
            raise ValidationError("Currency must be 3 characters (e.g., USD)")

class TransactionSchema(ma.SQLAlchemyAutoSchema):
    account_id = fields.Int(allow_none=True)
    budget_id = fields.Int(allow_none=True)
    class Meta:
        model = Transaction
        load_instance = True
        exclude = ('user_id',)
    
    @validates('amount')
    def validate_amount(self, value):
        if value == 0:
            raise ValidationError("Transaction amount cannot be zero")
    
    @validates('transaction_type')
    def validate_transaction_type(self, value):
        valid_types = ['expense', 'income', 'transfer']
        if value not in valid_types:
            raise ValidationError(f"Transaction type must be one of: {valid_types}")
    
    @validates('category')
    def validate_category(self, value):
        if not value or len(value.strip()) == 0:
            raise ValidationError("Category is required")
        
class BudgetSchema(ma.SQLAlchemyAutoSchema):
    remaining = fields.Float(dump_only=True)
    percentage_used = fields.Float(dump_only=True)
    
    class Meta:
        model = Budget
        load_instance = True
        exclude = ('user_id',)
    
    @validates('limit')
    def validate_limit(self, value):
        if value <= 0:
            raise ValidationError("Budget limit must be positive")
    
    @validates('spent')
    def validate_spent(self, value):
        if value < 0:
            raise ValidationError("Spent amount cannot be negative")
    
    @validates('period_end')
    def validate_period_end(self, value):
        if hasattr(self, 'period_start') and value <= self.period_start:
            raise ValidationError("Period end must be after period start")

account_schema = AccountSchema()
accounts_schema = AccountSchema(many=True)
transaction_schema = TransactionSchema()
transactions_schema = TransactionSchema(many=True)
budget_schema = BudgetSchema()
budgets_schema = BudgetSchema(many=True)