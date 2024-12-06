""" 
Scrapper
Scrapping news, stock
"""

import requests
import pandas as pd
from bs4 import BeautifulSoup as soup
from urllib.request import Request, urlopen
from datetime import datetime

class Scrapper:

    def __init__(self):
        self.base_url = "https://query1.finance.yahoo.com/v8/finance/chart/"
        self.default_headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}

    def get_news(self):
        url = "https://finviz.com/news.ashx"
        req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
        page = urlopen(req).read()
        html = soup(page, "html.parser")
        try:
            df = pd.read_html(str(html))[3]
            df.columns = ["0", "DateTime", "Headlines"]
            df = df.drop(columns=['0'])
            df = df.set_index('DateTime')
            res = df.to_dict()
            # print(res)
            return res
        except Exception as e:
            return pd.DataFrame({'Error': [str(e)]})

    def get_top_gainers(self):
        url = 'https://finance.yahoo.com/gainers/'
        req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
        page = urlopen(req).read()
        html = soup(page, "html.parser")
        try:
            df = pd.read_html(str(html))[0]
            # df.columns = ["0", "DateTime", "Headlines"]
            # df = df.drop(columns=['52 Week High'])
            # df = df.set_index('DateTime')
            res = df.to_dict()
            # print(res)
            return res
        except Exception as e:
            return pd.DataFrame({'Error': [str(e)]})

    def get_stock_prices(self, symbol):
        url = f"https://finviz.com/quote.ashx?t={symbol.strip().upper()}&p=d"
        req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
        page = urlopen(req).read()
        html = soup(page, "html.parser")
        try:
            df = pd.read_html(str(html), attrs={"class": "js-table-ratings"})[0]
            df.set_index('Date', inplace=True)
            res = df.to_dict()
            # print(res)
            return res
        except Exception as e:
            return e

    def get_tickers(self):
        """ 
        """
        url = "https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average"

        df = pd.read_html(url, attrs = {"id":"constituents"})[0]
        res = sorted(df['Symbol'].tolist())
        return res

    def get_live_prices(self, tickers):
        base_quotes_url = 'https://query1.finance.yahoo.com/v7/finance/quote?symbols='
        new_url = base_quotes_url + ','.join(tickers)
        resp = requests.get(new_url, headers=self.default_headers)
        # get JSON response
        data = resp.json()
        # results = {result['symbol'] : result['regularMarketPrice'] for result in data['quoteResponse']['result']}
        return data

if __name__ == "__main__":
    sc = Scrapper()

    # General News
    # print(sc.get_news())

    # Stock price news
    symbol = 'AMZN'
    # print(sc.get_stock_prices(symbol))

    # Top gainers
    print(sc.get_top_gainers())