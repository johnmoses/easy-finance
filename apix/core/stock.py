""" 
Stock
This class does computations for each stock, among which are:
- Capital Asset Pricing Model (CAPM)
- R-squared value
"""

import os
import sys
import datetime as dt
import io
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import scipy.stats as stats
import yfinance as yf
from bs4 import BeautifulSoup
from urllib.request import urlopen, Request
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from pandas_datareader import data as pdr

yf.pdr_override()

class Stock:

    def __init__(self, symbol, start, end):
        self.symbol = symbol
        self.start = start
        self.end = end
        self.mean = None

    def get_data(self):
        """ 
        ticker: symbol
        """
        df = pdr.get_data_yahoo(self.symbol,self.start,self.end)['Adj Close']
        result = df.dropna()
        self.mean = np.mean(result)
        return result

    def get_returns(self):
        """ 
        ticker: symbol
        """
        data = self.get_data()
        # JSON formats: table, records, columns, index
        return data.to_json(orient='table')

    def plot_returns(self):
        """ 
        """
        data = self.get_data()

        # Define figure
        fig = Figure()
        axis = fig.add_subplot(1, 1, 1)
        axis.set_title(f"Returns for {self.symbol}")

        # Create plot, histogram or any other type
        axis.hist(data, bins=30, density=True, histtype='stepfilled', alpha=0.5)
        plot = io.BytesIO()
        return fig, plot


if __name__ == "__main__":

    symbol = "AMD"
    start = dt.date.today() - dt.timedelta(days=365*9)
    end = dt.date.today()
    st = Stock(symbol,start,end)
    print(st.get_data())
    print(st.mean)
    # print(st.plot_returns())
    # print(st.get_vars(stock,start,end))
    # st.plot_stocks(5)