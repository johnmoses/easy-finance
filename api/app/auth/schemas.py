from app.extensions import ma
from marshmallow import validates, ValidationError, fields
from .models import User

class UserSchema(ma.SQLAlchemyAutoSchema):

    password = fields.Str(load_only=True, required=True)

    class Meta:
        model = User
        load_instance = True
        exclude = ('password_hash',)

    @validates('username')
    def validate_username(self, value):
        if len(value) < 3:
            raise ValidationError("Username must be at least 3 characters long.")

    @validates('email')
    def validate_email(self, value):
        if '@' not in value or '.' not in value:
            raise ValidationError("Invalid email address.")
