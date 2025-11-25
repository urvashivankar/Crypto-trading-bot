"""
Create a test user in the database
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.models import User, Portfolio
from app.auth import get_password_hash

# Create database engine
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {}
)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_test_user():
    """Create a test user for testing"""
    db = SessionLocal()
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == "test@example.com").first()
        
        if existing_user:
            print("\n" + "="*60)
            print("✓ Test user already exists!")
            print("="*60)
            print(f"\n  📧 Email:    test@example.com")
            print(f"  🔑 Password: password123")
            print("\n" + "="*60)
            print("You can login at: http://localhost:8080/signin")
            print("="*60 + "\n")
            return
        
        # Create test user with a simple password
        hashed_password = get_password_hash("password123")
        test_user = User(
            email="test@example.com",
            username="testuser",
            hashed_password=hashed_password,
            full_name="Test User",
            is_active=True,
            is_verified=True
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        # Create portfolio for test user
        portfolio = Portfolio(user_id=test_user.id)
        db.add(portfolio)
        db.commit()
        
        print("\n" + "="*60)
        print("✅ TEST USER CREATED SUCCESSFULLY!")
        print("="*60)
        print(f"\n  📧 Email:    test@example.com")
        print(f"  🔑 Password: password123")
        print(f"\n  User ID: {test_user.id}")
        print(f"  Username: {test_user.username}")
        print(f"  Full Name: {test_user.full_name}")
        print(f"  Active: {test_user.is_active}")
        print(f"  Verified: {test_user.is_verified}")
        print("\n" + "="*60)
        print("Login at: http://localhost:8080/signin")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error creating test user: {e}\n")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
