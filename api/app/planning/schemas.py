from app.extensions import ma
from app.planning.models import Budget
from marshmallow import fields, validates, ValidationError
from datetime import date

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

budget_schema = BudgetSchema()
budgets_schema = BudgetSchema(many=True)