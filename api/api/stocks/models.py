from django.db import models
from django.conf import settings
from django.utils import timezone
from ..finance.models import Account

class Stock(models.Model):
    """ 
    Trading Product, ticker or asset
    """
    symbol = models.CharField(max_length=255, blank=False)
    name = models.TextField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    exchange = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_modified = models.BooleanField(default=False)
    modified_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(auto_now_add=True)
    restored_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

class StockPrice(models.Model):
    """ 
    Stock Prices with OHLC model
    """
    stock = models.ForeignKey(
        Stock, on_delete=models.CASCADE,
        related_name='stock_prices', null=True
    )
    open = models.FloatField(blank=True,null=True)
    high = models.FloatField(blank=True,null=True)
    low = models.FloatField(blank=True,null=True)
    close = models.FloatField(blank=True,null=True)
    volume = models.FloatField(blank=True,null=True)
    created_at = models.DateTimeField(default=timezone.now, blank=True)

class Strategy(models.Model):
    """ 
    Strategy
    """
    name = models.CharField(max_length=255, blank=False)
    perform_order = models.BooleanField(blank=True,default=False)
    priority = models.IntegerField(null=True, blank=True, default=1000)
    maximum_allocation = models.FloatField(blank=True,null=True)
    minimum_allocation = models.FloatField(blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_modified = models.BooleanField(default=False)
    modified_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(auto_now_add=True)
    restored_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ["name"]
        
    def __str__(self):
        return self.name

class Order(models.Model):
    """ 
    Order or trade
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='user_orders',
        on_delete=models.CASCADE
    )
    stock = models.ForeignKey(
        Stock, on_delete=models.CASCADE,
        related_name='stock_orders', null=True
    )
    strategy = models.ForeignKey(
        Strategy, on_delete=models.CASCADE,
        related_name='strategy_orders', null=True
    )
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE,
        related_name='account_orders', null=True
    )
    quantity = models.FloatField(blank=True,null=True)
    active = models.BooleanField(blank=False,default=True)
    short = models.BooleanField(blank=False,default=False)
    buy_price = models.FloatField(blank=True,null=True)
    buy_time = models.DateTimeField(null=True, blank=True)
    sell_price = models.FloatField(blank=True,null=True)
    sell_time = models.DateTimeField(null=True, blank=True)
    buy_indicator = models.CharField(max_length=100, null=True, blank=True)
    sell_indicator = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now, blank=True)

    def __str__(self):
        return self.action.name + " "+ str(self.entering_date)
