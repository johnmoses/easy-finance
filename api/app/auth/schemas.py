from app.extensions import ma
from marshmallow import validates, ValidationError, fields
from .models import User, Plan, Subscription, Team, TeamMember

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


class PlanSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Plan
        load_instance = True

class SubscriptionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Subscription
        include_fk = True
        load_instance = True
    
    plan = ma.Nested(PlanSchema)

class TeamMemberSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TeamMember
        load_instance = True

class TeamSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Team
        load_instance = True
    
    members = ma.Nested(TeamMemberSchema, many=True)
    subscription = ma.Nested(SubscriptionSchema)

plan_schema = PlanSchema()
plans_schema = PlanSchema(many=True)
subscription_schema = SubscriptionSchema()
team_schema = TeamSchema()