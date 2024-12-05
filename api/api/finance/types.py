from graphene import Connection, Node, Int
from graphene_django.types import DjangoObjectType
from .models import (
    Account, Transaction
)


class FinanceConnection(Connection):
    class Meta:
        abstract = True
    count = Int()

    def resolve_count(root, info):
        return len(root.edges)

class AccountType(DjangoObjectType):
    total_count = Int()
    class Meta:
        model = Account
        filter_fields = {
            'id': ['exact', 'icontains'],
            'name': ['exact', 'istartswith', 'icontains', 'iendswith'],
        }
        interfaces = (Node, )
        connection_class = FinanceConnection

class TransactionType(DjangoObjectType):
    total_count = Int()
    class Meta:
        model = Transaction
        filter_fields = {
            'id': ['exact', 'icontains'],
        }
        interfaces = (Node, )
        connection_class = FinanceConnection
