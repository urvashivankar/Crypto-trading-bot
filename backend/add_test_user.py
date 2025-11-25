"""
Simple script to add a test user directly using SQL
"""

import sqlite3
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_test_user():
    # Connect to database
    conn = sqlite3.connect('crypto_trading.db')
    cursor = conn.cursor()
    
    # Check if user exists
    cursor.execute("SELECT * FROM users WHERE email = ?", ("demo@test.com",))
    existing = cursor.fetchone()
    
    if existing:
        print("\n" + "="*70)
        print("✅ TEST USER ALREADY EXISTS!")
        print("="*70)
        print(f"\n  📧 Email:    demo@test.com")
        print(f"  🔑 Password: demo123")
        print("\n" + "="*70)
        print("  🌐 Login at: http://localhost:8080/signin")
        print("="*70 + "\n")
        conn.close()
        return
    
    # Hash password (using shorter password to avoid bcrypt issues)
    hashed = pwd_context.hash("demo123")
    
    # Insert user
    cursor.execute("""
        INSERT INTO users (email, username, hashed_password, full_name, role, is_active, is_verified, two_factor_enabled, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    """, ("demo@test.com", "demouser", hashed, "Demo User", "user", 1, 1, 0))
    
    user_id = cursor.lastrowid
    
    # Create portfolio for user
    cursor.execute("""
        INSERT INTO portfolios (user_id, total_value_usd, total_profit_loss, total_profit_loss_percentage, created_at)
        VALUES (?, ?, ?, ?, datetime('now'))
    """, (user_id, 0.0, 0.0, 0.0))
    
    conn.commit()
    conn.close()
    
    print("\n" + "="*70)
    print("✅ TEST USER CREATED SUCCESSFULLY!")
    print("="*70)
    print(f"\n  📧 Email:    demo@test.com")
    print(f"  🔑 Password: demo123")
    print(f"\n  👤 User ID:   {user_id}")
    print(f"  👤 Username:  demouser")
    print(f"  👤 Full Name: Demo User")
    print("\n" + "="*70)
    print("  🌐 Login at: http://localhost:8080/signin")
    print("="*70 + "\n")

if __name__ == "__main__":
    try:
        create_test_user()
    except Exception as e:
        print(f"\n❌ Error: {e}\n")
