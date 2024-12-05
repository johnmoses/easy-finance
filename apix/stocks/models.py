import datetime
from config.db import db

class Stock(db.Model):
    __tablename__ = 'stocks_stock'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    symbol = db.Column(db.String(255))
    name = db.Column(db.String(255), nullable=True)
    description = db.Column(db.String(225), nullable=True)
    exchange = db.Column(db.String(225), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.now())
    is_modified = db.Column(db.Boolean, default=False)
    modified_at = db.Column(db.DateTime, default=datetime.datetime.now())
    is_deleted = db.Column(db.Boolean, default=False)
    deleted_at = db.Column(db.DateTime, default=datetime.datetime.now())
    restored_at = db.Column(db.DateTime, default=datetime.datetime.now())

    def __init__(self, symbol, name):
        self.symbol = symbol
        self.name = name

    def __repr__(self):
        return 'Stock {}'.format(self.id)

class StockPrice(db.Model):
    __tablename__ = 'stocks_stockprice'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    open = db.Column(db.Float, nullable=True)
    high = db.Column(db.Float, nullable=True)
    low = db.Column(db.Float, nullable=True)
    close = db.Column(db.Float, nullable=True)
    volume = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.now())
    stock_id = db.Column(db.Integer, db.ForeignKey('stocks_stock.id'))

    stock = db.relationship("Stock", backref="stockstockprice", viewonly=True, cascade='all,delete')

    def __init__(self, open,high,low,close,volume,stock_id):
        self.open = open
        self.high = high
        self.low = low
        self.close = close;
        self.volume = volume
        self.stock_id = stock_id

    def __repr__(self):
        return 'StockPrice {}'.format(self.id)

class Strategy(db.Model):
    __tablename__ = 'stocks_strategy'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(225), nullable=False)
    perform_order = db.Column(db.Boolean, default=False)
    priority = db.Column(db.Integer, nullable=True)
    maximum_allocation = db.Column(db.Integer, nullable=True)
    minimum_allocation = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.now())
    is_modified = db.Column(db.Boolean, default=False)
    modified_at = db.Column(db.DateTime, default=datetime.datetime.now())
    is_deleted = db.Column(db.Boolean, default=False)
    deleted_at = db.Column(db.DateTime, default=datetime.datetime.now())
    restored_at = db.Column(db.DateTime, default=datetime.datetime.now())

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return 'Strategy {}'.format(self.id)
