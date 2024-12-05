from marshmallow import Schema, fields

class OrderSchema(Schema):
    id = fields.Int(dump_only=True)
    symbol = fields.String()
    quantity = fields.Int()
    active = fields.Boolean()
    short = fields.Boolean()
    buy_price = fields.Float()
    buy_time = fields.DateTime()
    sell_price = fields.Float()
    sell_time = fields.DateTime()
    buy_indicator = fields.String()
    sell_indicator = fields.String()
    created_at = fields.DateTime()
    user_id = fields.Int()
    stock_id = fields.Int()
    strategy_id = fields.Int()
    account_id = fields.Int()