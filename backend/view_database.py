"""
Database Viewer Utility
View all stored data in the crypto trading database
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.models import User, Portfolio, Trade, Strategy, ExchangeAPIKey, Alert
from datetime import datetime
import os

# Create database engine
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {}
)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def print_separator(title=""):
    """Print a visual separator"""
    if title:
        print(f"\n{'='*80}")
        print(f"  {title}")
        print(f"{'='*80}")
    else:
        print(f"{'='*80}")


def view_users():
    """View all users in the database"""
    db = SessionLocal()
    try:
        users = db.query(User).all()
        
        print_separator("USERS")
        print(f"Total Users: {len(users)}\n")
        
        if not users:
            print("No users found in database.")
            return
        
        for i, user in enumerate(users, 1):
            print(f"\n--- User {i} ---")
            print(f"ID: {user.id}")
            print(f"Email: {user.email}")
            print(f"Username: {user.username}")
            print(f"Full Name: {user.full_name or 'N/A'}")
            print(f"Role: {user.role}")
            print(f"Active: {user.is_active}")
            print(f"Verified: {user.is_verified}")
            print(f"2FA Enabled: {user.two_factor_enabled}")
            print(f"Created: {user.created_at}")
            print(f"Updated: {user.updated_at or 'Never'}")
            
    finally:
        db.close()


def view_portfolios():
    """View all portfolios"""
    db = SessionLocal()
    try:
        portfolios = db.query(Portfolio).all()
        
        print_separator("PORTFOLIOS")
        print(f"Total Portfolios: {len(portfolios)}\n")
        
        if not portfolios:
            print("No portfolios found in database.")
            return
        
        for i, portfolio in enumerate(portfolios, 1):
            print(f"\n--- Portfolio {i} ---")
            print(f"ID: {portfolio.id}")
            print(f"User ID: {portfolio.user_id}")
            print(f"Total Value (USD): ${portfolio.total_value_usd:,.2f}")
            print(f"Total P/L: ${portfolio.total_profit_loss:,.2f}")
            print(f"Total P/L %: {portfolio.total_profit_loss_percentage:.2f}%")
            print(f"Holdings: {len(portfolio.holdings)}")
            print(f"Created: {portfolio.created_at}")
            
            # Show holdings if any
            if portfolio.holdings:
                print("\n  Holdings:")
                for holding in portfolio.holdings:
                    print(f"    - {holding.symbol}: {holding.quantity} @ ${holding.average_buy_price:.2f}")
            
    finally:
        db.close()


def view_trades():
    """View all trades"""
    db = SessionLocal()
    try:
        trades = db.query(Trade).order_by(Trade.created_at.desc()).limit(20).all()
        
        print_separator("RECENT TRADES (Last 20)")
        print(f"Total Trades Shown: {len(trades)}\n")
        
        if not trades:
            print("No trades found in database.")
            return
        
        for i, trade in enumerate(trades, 1):
            print(f"\n--- Trade {i} ---")
            print(f"ID: {trade.id}")
            print(f"User ID: {trade.user_id}")
            print(f"Exchange: {trade.exchange_name}")
            print(f"Symbol: {trade.symbol}")
            print(f"Type: {trade.order_type} | Side: {trade.order_side}")
            print(f"Status: {trade.order_status}")
            print(f"Quantity: {trade.quantity}")
            print(f"Price: ${trade.price or 0:.2f}")
            print(f"Total Cost: ${trade.total_cost or 0:.2f}")
            print(f"Created: {trade.created_at}")
            
    finally:
        db.close()


def view_strategies():
    """View all strategies"""
    db = SessionLocal()
    try:
        strategies = db.query(Strategy).all()
        
        print_separator("TRADING STRATEGIES")
        print(f"Total Strategies: {len(strategies)}\n")
        
        if not strategies:
            print("No strategies found in database.")
            return
        
        for i, strategy in enumerate(strategies, 1):
            print(f"\n--- Strategy {i} ---")
            print(f"ID: {strategy.id}")
            print(f"User ID: {strategy.user_id}")
            print(f"Name: {strategy.name}")
            print(f"Type: {strategy.strategy_type}")
            print(f"Status: {strategy.status}")
            print(f"Total Trades: {strategy.total_trades}")
            print(f"Winning Trades: {strategy.winning_trades}")
            print(f"Total P/L: ${strategy.total_profit_loss:.2f}")
            print(f"Created: {strategy.created_at}")
            
    finally:
        db.close()


def view_api_keys():
    """View all API keys (masked)"""
    db = SessionLocal()
    try:
        api_keys = db.query(ExchangeAPIKey).all()
        
        print_separator("EXCHANGE API KEYS")
        print(f"Total API Keys: {len(api_keys)}\n")
        
        if not api_keys:
            print("No API keys found in database.")
            return
        
        for i, key in enumerate(api_keys, 1):
            print(f"\n--- API Key {i} ---")
            print(f"ID: {key.id}")
            print(f"User ID: {key.user_id}")
            print(f"Exchange: {key.exchange_name}")
            print(f"Active: {key.is_active}")
            print(f"Trading Permission: {key.has_trading_permission}")
            print(f"Withdrawal Permission: {key.has_withdrawal_permission}")
            print(f"Created: {key.created_at}")
            
    finally:
        db.close()


def view_database_info():
    """View database file information"""
    print_separator("DATABASE INFORMATION")
    
    db_path = settings.database_url.replace("sqlite:///", "")
    
    if os.path.exists(db_path):
        file_size = os.path.getsize(db_path)
        file_size_mb = file_size / (1024 * 1024)
        modified_time = datetime.fromtimestamp(os.path.getmtime(db_path))
        
        print(f"Database Path: {db_path}")
        print(f"File Size: {file_size_mb:.2f} MB ({file_size:,} bytes)")
        print(f"Last Modified: {modified_time}")
    else:
        print(f"Database file not found at: {db_path}")


def main():
    """Main function to display all database information"""
    print("\n")
    print("╔" + "═" * 78 + "╗")
    print("║" + " " * 20 + "CRYPTO TRADING DATABASE VIEWER" + " " * 28 + "║")
    print("╚" + "═" * 78 + "╝")
    
    view_database_info()
    view_users()
    view_portfolios()
    view_trades()
    view_strategies()
    view_api_keys()
    
    print_separator()
    print("\n✓ Database view complete!\n")


if __name__ == "__main__":
    main()
