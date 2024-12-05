from graphene import Connection, Node, Int
from graphene_django.types import DjangoObjectType
from .models import (
    Stock, StockPrice, Strategy, Order
)


class StockConnection(Connection):
    class Meta:
        abstract = True
    count = Int()

    def resolve_count(root, info):
        return len(root.edges)

class StockType(DjangoObjectType):
    total_count = Int()
    class Meta:
        model = Stock
        filter_fields = {
            'symbol': ['exact', 'istartswith', 'icontains', 'iendswith'],
        }
        interfaces = (Node, )
        connection_class = StockConnection

class StockPriceType(DjangoObjectType):
    total_count = Int()
    class Meta:
        model = StockPrice
        filter_fields = {
            'id': ['exact', 'icontains'],
        }
        interfaces = (Node, )
        connection_class = StockConnection

class StrategyType(DjangoObjectType):
    total_count = Int()
    class Meta:
        model = Strategy
        filter_fields = {
            'id': ['exact', 'icontains'],
        }
        interfaces = (Node, )
        connection_class = StockConnection

class OrderType(DjangoObjectType):
    total_count = Int()
    class Meta:
        model = Order
        filter_fields = {
            'id': ['exact', 'icontains'],
        }
        interfaces = (Node, )
        connection_class = StockConnection