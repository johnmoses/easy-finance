""" 
Dividends
"""

import pandas as pd
import requests
import datetime
import calendar

# Set pandas option to display all columns
pd.set_option('display.max_columns', None)

class Dividend:
    def __init__(self, year, month):
        self.year = year
        self.month = month
        self.url = 'https://api.nasdaq.com/api/calendar/dividends'
        self.headers = {
            'Accept': 'text/plain, */*',
            'DNT': "1",
            'Origin': 'https://www.nasdaq.com/',
            'Sec-Fetch-Mode': 'cors',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0)'
        }
        self.calendars = []  # Calendar DataFrames

    def date_str(self, day):
        return datetime.date(self.year, self.month, day).strftime('%Y-%m-%d')

    def scrape(self, date_str):
        response = requests.get(self.url, headers=self.headers, params={'date':date_str})
        return response.json()

    def get_dataframe(self, dictionary):
        rows = dictionary.get('data').get('calendar').get('rows',[])
        df = pd.DataFrame(rows)
        self.calendars.append(df)
        return df

    def get_calendar(self, day):
        date_str = self.date_str(day)
        dictionary = self.scrape(date_str)
        return self.get_dataframe(dictionary)

if __name__ == "__main__":
    year = 2024
    month = 12
    days_in_month = calendar.monthrange(year, month)[1]
    dv = Dividend(year, month)
    try: 
        for day in range(1, days_in_month + 1):
            print(dv.get_calendar(day))
    except Exception as e:
        print(e)