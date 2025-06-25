from marshmallow import Schema, fields


class TransactionSchema(Schema):
    id = fields.Int(dump_only=True)
    sender = fields.Str()
    recipient = fields.Str()
    amount = fields.Float()
    timestamp = fields.DateTime(dump_only=True)
