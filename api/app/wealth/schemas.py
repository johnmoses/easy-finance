from marshmallow import Schema, fields, validate

class InvestmentSchema(Schema):
    id = fields.Int(dump_only=True)
    symbol = fields.Str(required=True, validate=validate.Length(min=1))
    name = fields.Str(required=True, validate=validate.Length(min=1))
    quantity = fields.Float(required=True, validate=validate.Range(min=0))
    purchase_price = fields.Float(required=True, validate=validate.Range(min=0))
    current_price = fields.Float(validate=validate.Range(min=0))
    investment_type = fields.Str(validate=validate.OneOf(["stock", "crypto", "bond", "mutual_fund", "etf", "other"]))
    user_id = fields.Int(dump_only=True)
    account_id = fields.Int()

class SavingsGoalSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1))
    description = fields.Str()
    target_amount = fields.Float(required=True, validate=validate.Range(min=0))
    current_amount = fields.Float(dump_only=True)
    deadline = fields.Date(format="%Y-%m-%d")
    priority = fields.Str(validate=validate.OneOf(["low", "medium", "high"]))
    is_completed = fields.Bool(dump_only=True)
    user_id = fields.Int(dump_only=True)

class PriceAlertSchema(Schema):
    id = fields.Int(dump_only=True)
    symbol = fields.Str(required=True, validate=validate.Length(min=1))
    target_price = fields.Float(required=True, validate=validate.Range(min=0))
    condition = fields.Str(required=True, validate=validate.OneOf(["greater_than", "less_than"]))
    is_triggered = fields.Bool(dump_only=True)
    is_active = fields.Bool(dump_only=True)
    user_id = fields.Int(dump_only=True)