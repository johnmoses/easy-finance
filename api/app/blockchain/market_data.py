import requests

def get_crypto_prices(coin_ids):
    """
    Gets the latest prices of cryptocurrencies from the CoinGecko API.
    """
    ids = ",".join(coin_ids)
    url = f"https://api.coingecko.com/api/v3/simple/price?ids={ids}&vs_currencies=usd"
    response = requests.get(url)
    return response.json()