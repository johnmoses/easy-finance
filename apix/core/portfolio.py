""" 
Porfolio
This holds computations of collection of Stocks in the following categories:
- Daily returns
- Annual returns
- Volatility
- Downside risk
- Value at risk
- Sharpe ratio
- Sortino ratio
- Optimizations
"""

import io
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.figure import Figure
import yfinance as yf
from datetime import datetime, timedelta

yf.pdr_override()

class Portfolio:
    def __init__(self, symbols, start, end):
        self.symbols = symbols
        self.start = start
        self.end = end

    def get_data(self):
        df = yf.download(self.symbols,self.start,self.end)
        data = df['Adj Close']
        return data
    
    def get_historical_prices(self):
        """ 
        """
        data = self.get_data()
        # JSON formats: table, records, columns, index
        return data.to_json(orient='table')
        # return data.values.tolist()
        # return data.to_dict()
        # return data

    def get_daily_returns(self):
        """ 
        """

    def plot_vars(self):
        """ 
        """
        returns = self.get_data()
        plt.figure(figsize=(10,5))
        returns.hist(bins=40, density=True, histtype='stepfilled', alpha=0.5)
        plt.title("Histogram of stock daily returns")
        plt.show()

    def plot_stocks(self):
        """ 
        """
        # Generate data
        data = self.get_data()

        # Define figure
        fig = Figure()
        axis = fig.add_subplot(1, 1, 1)
        axis.set_title("title")
        axis.set_xlabel("x-axis")
        axis.set_ylabel("y-axis")

        # Create plot, histogram or any other type
        axis.hist(data, bins=40, density=True, histtype='stepfilled', alpha=0.5)
        plot = io.BytesIO()
        return fig, plot

    def plot_sample(self):
        """ 
        """
        # Generate data
        x = np.arange(0, 10, 0.1)

        # Define figure
        fig = Figure()
        axis = fig.add_subplot(1, 1, 1)
        axis.set_title("Sample")
        axis.set_xlabel("x-axis")
        axis.set_ylabel("y-axis")

        # Create plot, histogram or any other type
        axis.plot(x, np.sin(x), '-')
        axis.plot(x, np.cos(x), '--')
        plot = io.BytesIO()
        return fig, plot


if __name__ == "__main__":
     symbols = ['AMZN', 'MSFT', 'GOOGL']
     start = datetime.now() - timedelta(days=365*5)
     end = datetime.now()
     pf = Portfolio(symbols,start,end)
    #  print(pf.get_data())
     print(pf.get_historical_prices())