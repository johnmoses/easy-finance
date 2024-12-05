import graphene
from django.db.models import Q, F, ExpressionWrapper, IntegerField
from graphene_django.filter import DjangoFilterConnectionField
from .models import (
    Stock, StockPrice, Strategy, Order
)
from .types import (
    StockType, StockPriceType, StrategyType, OrderType
)


class Query(graphene.ObjectType):
    stocks = DjangoFilterConnectionField(
        StockType, search=graphene.String(), max_limit=None)
    stockprices = DjangoFilterConnectionField(
        StockPriceType, max_limit=None)
    strategies = DjangoFilterConnectionField(
        StrategyType, max_limit=None)
    orders = DjangoFilterConnectionField(
        OrderType, search=graphene.String(), max_limit=None)

    stock = graphene.relay.Node.Field(StockType)
    stockprice = graphene.relay.Node.Field(StockPriceType)
    strategy = graphene.relay.Node.Field(StrategyType)
    order = graphene.relay.Node.Field(OrderType)

    def resolve_stocks(root, info, search=None, **kwargs):
        if search:
            filter = (
                Q(symbol__icontains=search)
            )
            return Stock.objects.filter(filter)
        return Stock.objects.all()

    def resolve_stockprices(root, info, **kwargs):
        return StockPrice.objects.all()

    def resolve_strategies(root, info, **kwargs):
        return Strategy.objects.all()

    def resolve_orders(root, info, search=None, **kwargs):
        if search:
            filter = (
                Q(symbol__icontains=search)
            )
            return Order.objects.filter(filter)
        return Order.objects.all()

    def resolve_stock(root, info, **kwargs):
        return Stock.objects.get(id=kwargs.get('id'))

    def resolve_stockprice(root, info, **kwargs):
        return StockPrice.objects.get(id=kwargs.get('id'))

    def resolve_strategy(root, info, **kwargs):
        return Strategy.objects.get(id=kwargs.get('id'))

    def resolve_order(root, info, **kwargs):
        return Order.objects.get(id=kwargs.get('id'))
