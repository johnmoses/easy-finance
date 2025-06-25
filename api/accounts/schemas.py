from marshmallow import Schema, fields

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str()
    email = fields.Str()
    transactions = fields.Nested('TransactionSchema', many=True)

class TransactionSchema(Schema):
    id = fields.Int(dump_only=True)
    sender = fields.Str()
    recipient = fields.Str()
    amount = fields.Float()
    timestamp = fields.DateTime(dump_only=True)
    user_id = fields.Int()

