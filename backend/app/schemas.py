"""
Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums
class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


class OrderType(str, Enum):
    MARKET = "market"
    LIMIT = "limit"
    STOP_LOSS = "stop_loss"
    TAKE_PROFIT = "take_profit"


class OrderSide(str, Enum):
    BUY = "buy"
    SELL = "sell"


class OrderStatus(str, Enum):
    PENDING = "pending"
    FILLED = "filled"
    PARTIALLY_FILLED = "partially_filled"
    CANCELLED = "cancelled"
    FAILED = "failed"


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    full_name: Optional[str]
    role: UserRole
    is_active: bool
    is_verified: bool
    two_factor_enabled: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


# Exchange API Key Schemas
class ExchangeAPIKeyCreate(BaseModel):
    exchange_name: str = Field(..., pattern="^(binance|coinbase|kraken|kucoin)$")
    api_key: str
    api_secret: str
    has_trading_permission: bool = True


class ExchangeAPIKeyResponse(BaseModel):
    id: int
    exchange_name: str
    api_key: str  # Masked in response
    is_active: bool
    has_trading_permission: bool
    has_withdrawal_permission: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Trade Schemas
class TradeCreate(BaseModel):
    symbol: str
    order_type: OrderType
    order_side: OrderSide
    quantity: float = Field(..., gt=0)
    price: Optional[float] = Field(None, gt=0)


class TradeResponse(BaseModel):
    id: int
    exchange_name: str
    symbol: str
    order_type: OrderType
    order_side: OrderSide
    order_status: OrderStatus
    price: Optional[float]
    quantity: float
    filled_quantity: float
    average_price: Optional[float]
    fee: float
    total_cost: Optional[float]
    created_at: datetime
    executed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# Strategy Schemas
class StrategyCreate(BaseModel):
    name: str
    description: Optional[str] = None
    strategy_type: str
    parameters: Optional[str] = None  # JSON string
    max_position_size: Optional[float] = None
    stop_loss_percentage: Optional[float] = None
    take_profit_percentage: Optional[float] = None


class StrategyResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    strategy_type: str
    status: str
    parameters: Optional[str]
    max_position_size: Optional[float]
    stop_loss_percentage: Optional[float]
    take_profit_percentage: Optional[float]
    total_trades: int
    winning_trades: int
    total_profit_loss: float
    created_at: datetime
    
    class Config:
        from_attributes = True


# Portfolio Schemas
class PortfolioHoldingResponse(BaseModel):
    id: int
    symbol: str
    quantity: float
    average_buy_price: float
    current_price: Optional[float]
    total_value_usd: Optional[float]
    profit_loss: float
    profit_loss_percentage: float
    
    class Config:
        from_attributes = True


class PortfolioResponse(BaseModel):
    id: int
    total_value_usd: float
    total_profit_loss: float
    total_profit_loss_percentage: float
    holdings: List[PortfolioHoldingResponse] = []
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# Alert Schemas
class AlertCreate(BaseModel):
    symbol: str
    alert_type: str
    target_price: float = Field(..., gt=0)
    message: Optional[str] = None


class AlertResponse(BaseModel):
    id: int
    symbol: str
    alert_type: str
    target_price: float
    is_active: bool
    is_triggered: bool
    message: Optional[str]
    created_at: datetime
    triggered_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# Market Data Schemas
class CoinPrice(BaseModel):
    id: str
    symbol: str
    name: str
    current_price: float
    price_change_percentage_24h: float
    market_cap: Optional[float] = None
    volume_24h: Optional[float] = None


class PriceHistory(BaseModel):
    date: str
    price: float


class CoinDetail(CoinPrice):
    price_history: List[PriceHistory] = []
