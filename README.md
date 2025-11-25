🪙 Crypto Trading Bot

An automated cryptocurrency trading bot built using Python that integrates market data, trading strategies, and exchange APIs to execute trades with speed and precision.

🚀 Features

📊 Live Market Data (from Binance / Coinbase / Any API you configure)

🤖 Automated Buy/Sell Execution

🧠 Customizable Trading Strategies

📈 Technical Indicators Support (EMA, RSI, MACD, etc.)

🧪 Backtesting Support

🔔 Logging & Alerts through console or Telegram

🛡 Risk Management – stop loss, take profit, position sizing

🏗 Project Structure
crypto-trading-bot/
│── config/               # API keys, credentials (DO NOT COMMIT KEYS)
│── data/                 # Market data, historical candles
│── strategies/           # Your trading strategies
│── bot/                  # Trading engine core files
│── utils/                # Helper functions
│── requirements.txt      # Dependencies
│── main.py               # Entry point
│── README.md             # Project documentation

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/urvashivankar/Crypto-trading-bot.git
cd Crypto-trading-bot

2️⃣ Install Dependencies
pip install -r requirements.txt

3️⃣ Add Your API Keys

Create a file:

config/keys.py


Add:

API_KEY = "your_api_key"
API_SECRET = "your_secret_key"

▶️ Running the Bot
python main.py


For backtesting:

python backtest.py

📚 Strategy Customization

Add your strategies inside:

strategies/


Example:

def my_strategy(df):
    if df["EMA_20"] > df["EMA_50"]:
        return "BUY"
    else:
        return "SELL"

🖥 Requirements

Python 3.8+

Pip

Exchange API (Binance recommended)

⚠️ Disclaimer

This project is for educational purposes only.
Crypto trading involves major financial risk.
Use the bot at your own risk.

⭐ Contribute

Pull requests are welcome!
If you’d like to improve a feature or report a bug, create an Issue on GitHub.
