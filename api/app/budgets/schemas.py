from app.extensions import ma
from app.budgets.models import Budget

class BudgetSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Budget
        load_instance = True

budget_schema = BudgetSchema()
budgets_schema = BudgetSchema(many=True)
