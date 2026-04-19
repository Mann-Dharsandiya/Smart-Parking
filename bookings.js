const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const ParkingArea = require('../models/ParkingArea');
const { protect } = require('../middleware/auth');

// @POST /api/bookings - Create booking
router.post('/', protect, async (req, res) => {
  try {
    const { parkingAreaId, slotNumber, vehiclePlate, vehicleType, startTime, endTime } = req.body;
    const area = await ParkingArea.findById(parkingAreaId);
    if (!area) return res.status(404).json({ message: 'Parking area not found' });

    const duration = Math.ceil((new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60));
    if (duration < 1) return res.status(400).json({ message: 'Minimum booking is 1 hour' });

    const totalAmount = duration * area.pricePerHour;

    // Mark slot as occupied
    const slot = area.slots.find(s => s.slotNumber === slotNumber);
    if (slot) { slot.isOccupied = true; }
    area.availableSlots = Math.max(0, area.availableSlots - 1);
    await area.save();

    const booking = await Booking.create({
      user: req.user._id,
      parkingArea: parkingAreaId,
      slotNumber,
      vehiclePlate,
      vehicleType,
      startTime,
      endTime,
      duration,
      totalAmount,
      status: 'active',
      paymentStatus: 'paid'
    });

    const populated = await booking.populate('parkingArea', 'name address city');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/bookings/my - Get current user bookings
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('parkingArea', 'name address city pricePerHour')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/bookings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('parkingArea', 'name address city pricePerHour');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/bookings/:id/cancel
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    if (booking.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Free up slot
    const area = await ParkingArea.findById(booking.parkingArea);
    if (area) {
      const slot = area.slots.find(s => s.slotNumber === booking.slotNumber);
      if (slot) slot.isOccupied = false;
      area.availableSlots = Math.min(area.totalSlots, area.availableSlots + 1);
      await area.save();
    }
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
