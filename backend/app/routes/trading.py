"""
Trading routes for executing trades and managing orders.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Trade, ExchangeAPIKey
from app.schemas import TradeCreate, TradeResponse
from app.middleware import get_current_user
import ccxt

router = APIRouter(prefix="/api/trading", tags=["Trading"])


@router.post("/trades", response_model=TradeResponse, status_code=status.HTTP_201_CREATED)
async def create_trade(
    trade_data: TradeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create and execute a new trade.
    
    Args:
        trade_data: Trade details
        current_user: Authenticated user
        db: Database session
        
    Returns:
        Created trade record
        
    Raises:
        HTTPException: If no API keys configured or trade execution fails
    """
    # Get user's active API key
    api_key = db.query(ExchangeAPIKey).filter(
        ExchangeAPIKey.user_id == current_user.id,
        ExchangeAPIKey.is_active == True
    ).first()
    
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active exchange API key configured. Please add API keys in settings."
        )
    
    # Create trade record
    new_trade = Trade(
        user_id=current_user.id,
        exchange_name=api_key.exchange_name,
        symbol=trade_data.symbol,
        order_type=trade_data.order_type,
        order_side=trade_data.order_side,
        price=trade_data.price,
        quantity=trade_data.quantity,
        order_status="pending"
    )
    
    db.add(new_trade)
    db.commit()
    db.refresh(new_trade)
    
    # TODO: Execute actual trade on exchange using CCXT
    # For now, we'll simulate the trade
    # In production, you would:
    # 1. Initialize exchange with user's API keys
    # 2. Execute the order
    # 3. Update trade record with execution details
    
    # Simulated execution
    new_trade.order_status = "filled"
    new_trade.filled_quantity = trade_data.quantity
    new_trade.average_price = trade_data.price if trade_data.price else 0
    new_trade.total_cost = new_trade.filled_quantity * new_trade.average_price
    new_trade.fee = new_trade.total_cost * 0.001  # 0.1% fee
    
    db.commit()
    db.refresh(new_trade)
    
    return new_trade


@router.get("/trades", response_model=List[TradeResponse])
async def get_user_trades(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 50
):
    """
    Get user's trade history.
    
    Args:
        current_user: Authenticated user
        db: Database session
        limit: Maximum number of trades to return
        
    Returns:
        List of user's trades
    """
    trades = db.query(Trade).filter(
        Trade.user_id == current_user.id
    ).order_by(Trade.created_at.desc()).limit(limit).all()
    
    return trades


@router.get("/trades/{trade_id}", response_model=TradeResponse)
async def get_trade(
    trade_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get specific trade details.
    
    Args:
        trade_id: Trade ID
        current_user: Authenticated user
        db: Database session
        
    Returns:
        Trade details
        
    Raises:
        HTTPException: If trade not found or doesn't belong to user
    """
    trade = db.query(Trade).filter(
        Trade.id == trade_id,
        Trade.user_id == current_user.id
    ).first()
    
    if not trade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trade not found"
        )
    
    return trade
