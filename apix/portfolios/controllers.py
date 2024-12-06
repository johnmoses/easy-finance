# """
# API functions
# """
import pandas as pd
from bs4 import BeautifulSoup as soup
from urllib.request import Request, urlopen
from datetime import datetime, timedelta

from .models import db, Portfolio
from core.scrapper import Scrapper
from core.portfolio import Portfolio as PF
from core.scrapper import Scrapper

class PortfolioController:
    def __init__(self):
        pass

    def get_portfolios(symbols):
        start = datetime.now() - timedelta(days=365*5)
        end = datetime.now()
        pf = PF(symbols,start,end)
        result = pf.get_portfolios()
        return result if result else []

    def get_news():
        scraper = Scrapper()
        result = scraper.get_news()
        return result if result else []

    def plot_stocks(symbols):
        start = datetime.now() - timedelta(days=365*5)
        end = datetime.now()
        pf = PF(symbols,start,end)
        result = pf.plot_stocks()
        return result

    def plot_sample(symbols):
        start = datetime.now() - timedelta(days=365*5)
        end = datetime.now()
        pf = PF(symbols,start,end)
        result = pf.plot_sample()
        return result

    def get_assets(last):
        assets = Portfolio.query.limit(last)
        return assets if assets else []
    
    def get_asset(id):
        asset = Portfolio.query.filter_by(id=id).first()
        return asset if asset else []

    def create_asset(name,description):
        asset = Portfolio(name,description)
        db.session.add(asset)
        db.session.commit()

class NewsController:

    def __init__(self):
        pass

    def get_news():
        url = "https://finviz.com/news.ashx"
        req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
        page = urlopen(req).read()
        content = soup(page, "html.parser")
        sc = Scrapper()
        return sc.scrape_news(content, 4)

    def get_stock_price_news():
        symbol = 'AMZN'
        url = f"https://finviz.com/quote.ashx?t={symbol.strip().upper()}&p=d"
        req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
        page = urlopen(req).read()
        content = soup(page, "html.parser")
        sc = Scrapper()
        return sc.scrape_stock_prices(content, 4)