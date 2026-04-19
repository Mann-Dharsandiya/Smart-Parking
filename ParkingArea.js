const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  slotNumber: { type: String, required: true },
  type: { type: String, enum: ['car', 'bike', 'truck'], default: 'car' },
  isOccupied: { type: Boolean, default: false },
  floor: { type: Number, default: 1 }
});

const parkingAreaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  totalSlots: { type: Number, required: true },
  availableSlots: { type: Number, required: true },
  pricePerHour: { type: Number, required: true },
  facilities: [{ type: String }],
  slots: [slotSchema],
  images: [{ type: String }],
  rating: { type: Number, default: 4.0 },
  reviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  operatingHours: {
    open: { type: String, default: '06:00' },
    close: { type: String, default: '23:00' }
  }
}, { timestamps: true });

module.exports = mongoose.model('ParkingArea', parkingAreaSchema);
