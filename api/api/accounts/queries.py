import graphene
from graphql import GraphQLError
from django.db.models import Q
from graphene_django.filter import DjangoFilterConnectionField
from .models import User
from .types import UserType


class Query(graphene.ObjectType):
    users = DjangoFilterConnectionField(UserType, search=graphene.String(), max_limit=None)

    user = graphene.relay.Node.Field(UserType)
    me = graphene.Field(UserType)

    def resolve_users(root, info, search=None, **kwargs):
        if search:
            filter = (
                Q(username__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )
            return User.objects.filter(filter)
        return User.objects.all()

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('Not signed in')
        if not user.is_verified:
            raise GraphQLError('Not verified')
        return user

    def resolve_user(root, info, **kwargs):
        return User.objects.get(id=kwargs.get('id'))
