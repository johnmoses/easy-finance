from marshmallow import Schema, fields

class PortfolioSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.String()
    description = fields.String()
    created_at = fields.DateTime()
    is_modified = fields.Boolean()
    modified_at = fields.DateTime()
    is_deleted = fields.Boolean()
    deleted_at = fields.DateTime()
    restored_at = fields.DateTime()
