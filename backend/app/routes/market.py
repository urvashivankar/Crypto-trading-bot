"""
Market data routes for cryptocurrency prices and information.
"""

from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas import CoinPrice, CoinDetail, PriceHistory
import ccxt
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/market", tags=["Market Data"])

# Initialize exchange (using Binance for market data)
exchange = ccxt.binance()


@router.get("/prices", response_model=List[CoinPrice])
async def get_coin_prices():
    """
    Get current prices for top cryptocurrencies.
    
    Returns:
        List of coin prices with 24h change
    """
    try:
        # Fetch tickers for major pairs
        symbols = [
            'BTC/USDT', 'ETH/USDT', 'XRP/USDT', 'BCH/USDT', 'LTC/USDT',
            'ADA/USDT', 'DOT/USDT', 'LINK/USDT', 'XLM/USDT', 'BNB/USDT'
        ]
        
        tickers = exchange.fetch_tickers(symbols)
        
        coin_data = []
        for symbol, ticker in tickers.items():
            base_currency = symbol.split('/')[0]
            coin_data.append(CoinPrice(
                id=base_currency.lower(),
                symbol=base_currency,
                name=base_currency,
                current_price=ticker['last'],
                price_change_percentage_24h=ticker.get('percentage', 0),
                market_cap=None,
                volume_24h=ticker.get('quoteVolume', 0)
            ))
        
        return coin_data
    
    except Exception as e:
        # Fallback to mock data if exchange fails
        return get_mock_prices()


@router.get("/prices/{symbol}", response_model=CoinDetail)
async def get_coin_detail(symbol: str):
    """
    Get detailed information for a specific cryptocurrency.
    
    Args:
        symbol: Cryptocurrency symbol (e.g., 'BTC', 'ETH')
        
    Returns:
        Detailed coin information with price history
    """
    try:
        pair = f"{symbol.upper()}/USDT"
        
        # Fetch current ticker
        ticker = exchange.fetch_ticker(pair)
        
        # Fetch OHLCV data for price history (30 days)
        since = exchange.parse8601((datetime.now() - timedelta(days=30)).isoformat())
        ohlcv = exchange.fetch_ohlcv(pair, '1d', since=since, limit=30)
        
        price_history = [
            PriceHistory(
                date=datetime.fromtimestamp(candle[0] / 1000).strftime('%Y-%m-%d'),
                price=candle[4]  # Close price
            )
            for candle in ohlcv
        ]
        
        return CoinDetail(
            id=symbol.lower(),
            symbol=symbol.upper(),
            name=symbol.upper(),
            current_price=ticker['last'],
            price_change_percentage_24h=ticker.get('percentage', 0),
            market_cap=None,
            volume_24h=ticker.get('quoteVolume', 0),
            price_history=price_history
        )
    
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Coin {symbol} not found or API error")


def get_mock_prices() -> List[CoinPrice]:
    """Fallback mock data if exchange API fails."""
    return [
        CoinPrice(id="bitcoin", symbol="BTC", name="Bitcoin", current_price=39000, price_change_percentage_24h=2.5),
        CoinPrice(id="ethereum", symbol="ETH", name="Ethereum", current_price=2800, price_change_percentage_24h=-1.2),
        CoinPrice(id="ripple", symbol="XRP", name="Ripple", current_price=0.5, price_change_percentage_24h=3.1),
        CoinPrice(id="bitcoin-cash", symbol="BCH", name="Bitcoin Cash", current_price=250, price_change_percentage_24h=-0.8),
        CoinPrice(id="litecoin", symbol="LTC", name="Litecoin", current_price=130, price_change_percentage_24h=1.5),
        CoinPrice(id="cardano", symbol="ADA", name="Cardano", current_price=1.2, price_change_percentage_24h=4.2),
        CoinPrice(id="polkadot", symbol="DOT", name="Polkadot", current_price=15, price_change_percentage_24h=-2.1),
        CoinPrice(id="chainlink", symbol="LINK", name="Chainlink", current_price=12, price_change_percentage_24h=0.9),
        CoinPrice(id="stellar", symbol="XLM", name="Stellar", current_price=0.3, price_change_percentage_24h=2.3),
        CoinPrice(id="binancecoin", symbol="BNB", name="Binance Coin", current_price=450, price_change_percentage_24h=1.8),
    ]
