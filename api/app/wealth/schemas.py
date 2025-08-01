from app.extensions import ma
from app.wealth.models import Investment, SavingsGoal, Notification, PriceAlert
from marshmallow import fields, validates, ValidationError

class InvestmentSchema(ma.SQLAlchemyAutoSchema):
    total_value = fields.Float(dump_only=True)
    profit_loss = fields.Float(dump_only=True)
    profit_loss_percentage = fields.Float(dump_only=True)
    
    class Meta:
        model = Investment
        load_instance = True
        exclude = ('user_id',)

class SavingsGoalSchema(ma.SQLAlchemyAutoSchema):
    progress_percentage = fields.Float(dump_only=True)
    remaining_amount = fields.Float(dump_only=True)
    days_remaining = fields.Int(dump_only=True)
    
    class Meta:
        model = SavingsGoal
        load_instance = True
        exclude = ('user_id',)
    
    @validates('target_amount')
    def validate_target_amount(self, value):
        if value <= 0:
            raise ValidationError("Target amount must be positive")

class NotificationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Notification
        load_instance = True
        exclude = ('user_id',)

class PriceAlertSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PriceAlert
        load_instance = True
        exclude = ('user_id',)
    
    @validates('condition')
    def validate_condition(self, value):
        if value not in ['above', 'below']:
            raise ValidationError("Condition must be 'above' or 'below'")

investment_schema = InvestmentSchema()
investments_schema = InvestmentSchema(many=True)
savings_goal_schema = SavingsGoalSchema()
savings_goals_schema = SavingsGoalSchema(many=True)
notification_schema = NotificationSchema()
notifications_schema = NotificationSchema(many=True)
price_alert_schema = PriceAlertSchema()
price_alerts_schema = PriceAlertSchema(many=True)