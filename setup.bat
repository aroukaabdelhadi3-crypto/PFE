@echo off
echo ========================================
echo PFE - Setup Script for Windows
echo ========================================
echo.

echo [1/5] Creating virtual environment...
python -m venv backend\venv

echo.
echo [2/5] Activating virtual environment...
call backend\venv\Scripts\activate.bat

echo.
echo [3/5] Installing Python dependencies...
pip install -r backend\requirements.txt

echo.
echo [4/5] Running database migrations...
cd backend
python manage.py migrate

echo.
echo [5/5] Creating admin user...
echo Please create your admin account:
python manage.py createsuperuser
cd ..

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo To run the backend:
echo   cd backend
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.
echo To run the frontend:
echo   cd frontend
echo   npm install
echo   npm start
echo.
pause
