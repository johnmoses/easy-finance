from marshmallow import Schema, fields

class AccountSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.String()
    description = fields.String()
    balance = fields.Float()
    currency = fields.String()
    created_at = fields.DateTime()
    is_modified = fields.Boolean()
    modified_at = fields.DateTime()
    is_deleted = fields.Boolean()
    deleted_at = fields.DateTime()
    restored_at = fields.DateTime()

class TransactionSchema(Schema):
    id = fields.Int(dump_only=True)
    amount = fields.Float()
    description = fields.String()
    created_at = fields.DateTime()
    account_id = fields.Int()
    user_id = fields.Int()