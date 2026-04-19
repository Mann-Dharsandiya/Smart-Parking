const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parkingArea: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingArea', required: true },
  slotNumber: { type: String, required: true },
  vehiclePlate: { type: String, required: true },
  vehicleType: { type: String, enum: ['car', 'bike', 'truck'], default: 'car' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number }, // hours
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, default: 'online' },
  bookingId: { type: String, unique: true },
  notes: { type: String, default: '' }
}, { timestamps: true });

bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'SP' + Date.now() + Math.floor(Math.random() * 1000);
  }
  if (this.startTime && this.endTime) {
    this.duration = Math.ceil((this.endTime - this.startTime) / (1000 * 60 * 60));
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
