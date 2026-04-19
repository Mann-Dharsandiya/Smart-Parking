const express = require('express');
const router = express.Router();
const ParkingArea = require('../models/ParkingArea');
const { protect } = require('../middleware/auth');

// @GET /api/parking - Get all parking areas
router.get('/', async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, search } = req.query;
    let filter = { isActive: true };
    if (city) filter.city = new RegExp(city, 'i');
    if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { address: new RegExp(search, 'i') }, { city: new RegExp(search, 'i') }];
    if (minPrice || maxPrice) {
      filter.pricePerHour = {};
      if (minPrice) filter.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerHour.$lte = Number(maxPrice);
    }
    const areas = await ParkingArea.find(filter).select('-slots');
    res.json(areas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/parking/:id
router.get('/:id', async (req, res) => {
  try {
    const area = await ParkingArea.findById(req.params.id);
    if (!area) return res.status(404).json({ message: 'Parking area not found' });
    res.json(area);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/parking/:id/slots
router.get('/:id/slots', protect, async (req, res) => {
  try {
    const area = await ParkingArea.findById(req.params.id).select('slots name');
    if (!area) return res.status(404).json({ message: 'Parking area not found' });
    res.json(area.slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
