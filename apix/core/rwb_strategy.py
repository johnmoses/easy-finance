""" 
RWS Strategy
"""

import datetime as dt
import yfinance as yf
from pandas_datareader import data as pdr
import matplotlib.pyplot as plt
import numpy as np

yf.pdr_override()

class RWBStrategy:

    def __init__(self):
        self.data = None

    def get_strategy(self, ticker, num_of_years, emas_used):
        start_date = dt.date.today() - dt.timedelta(days=365.25 * num_of_years)
        end_date = dt.datetime.now()
        df = pdr.get_data_yahoo(ticker, start_date, end_date).dropna()
        for ema in emas_used:
            df[f"Ema_{ema}"] = df.iloc[:, 4].ewm(span=ema, adjust=False).mean()
        df_loc = df.iloc[60:]

        pos, num, percent_change = 0, 0, []
        for i in df_loc.index:
            cmin = min(df_loc[f"Ema_{ema}"][i] for ema in emas_used[:6])
            cmax = max(df_loc[f"Ema_{ema}"][i] for ema in emas_used[6:])
            close = df["Adj Close"][i]
            if cmin > cmax and pos == 0:
                bp, pos = close, 1
                print(f"Buying now at {bp}")
            elif cmin < cmax and pos == 1:
                pos, sp = 0, close
                print(f"Selling now at {sp}")
                percent_change.append((sp / bp - 1) * 100)
            if num == df_loc["Adj Close"].count() - 1 and pos == 1:
                pos, sp = 0, close
                print(f"Selling now at {sp}")
                percent_change.append((sp / bp - 1) * 100)
            num += 1
        return percent_change

if __name__ == "__main__":
    ticker = 'AMZN'
    num_of_years = 2
    emas_used = [3, 5, 8, 10, 12, 15, 30, 35, 40, 45, 50, 60]
    st = RWBStrategy()
    print(st.get_strategy(ticker,num_of_years,emas_used))