import graphene
from .queries import Query
from .mutations import (
    StockCreate, StockUpdate, StockDelete, StockRemove,
    StockPriceCreate, StrategyCreate,
    OrderCreate, OrderUpdate, OrderDelete, OrderRemove
)


class Queries(Query, graphene.ObjectType):
    pass


class Mutations(graphene.ObjectType):
    stock_create = StockCreate.Field()
    stock_update = StockUpdate.Field()
    stock_delete = StockDelete.Field()
    stock_remove = StockRemove.Field()
    stockprice_create = StockPriceCreate.Field()
    strategy_create = StrategyCreate.Field()
    order_create = OrderCreate.Field()
    order_update = OrderUpdate.Field()
    order_delete = OrderDelete.Field()
    order_remove = OrderRemove.Field()
