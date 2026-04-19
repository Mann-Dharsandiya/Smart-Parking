const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ParkingArea = require('../models/ParkingArea');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// @GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [users, parkingAreas, bookings, revenue] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      ParkingArea.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Booking.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }])
    ]);
    const activeBookings = await Booking.countDocuments({ status: 'active' });
    const todayBookings = await Booking.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } });
    res.json({
      users,
      parkingAreas,
      totalBookings: bookings,
      activeBookings,
      todayBookings,
      totalRevenue: revenue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/admin/bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('parkingArea', 'name city')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/admin/parking
router.post('/parking', async (req, res) => {
  try {
    const { name, address, city, totalSlots, pricePerHour, facilities, operatingHours } = req.body;
    const slots = [];
    for (let i = 1; i <= totalSlots; i++) {
      slots.push({ slotNumber: `S${String(i).padStart(3, '0')}`, type: 'car', isOccupied: false, floor: Math.ceil(i / 20) });
    }
    const area = await ParkingArea.create({ name, address, city, totalSlots, availableSlots: totalSlots, pricePerHour, facilities: facilities || [], slots, operatingHours });
    res.status(201).json(area);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/admin/parking/:id
router.put('/parking/:id', async (req, res) => {
  try {
    const area = await ParkingArea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(area);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @DELETE /api/admin/parking/:id
router.delete('/parking/:id', async (req, res) => {
  try {
    await ParkingArea.findByIdAndDelete(req.params.id);
    res.json({ message: 'Parking area deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
