import datetime
from config.db import db

class Order(db.Model):
    __tablename__ = 'orders_order'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    quantity = db.Column(db.Integer, nullable=True)
    active = db.Column(db.Boolean, default=False)
    short = db.Column(db.Boolean, default=False)
    buy_price = db.Column(db.Float, nullable=True)
    buy_time = db.Column(db.DateTime, default=datetime.datetime.now())
    sell_price = db.Column(db.Float, nullable=True)
    sell_time = db.Column(db.DateTime, default=datetime.datetime.now())
    buy_indicator = db.Column(db.String(100), nullable=True)
    sell_indicator = db.Column(db.String(100), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('User.id'))
    stock_id = db.Column(db.Integer, db.ForeignKey('stocks_stock.id'))
    strategy_id = db.Column(db.Integer, db.ForeignKey('stocks_strategy.id'))
    account_id = db.Column(db.Integer, db.ForeignKey('finance_account.id'))
    created_at = db.Column(db.DateTime, default=datetime.datetime.now())

    user = db.relationship('User', backref="userorders", cascade='all,delete')
    stock = db.relationship("Stock", backref="stockorders", viewonly=True, cascade='all,delete')
    strategy = strategy = db.relationship("Strategy", backref="strategyorders", viewonly=True, cascade='all,delete')
    account = db.relationship("Account", backref="accountorders", viewonly=True, cascade='all,delete')
    
    def __init__(self,quantity,buy_price,sell_price,user_id,stock_id,strategy_id,account_id):
        self.quantity = quantity
        self.buy_price = buy_price
        self.sell_price = sell_price
        self.user_id = user_id
        self.stock_id = stock_id
        self.strategy_id = strategy_id
        self.account_id = account_id

    def __repr__(self):
        return 'Order {}'.format(self.id)
    