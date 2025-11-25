"""
Database models for the Crypto Trading Bot.
Defines the schema for users, trades, API keys, strategies, and alerts.
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    """User role enumeration."""
    USER = "user"
    ADMIN = "admin"


class OrderType(str, enum.Enum):
    """Order type enumeration."""
    MARKET = "market"
    LIMIT = "limit"
    STOP_LOSS = "stop_loss"
    TAKE_PROFIT = "take_profit"


class OrderSide(str, enum.Enum):
    """Order side enumeration."""
    BUY = "buy"
    SELL = "sell"


class OrderStatus(str, enum.Enum):
    """Order status enumeration."""
    PENDING = "pending"
    FILLED = "filled"
    PARTIALLY_FILLED = "partially_filled"
    CANCELLED = "cancelled"
    FAILED = "failed"


class StrategyStatus(str, enum.Enum):
    """Strategy status enumeration."""
    ACTIVE = "active"
    PAUSED = "paused"
    STOPPED = "stopped"


class User(Base):
    """User model for authentication and profile management."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    two_factor_enabled = Column(Boolean, default=False, nullable=False)
    two_factor_secret = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    
    # Relationships
    api_keys = relationship("ExchangeAPIKey", back_populates="user", cascade="all, delete-orphan")
    trades = relationship("Trade", back_populates="user", cascade="all, delete-orphan")
    strategies = relationship("Strategy", back_populates="user", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="user", cascade="all, delete-orphan")
    portfolio = relationship("Portfolio", back_populates="user", uselist=False, cascade="all, delete-orphan")


class ExchangeAPIKey(Base):
    """Exchange API keys for trading (encrypted)."""
    __tablename__ = "exchange_api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exchange_name = Column(String(50), nullable=False)  # binance, coinbase, kraken, etc.
    api_key = Column(Text, nullable=False)  # Encrypted
    api_secret = Column(Text, nullable=False)  # Encrypted
    is_active = Column(Boolean, default=True, nullable=False)
    has_trading_permission = Column(Boolean, default=True, nullable=False)
    has_withdrawal_permission = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="api_keys")


class Trade(Base):
    """Trade history and execution records."""
    __tablename__ = "trades"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    strategy_id = Column(Integer, ForeignKey("strategies.id"), nullable=True)
    exchange_name = Column(String(50), nullable=False)
    symbol = Column(String(20), nullable=False)  # BTC/USDT, ETH/USDT, etc.
    order_type = Column(Enum(OrderType), nullable=False)
    order_side = Column(Enum(OrderSide), nullable=False)
    order_status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    
    # Price and quantity
    price = Column(Float, nullable=True)  # Null for market orders
    quantity = Column(Float, nullable=False)
    filled_quantity = Column(Float, default=0.0, nullable=False)
    average_price = Column(Float, nullable=True)
    
    # Fees and totals
    fee = Column(Float, default=0.0, nullable=False)
    total_cost = Column(Float, nullable=True)
    
    # External references
    exchange_order_id = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    executed_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="trades")
    strategy = relationship("Strategy", back_populates="trades")


class Strategy(Base):
    """Trading strategies and bot configurations."""
    __tablename__ = "strategies"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    strategy_type = Column(String(50), nullable=False)  # ma_crossover, rsi, grid, etc.
    status = Column(Enum(StrategyStatus), default=StrategyStatus.PAUSED, nullable=False)
    
    # Strategy parameters (JSON stored as text)
    parameters = Column(Text, nullable=True)  # JSON string of strategy-specific params
    
    # Risk management
    max_position_size = Column(Float, nullable=True)
    stop_loss_percentage = Column(Float, nullable=True)
    take_profit_percentage = Column(Float, nullable=True)
    
    # Performance metrics
    total_trades = Column(Integer, default=0, nullable=False)
    winning_trades = Column(Integer, default=0, nullable=False)
    total_profit_loss = Column(Float, default=0.0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    last_executed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="strategies")
    trades = relationship("Trade", back_populates="strategy")


class Portfolio(Base):
    """User portfolio holdings and balances."""
    __tablename__ = "portfolios"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    
    # Total portfolio value
    total_value_usd = Column(Float, default=0.0, nullable=False)
    total_profit_loss = Column(Float, default=0.0, nullable=False)
    total_profit_loss_percentage = Column(Float, default=0.0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="portfolio")
    holdings = relationship("PortfolioHolding", back_populates="portfolio", cascade="all, delete-orphan")


class PortfolioHolding(Base):
    """Individual cryptocurrency holdings in portfolio."""
    __tablename__ = "portfolio_holdings"
    
    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=False)
    symbol = Column(String(20), nullable=False)  # BTC, ETH, etc.
    quantity = Column(Float, nullable=False)
    average_buy_price = Column(Float, nullable=False)
    current_price = Column(Float, nullable=True)
    total_value_usd = Column(Float, nullable=True)
    profit_loss = Column(Float, default=0.0, nullable=False)
    profit_loss_percentage = Column(Float, default=0.0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    
    # Relationships
    portfolio = relationship("Portfolio", back_populates="holdings")


class Alert(Base):
    """Price alerts and notifications."""
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    symbol = Column(String(20), nullable=False)
    alert_type = Column(String(50), nullable=False)  # price_above, price_below, etc.
    target_price = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_triggered = Column(Boolean, default=False, nullable=False)
    message = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    triggered_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="alerts")
