from django.contrib import admin
from .models import Stock, StockPrice, Strategy, Order

admin.site.register(Stock)
admin.site.register(StockPrice)
admin.site.register(Strategy)
admin.site.register(Order)