# Crypto Trading Bot - Backend

Python FastAPI backend for the automated cryptocurrency trading bot.

## Features

- 🔐 JWT Authentication
- 📊 Real-time market data from exchanges (CCXT)
- 💹 Trade execution and history
- 📈 Portfolio management
- 🔔 Price alerts
- 🤖 Trading strategies

## Setup

### 1. Create Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` and set your configuration:
- Database URL (SQLite by default, PostgreSQL for production)
- Secret key for JWT tokens
- CORS allowed origins

### 4. Run the Server

```bash
# Development mode with auto-reload
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## Database

### SQLite (Development)
By default, uses SQLite database (`crypto_trading.db`). No additional setup required.

### PostgreSQL (Production)
1. Install PostgreSQL
2. Create database: `CREATE DATABASE crypto_trading_bot;`
3. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/crypto_trading_bot
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT token)
- `POST /api/auth/login-json` - Login with JSON payload
- `GET /api/auth/me` - Get current user info

### Market Data
- `GET /api/market/prices` - Get current prices for all coins
- `GET /api/market/prices/{symbol}` - Get detailed info for specific coin

### Trading
- `POST /api/trading/trades` - Execute a trade
- `GET /api/trading/trades` - Get trade history
- `GET /api/trading/trades/{id}` - Get specific trade

## Database Schema

### Users
- Authentication and profile information
- Role-based access control
- 2FA support

### Exchange API Keys
- Encrypted storage of exchange credentials
- Support for multiple exchanges per user

### Trades
- Complete trade history
- Order status tracking
- Fee calculation

### Strategies
- Trading bot configurations
- Performance metrics
- Risk management parameters

### Portfolio
- Real-time holdings
- Profit/loss tracking
- Asset allocation

### Alerts
- Price alerts
- Notification triggers

## Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- API keys encrypted in database
- CORS protection
- Rate limiting (TODO)

## Testing

```bash
# Run tests (TODO)
pytest

# With coverage
pytest --cov=app
```

## Production Deployment

1. Set `DEBUG=False` in `.env`
2. Use PostgreSQL instead of SQLite
3. Set strong `SECRET_KEY`
4. Configure proper CORS origins
5. Use production WSGI server (gunicorn)
6. Set up SSL/TLS
7. Implement rate limiting
8. Add monitoring and logging

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py          # Configuration settings
│   ├── database.py        # Database connection
│   ├── models.py          # SQLAlchemy models
│   ├── schemas.py         # Pydantic schemas
│   ├── auth.py            # Authentication utilities
│   ├── middleware.py      # Auth middleware
│   └── routes/
│       ├── __init__.py
│       ├── auth.py        # Auth endpoints
│       ├── market.py      # Market data endpoints
│       └── trading.py     # Trading endpoints
├── main.py                # FastAPI app entry point
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Next Steps

1. ✅ Backend structure setup
2. ✅ Database schema created
3. ✅ Authentication implemented
4. ✅ Market data integration (CCXT)
5. ⏳ Complete trade execution with real exchanges
6. ⏳ Implement trading strategies
7. ⏳ Add portfolio management endpoints
8. ⏳ Create alert system
9. ⏳ Add WebSocket for real-time updates
10. ⏳ Implement backtesting engine

## License

MIT
