@echo off
title SmartPark - Starting...
color 0A

echo.
echo  ========================================
echo    SmartPark - Full Stack App Launcher
echo  ========================================
echo.

:: Check Node.js
node -v >nul 2>&1
if errorlevel 1 (
  echo  ERROR: Node.js not found!
  echo  Download from https://nodejs.org
  pause
  exit /b
)

:: Check MongoDB
sc query MongoDB >nul 2>&1
if errorlevel 1 (
  echo  Starting MongoDB...
  net start MongoDB >nul 2>&1
  if errorlevel 1 (
    echo  WARNING: Could not auto-start MongoDB.
    echo  Please start MongoDB manually, then press any key.
    pause
  )
) else (
  echo  MongoDB already running.
)

echo.
echo  Installing dependencies (first run only)...
call npm install
if errorlevel 1 (
  echo  ERROR: npm install failed.
  pause
  exit /b
)

call npm run install:all
if errorlevel 1 (
  echo  ERROR: dependency install failed.
  pause
  exit /b
)

echo.
echo  Seeding database with demo data...
call npm run seed

echo.
echo  ========================================
echo    Launching Backend + Frontend...
echo  ========================================
echo.
echo  Backend  -> http://localhost:5000
echo  Frontend -> http://localhost:3000
echo.
echo  Demo Login:
echo    Admin : admin@smartpark.com / admin123
echo    User  : john@example.com / user123
echo.
echo  Press Ctrl+C to stop both servers.
echo  ========================================
echo.

call npm run dev
pause
