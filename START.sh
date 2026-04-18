#!/bin/bash

echo ""
echo "========================================"
echo "  SmartPark - Full Stack App Launcher"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js not found!"
  echo "Download from https://nodejs.org"
  exit 1
fi

# Start MongoDB (Mac via Homebrew, Linux via systemctl)
echo "Starting MongoDB..."
if command -v brew &> /dev/null; then
  brew services start mongodb-community 2>/dev/null || true
elif command -v systemctl &> /dev/null; then
  sudo systemctl start mongod 2>/dev/null || true
fi

echo ""
echo "Installing dependencies (first run only)..."
npm install
npm run install:all

echo ""
echo "Seeding database with demo data..."
npm run seed

echo ""
echo "========================================"
echo "  Launching Backend + Frontend..."
echo "========================================"
echo ""
echo "  Backend  -> http://localhost:5000"
echo "  Frontend -> http://localhost:3000"
echo ""
echo "  Demo Login:"
echo "    Admin : admin@smartpark.com / admin123"
echo "    User  : john@example.com / user123"
echo ""
echo "  Press Ctrl+C to stop both servers."
echo "========================================"
echo ""

npm run dev
