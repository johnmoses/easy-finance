""" 
News
"""

import pandas as pd
from urllib.request import Request, urlopen
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
from datetime import datetime

# Download necessary NLTK data
nltk.download('vader_lexicon')

class News:

    num_headlines = 3  # Number of article headlines displayed per ticker
    tickers = ['AAPL', 'TSLA', 'AMZN']  # List of tickers to analyze

    analyzer = SentimentIntensityAnalyzer()

    def __init__(self):
        pass