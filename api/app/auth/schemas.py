from app.extensions import ma
from app.auth.models import User

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        exclude = ("password_hash",)

user_schema = UserSchema()
users_schema = UserSchema(many=True)
