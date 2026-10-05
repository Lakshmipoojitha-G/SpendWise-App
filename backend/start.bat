@echo off
echo ============================================
echo   SpendWise Backend — Database Setup
echo ============================================
echo.

REM Try to create the database
echo Creating database 'spendwise_db'...
psql -U postgres -c "CREATE DATABASE spendwise_db;" 2>nul
if %ERRORLEVEL% neq 0 (
    echo   [INFO] Database may already exist or psql not in PATH.
)

echo.
echo Running migrations...
cd /d "%~dp0"
python manage.py migrate

echo.
echo ============================================
echo   Database ready! Starting server...
echo ============================================
echo.
python manage.py runserver
