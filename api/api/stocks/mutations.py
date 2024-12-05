import graphene
from graphql_relay.node.node import from_global_id
from graphql import GraphQLError
from django.utils import timezone
from .models import (
    Stock, StockPrice, Strategy, Order
)
from .types import (
    StockType, StockPriceType, StrategyType, OrderType
)
from ..accounts.models import User
from ..finance.models import Account

currentTime = timezone.now()


class StockCreate(graphene.relay.ClientIDMutation):
    stock = graphene.Field(StockType)

    class Input:
        symbol = graphene.String()
        name = graphene.String()
        description = graphene.String()
        exchange = graphene.String()

    def mutate_and_get_payload(self, info, **input):
        stock = Stock(
            symbol=input.get('symbol'),
            name=input.get('name'),
            description=input.get('description'),
            exchange=input.get('exchange'),
            created_at=currentTime,
        )
        stock.save()
        return StockCreate(stock=stock)

class StockUpdate(graphene.relay.ClientIDMutation):
    stock = graphene.Field(StockType)

    class Input:
        id = graphene.ID()
        symbol = graphene.String()
        name = graphene.String()
        description = graphene.String()
        exchange = graphene.String()

    def mutate_and_get_payload(self, info, **input):
        stock = Stock.objects.get(pk=from_global_id(input.get('id'))[1])
        stock.symbol=input.get('symbol')
        stock.name=input.get('name')
        stock.description=input.get('description')
        stock.exchange=input.get('exchange')
        stock.is_modified=True
        stock.modified_at=currentTime
        stock.save()
        return StockUpdate(stock=stock)
    
class StockDelete(graphene.relay.ClientIDMutation):
    stock = graphene.Field(StockType)

    class Input:
        id = graphene.ID()
        is_deleted = graphene.Boolean()

    def mutate_and_get_payload(self, info, **input):
        stock = Stock.objects.get(pk=from_global_id(input.get('id'))[1])
        is_deleted = input.get('is_deleted')
        stock.is_deleted = is_deleted
        if(is_deleted == False):
            stock.restored_at=currentTime
        else:
            stock.deleted_at=currentTime
        stock.save()
        return StockDelete(stock=stock)

    
class StockRemove(graphene.relay.ClientIDMutation):
    stock = graphene.Field(StockType)

    class Input:
        id = graphene.ID()

    def mutate_and_get_payload(self, info, **input):
        adminuser = info.context.user
        if (adminuser.is_admin == False):
            raise GraphQLError('Need to be at least an admin user')
        stock = Stock.objects.get(pk=from_global_id(input.get('id'))[1])

        stock.delete()
        return StockRemove(stock=stock)

class StockPriceCreate(graphene.relay.ClientIDMutation):
    stockprice = graphene.Field(StockPriceType)

    class Input:
        stock_id = graphene.ID()
        open = graphene.String()
        high = graphene.String()
        low = graphene.String()
        close = graphene.String()
        volume = graphene.String()
        description = graphene.String()

    def mutate_and_get_payload(self, info, **input):
        stock = Stock.objects.get(pk=from_global_id(input.get('stock_id'))[1])
        stockprice = StockPrice(
            open=input.get('open'),
            high=input.get('high'),
            low=input.get('low'),
            close=input.get('close'),
            volume=input.get('volume'),
            description=input.get('description'),
            created_at=currentTime,
        )
        stockprice.save()
        return StockPriceCreate(stockprice=stockprice)

class StrategyCreate(graphene.relay.ClientIDMutation):
    strategy = graphene.Field(StrategyType)

    class Input:
        name = graphene.String()

    def mutate_and_get_payload(self, info, **input):
        strategy = Strategy(
            name=input.get('name'),
            created_at=currentTime,
        )
        strategy.save()
        return StrategyCreate(strategy=strategy)

class OrderCreate(graphene.relay.ClientIDMutation):
    order = graphene.Field(OrderType)

    class Input:
        stock_id = graphene.ID()
        strategy_id = graphene.ID()
        account_id = graphene.ID()
        symbol = graphene.String()
        quantity = graphene.Float()
        buy_price = graphene.Float()
        sell_price = graphene.Float()

    def mutate_and_get_payload(self, info, **input):
        user = info.context.user
        stock = Stock.objects.get(pk=from_global_id(input.get('stock_id'))[1])
        strategy = Strategy.objects.get(pk=from_global_id(input.get('strategy_id'))[1])
        account = Account.objects.get(pk=from_global_id(input.get('account_id'))[1])
        order = Order(
            user=user,
            stock=stock,
            strategy=strategy,
            account=account,
            symbol=input.get('symbol'),
            quantity=input.get('quantity'),
            buy_price=input.get('buy_price'),
            sell_price=input.get('sell_price'),
            created_at=currentTime,
        )
        order.save()
        return OrderCreate(order=order)

class OrderUpdate(graphene.relay.ClientIDMutation):
    order = graphene.Field(OrderType)

    class Input:
        id = graphene.ID()
        stock_id = graphene.ID()
        strategy_id = graphene.ID()
        account_id = graphene.ID()
        symbol = graphene.String()
        quantity = graphene.Float()
        buy_price = graphene.String()
        sell_price = graphene.String()

    def mutate_and_get_payload(self, info, **input):
        user = info.context.user
        order = Order.objects.get(pk=from_global_id(input.get('id'))[1])
        stock = Stock.objects.get(pk=from_global_id(input.get('stock_id'))[1])
        strategy = Strategy.objects.get(pk=from_global_id(input.get('strategy_id'))[1])
        account = Account.objects.get(pk=from_global_id(input.get('account_id'))[1])
        
        order.user=user
        order.stock=stock
        order.strategy=strategy
        order.account=account
        order.symbol=input.get('symbol')
        order.quantity=input.get('quantity')
        order.buy_price=input.get('buy_price')
        order.sell_price=input.get('sell_price')
        order.is_modified=True
        order.modified_at=currentTime
        order.save()
        return OrderUpdate(order=order)
    
class OrderDelete(graphene.relay.ClientIDMutation):
    order = graphene.Field(OrderType)

    class Input:
        id = graphene.ID()
        is_deleted = graphene.Boolean()

    def mutate_and_get_payload(self, info, **input):
        order = Order.objects.get(pk=from_global_id(input.get('id'))[1])
        is_deleted = input.get('is_deleted')
        order.is_deleted = is_deleted
        if(is_deleted == False):
            order.restored_at=currentTime
        else:
            order.deleted_at=currentTime
        order.save()
        return OrderDelete(order=order)

    
class OrderRemove(graphene.relay.ClientIDMutation):
    order = graphene.Field(OrderType)

    class Input:
        id = graphene.ID()

    def mutate_and_get_payload(self, info, **input):
        adminuser = info.context.user
        if (adminuser.is_admin == False):
            raise GraphQLError('Need to be at least an admin user')
        order = Order.objects.get(pk=from_global_id(input.get('id'))[1])

        order.delete()
        return OrderRemove(order=order)
