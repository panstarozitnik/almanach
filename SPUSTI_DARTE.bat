@echo off
chcp 65001 >nul
echo ================================================
echo    DARTE Scraper - Spustenie
echo ================================================
echo.

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python nie je nainštalovaný!
    pause
    exit /b 1
)

echo Inštalujem knižnice...
pip install requests beautifulsoup4 openpyxl --quiet

echo.
echo Spúšťam DARTE Scraper...
echo ================================================
echo.

python darte_scraper.py

echo.
pause
