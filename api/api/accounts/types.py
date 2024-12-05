from graphene import Connection, Node, Int
from graphene_django import DjangoObjectType
from .models import User


class UserConnection(Connection):
    class Meta:
        abstract = True
    count = Int()

    def resolve_count(root, info):
        return len(root.edges)


class UserType(DjangoObjectType):
    class Meta:
        model = User
        filter_fields = {
            'id': ['exact', 'icontains'],
            'username': ['exact', 'istartswith', 'icontains', 'iendswith'],
            'first_name': ['exact', 'istartswith', 'icontains', 'iendswith'],
            'last_name': ['exact', 'istartswith', 'icontains', 'iendswith'],
            'is_verified': ['exact', 'icontains'],
            'is_deleted': ['exact', 'icontains'],
        }
        interfaces = (Node, )
        connection_class = UserConnection
