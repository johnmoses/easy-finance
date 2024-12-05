# """
# API functions
# """
from .models import db, Order

class OrderController:
    def __init__(self):
        pass

    def get_orders(last):
        orders = Order.query.limit(last)
        return orders if orders else []
    
    def get_order(id):
        order = Order.query.filter_by(id=id).first()
        return order if order else []

    def create_order(quantity,buy_price,sell_price,user_id,stock_id,strategy_id,account_id):
        order = Order(quantity,buy_price,sell_price,user_id,stock_id,strategy_id,account_id)
        db.session.add(order)
        db.session.commit()
