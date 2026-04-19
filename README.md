# 🅿️ SmartPark — Full Stack Parking Management System

A complete parking booking web application built with **React** (frontend) and **Node.js/Express/MongoDB** (backend).

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone / extract the project
```bash
cd smartpark
```

### 2. Install ALL dependencies (run this in the root folder)
```bash
npm install
npm run install:all
```

### 3. Configure environment
```bash
cp smartpark-backend/.env.example smartpark-backend/.env
```
Then open `smartpark-backend/.env` and set your MongoDB URI:
```
MONGO_URI=mongodb://localhost:27017/smartpark
```

### 4. Seed the database
```bash
npm run seed
```

### 5. Run the app
```bash
npm run dev
```

- 🌐 Frontend: http://localhost:3000  
- ⚙️ Backend API: http://localhost:5000/api

---

## 🔑 Demo Credentials

| Role  | Email               | Password |
|-------|---------------------|----------|
| Admin | admin@smartpark.com | admin123 |
| User  | john@example.com    | user123  |
| User  | priya@example.com   | user123  |

---

## 📁 Project Structure

```
smartpark/
├── package.json                  ← Root (run npm install here first)
├── smartpark-backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/                   # User, ParkingArea, Booking
│   ├── routes/                   # auth, parking, bookings, admin
│   ├── server.js
│   ├── seed.js
│   └── .env.example              ← Copy to .env and fill in values
│
└── smartpark-frontend/
    ├── public/index.html
    └── src/
        ├── components/           # Navbar, Footer, ParkingCard
        ├── context/              # AuthContext, ToastContext
        ├── pages/                # Home, Login, Register, ParkingList,
        │                         #   ParkingDetail, Bookings, BookingDetail,
        │                         #   Profile, AdminDashboard
        ├── services/api.js       # Axios API calls
        ├── App.js
        └── index.js
```

---

## ✨ Features

- 🔍 Search & filter parking areas by city, price, availability
- 🅿️ Real-time slot selection map
- 📅 Booking with start/end time and automatic price calculation
- 📱 Digital booking pass display
- 👤 User profile with saved vehicles
- 🔔 Toast notifications
- ⚙️ Admin dashboard — stats, manage parking areas, view all bookings & users
- 🔒 JWT authentication with protected routes

---

## ⚠️ Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `'concurrently' is not recognized` | Run `npm install` in the root `smartpark/` folder first |
| `MongoDB connection failed` | Make sure MongoDB is running locally, or use a MongoDB Atlas URI in `.env` |
| `Cannot find module '...'` | Run `npm run install:all` to install frontend + backend dependencies |
| Frontend blank page | Check browser console; ensure backend is running on port 5000 |
