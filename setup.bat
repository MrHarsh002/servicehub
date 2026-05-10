@echo off
REM Service Booking Platform - Windows Setup Script

echo.
echo ========================================
echo   Service Booking Platform Setup
echo ========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [SUCCESS] Node.js found: 
node --version
echo.

REM Setup Backend
echo [INFO] Setting up Backend...
cd backend
echo [INFO] Installing backend dependencies...
call npm install

if not exist .env (
    echo [INFO] Creating .env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/service-booking
        echo JWT_SECRET=dev_secret_key_change_in_production
        echo OTP_EXPIRY=300
        echo SMTP_HOST=smtp.gmail.com
        echo SMTP_PORT=587
        echo SMTP_USER=your_email@gmail.com
        echo SMTP_PASS=your_app_password
    ) > .env
    echo [SUCCESS] Backend .env created
    echo [WARNING] Update SMTP credentials in backend\.env
) else (
    echo [SUCCESS] Backend .env already exists
)

cd ..
echo.

REM Setup Frontend
echo [INFO] Setting up Frontend...
cd frontend
echo [INFO] Installing frontend dependencies...
call npm install

if not exist .env (
    echo [INFO] Creating .env file...
    (
        echo REACT_APP_API_URL=http://localhost:5000/api
    ) > .env
    echo [SUCCESS] Frontend .env created
) else (
    echo [SUCCESS] Frontend .env already exists
)

cd ..
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo [INFO] Next steps:
echo   1. Update SMTP credentials in backend\.env
echo   2. Ensure MongoDB is running (or use MongoDB Atlas)
echo   3. Open Command Prompt and run: cd backend ^&^& npm run dev
echo   4. Open another Command Prompt and run: cd frontend ^&^& npm start
echo.
echo [SUCCESS] Happy coding! 🎉
echo.
pause
