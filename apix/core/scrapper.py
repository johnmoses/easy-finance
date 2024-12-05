""" 
Scrapper
Scrapping news, stock
"""

import pandas as pd
from bs4 import BeautifulSoup as soup
from urllib.request import Request, urlopen
from datetime import datetime

class Scrapper:

    def scrape_news(self, content, index):
        """ 
        content: html content
        index: news index
        """
        try:
            table = pd.read_html(str(content))[index]
            table.columns = ['0','DateTime','HeadLines']
            table = table.drop(columns=['0'])
            table = table.set_index('DateTime')
            return table
        except Exception as e:
            return pd.DataFrame({'Error': [str(e)]})

    def scrape_stock_prices(self, content):
        """ 
        content: html content
        index: news index
        """
        try:
            table = pd.read_html(str(content), attrs={"class": "js-table-ratings"})[0]
            table.set_index('Date', inplace=True)
            return table
        except Exception as e:
            return e

# symbol = 'AMZN'
# url = f"https://finviz.com/quote.ashx?t={symbol.strip().upper()}&p=d"
# url = "https://finviz.com/news.ashx"
# req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
# page = urlopen(req).read()
# content = soup(page, "html.parser")
# sc = Scrapper()
# print(sc.scrape_news(content, 4))

# print(sc.scrape_stock_prices(content))