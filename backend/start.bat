@echo off
echo ========================================
echo Starting Crypto Trading Bot Backend
echo ========================================
echo.

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Start the server
echo Starting FastAPI server on http://localhost:8000
echo API Documentation: http://localhost:8000/api/docs
echo.
python main.py

pause
