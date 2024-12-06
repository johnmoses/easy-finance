# """
# API functions
# """
import os
from datetime import datetime, timedelta
import alpaca_trade_api as tradeapi
from alpaca_trade_api.rest import TimeFrame
from sqlalchemy import desc, text
from sqlalchemy.dialects.postgresql import insert
from .models import db, Stock, StockPrice, Strategy
from core.stock import Stock as ST
from core.scrapper import Scrapper

# api = tradeapi.REST(
#     os.environ['ALPACA_API_KEY'], 
#     os.environ['ALPACA_API_SECRET'], 
#     base_url=os.environ['ALPACA_API_URL']
#     )

class StockController:
    def __init__(self):
        pass

    def get_stocks(last):
        stocks = Stock.query.limit(last)
        return stocks if stocks else []
    
    def get_stock(id):
        stock = Stock.query.filter_by(id=id).first()
        return stock if stock else []

    def get_stickers():
        scraper = Scrapper()
        result = scraper.get_tickers()
        return result if result else []


    def get_top_gainers():
        scraper = Scrapper()
        result = scraper.get_top_gainers()
        return result if result else []

    def get_stock_prices(symbol):
        scraper = Scrapper()
        result = scraper.get_stock_prices(symbol)
        return result if result else []

    def get_stock_returns(symbol):
        start = datetime.now() - timedelta(days=365*5)
        end = datetime.now()
        st = ST(symbol,start,end)
        result = st.get_returns()
        return result if result else []

    def plot_stock_returns(symbol):
        start = datetime.now() - timedelta(days=365*5)
        end = datetime.now()
        st = ST(symbol,start,end)
        result = st.plot_returns()
        return result

    def create_stock(symbol,name):
        stock = Stock(symbol,name)
        db.session.add(stock)
        db.session.commit()

    def populate_stock():
        select_stmt = text("SELECT symbol, name FROM stocks_stock")
        insert_stmt = text(
            'INSERT INTO stocks_stock (symbol,name,created_at,modified_at) VALUES (:symbol,:name,:created_at,:modified_at)'
        )
        res = db.session.execute(select_stmt)
        rows = res.fetchall()
        print(rows)
        symbols = [row[1] for row in rows]

        api = tradeapi.REST(
            os.environ['ALPACA_API_KEY'], 
            os.environ['ALPACA_API_SECRET'], 
            base_url=os.environ['ALPACA_API_URL']
            )

        # assets = [(el.symbol, el.name) for el in api.list_assets(status='active')]
        # assets = assets[:5]
        # for asset in assets:
        #     db.session.execute(insert_stmt, {
        #         'symbol': asset[0], 
        #         'name': asset[1], 
        #         'created_at': datetime.datetime.now(), 
        #         'modified_at': datetime.datetime.now()})

        assets = api.list_assets()
        for asset in assets:
            try:
                if asset.status == 'active' and asset.tradable and asset.symbol not in symbols:
                    print(f"{asset.symbol} {asset.name}")
                    db.session.execute(insert_stmt, {
                        'symbol': asset.symbol,
                        'name': asset.name,
                        'created_at': datetime.now(),
                        'modified_at': datetime.now()})
            except Exception as e:
                print(asset.symbol)
                print(e)
        db.session.commit()

class StockPriceController:
    def __init__(self):
        pass

    def get_stockprices(last):
        stockprices = StockPrice.query.limit(last)
        return stockprices if stockprices else []
    
    def get_stockprice(id):
        stockprice = StockPrice.query.filter_by(id=id).first()
        return stockprice if stockprice else []

    def create_stockprice(open,high,low,close,volume,stock_id):
        stockprice = Stockprice(open,high,low,close,volume,stock_id)
        db.session.add(stockprice)
        db.session.commit()

    def populate_stock_prices():
        
        api = tradeapi.REST(
            os.environ['ALPACA_API_KEY'], 
            os.environ['ALPACA_API_SECRET'], 
            base_url=os.environ['ALPACA_API_URL']
            )
            
        select_stmt = text("SELECT id, symbol, name FROM stocks_stock")
        insert_stmt = text(
            'INSERT INTO stocks_stockprice (stock_id,open,high,low,close,volume,created_at,modified_at) VALUES (:stock_id,:open,:high,:low,:close,:volume,:created_at,:modified_at)'
        )
        res = db.session.execute(select_stmt)
        stocks = res.fetchall()
        symbols = []
        stock_ids = {}
        for stock in stocks:
            symbol = stock[1]
            symbols.append(symbol)
            stock_ids[symbol] = stock[0]
        # print(stock_ids)
        # print(symbols)
        for symbol in symbols:
            start_date = datetime(2021, 5, 6).date()
            end_date_range = datetime(2021, 5, 28).date()

            while start_date < end_date_range:
                end_date = start_date + timedelta(days=4)
                print(f"== Fetching minute bars for {symbol} {start_date} - {end_date} ==")
                bars = api.get_bars(symbol, TimeFrame.Minute, start_date, end_date).df
                bars = bars.resample('1min').ffill()

                for index, row in bars.iterrows():
                    print(f"{stock_ids[symbol]},{row['open']},{row['high']},{row['low']},{row['close']},{row['volume']}")
                    db.session.execute(insert_stmt, {
                        'stock_id': stock_ids[symbol], 
                        'open': row['open'], 
                        'high': row['high'], 
                        'low': row['low'], 
                        'close': row['close'], 
                        'volume': row['volume'], 
                        'created_at': datetime.now(), 
                        'modified_at': datetime.now()})
                db.session.commit()
        

        
class StrategyController:
    def __init__(self):
        pass

    def get_strategies(last):
        strategies = Strategy.query.limit(last)
        return strategies if strategies else []
    
    def get_strategy(id):
        strategy = Strategy.query.filter_by(id=id).first()
        return strategy if strategy else []

    def create_strategy(name):
        strategy = Strategy(name)
        db.session.add(strategy)
        db.session.commit()
