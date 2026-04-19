# 🅿️ SmartPark — Full Stack Parking Management System

React + Node.js + MongoDB + Socket.IO — runs with a **single command**.

---

## ✅ Prerequisites — Install These First

| Tool | Download |
|------|----------|
| Node.js 18+ | https://nodejs.org |
| MongoDB Community | https://www.mongodb.com/try/download/community |

> Install both, then follow the steps below.


---

## 🚀 Run the Entire App — ONE Terminal

### Windows

Just double-click **`START.bat`** — it does everything automatically.

Or in a terminal:
```
cd smartpark
START.bat
```

### Mac / Linux

```bash
cd smartpark
chmod +x START.sh
./START.sh
```

### Any OS (manual one-time setup)

```bash
cd smartpark
npm install          # installs concurrently
npm run install:all  # installs backend + frontend deps
npm run seed         # loads demo data into MongoDB (run once)
npm run dev          # starts BOTH servers together
```

That's it. One terminal. Both servers run together.

---

## 🌐 URLs after starting

| What | URL |
|------|-----|
| Frontend (React) | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Health check | http://localhost:5000/api/health |

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smartpark.com | admin123 |
| User | john@example.com | user123 |

Use the **Demo User / Demo Admin** quick-fill buttons on the login page.

---

## 📁 Project Structure

```
smartpark/
├── START.bat                  ← Double-click on Windows
├── START.sh                   ← Run on Mac/Linux
├── package.json               ← Root: runs both servers with concurrently
│
├── smartpark-backend/
│   ├── server.js              ← Express + Socket.IO
│   ├── seed.js                ← Demo data loader
│   ├── .env                   ← Pre-configured
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/User.js
│   ├── models/ParkingArea.js
│   ├── models/Booking.js
│   └── routes/auth|parking|bookings|admin.js
│
└── smartpark-frontend/
    ├── .env                   ← Pre-configured API URLs
    └── src/ (all React pages, context, services)
```

---

## 🔧 Environment Files — pre-configured, no changes needed

`smartpark-backend/.env`
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartpark
JWT_SECRET=smartpark_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

`smartpark-frontend/.env`
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 🔍 Troubleshooting

**MongoDB not connecting**
```bash
# Windows:  net start MongoDB
# Mac:      brew services start mongodb-community
# Linux:    sudo systemctl start mongod
```

**Port already in use**
```bash
# Mac/Linux:  kill -9 $(lsof -ti:5000)
# Windows:    netstat -ano | findstr :5000  then  taskkill /PID <PID> /F
```

**Reset all demo data**
```bash
npm run seed
```
