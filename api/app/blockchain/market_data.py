import requests
import logging
from typing import Dict, List

class MarketDataProvider:
    """Mock market data provider - replace with real API like CoinGecko, Alpha Vantage"""
    
    @staticmethod
    def get_crypto_price(symbol: str) -> float:
        """Get current crypto price (mock data)"""
        mock_prices = {
            'BTC': 45000.0,
            'ETH': 3200.0,
            'USDC': 1.0,
            'USDT': 1.0,
            'ADA': 0.85,
            'SOL': 120.0,
            'MATIC': 1.2,
            'LINK': 18.5
        }
        return mock_prices.get(symbol.upper(), 0.0)
    
    @staticmethod
    def get_stock_price(symbol: str) -> float:
        """Get current stock price (mock data)"""
        mock_prices = {
            'AAPL': 175.0,
            'GOOGL': 2800.0,
            'MSFT': 380.0,
            'TSLA': 250.0,
            'AMZN': 145.0,
            'NVDA': 480.0,
            'META': 320.0
        }
        return mock_prices.get(symbol.upper(), 0.0)
    
    @staticmethod
    def get_defi_apy(protocol: str, pair: str = None) -> float:
        """Get current DeFi APY (mock data)"""
        mock_apys = {
            'uniswap': 12.5,
            'aave': 8.2,
            'compound': 6.8,
            'curve': 15.3,
            'yearn': 9.7,
            'pancakeswap': 18.4,
            'sushiswap': 14.2
        }
        return mock_apys.get(protocol.lower(), 5.0)
    
    @staticmethod
    def get_market_trends() -> Dict:
        """Get market trends summary"""
        return {
            "crypto_market_cap": 1.8e12,  # $1.8T
            "defi_tvl": 45e9,  # $45B
            "nft_volume_24h": 25e6,  # $25M
            "top_gainers": [
                {"symbol": "SOL", "change": 8.5},
                {"symbol": "MATIC", "change": 6.2},
                {"symbol": "LINK", "change": 4.8}
            ],
            "top_losers": [
                {"symbol": "ADA", "change": -3.2},
                {"symbol": "DOT", "change": -2.8}
            ]
        }