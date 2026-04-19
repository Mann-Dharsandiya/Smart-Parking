require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const ParkingArea = require('./models/ParkingArea');
const Booking = require('./models/Booking');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');
};

const generateSlots = (count, prefix = 'S') => {
  const slots = [];
  for (let i = 1; i <= count; i++) {
    slots.push({
      slotNumber: `${prefix}${String(i).padStart(3, '0')}`,
      type: i % 10 === 0 ? 'truck' : i % 5 === 0 ? 'bike' : 'car',
      isOccupied: Math.random() < 0.3,
      floor: Math.ceil(i / 20)
    });
  }
  return slots;
};

const seed = async () => {
  await connectDB();

  console.log('🗑️  Clearing existing data...');
  await User.deleteMany({});
  await ParkingArea.deleteMany({});
  await Booking.deleteMany({});

  console.log('👤 Creating users...');
  const adminPass = await bcrypt.hash('admin123', 10);
  const userPass = await bcrypt.hash('user123', 10);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@smartpark.com',
    password: adminPass,
    phone: '+91-9876543210',
    role: 'admin'
  });

  const user1 = await User.create({
    name: 'John Doe',
    email: 'john@example.com',
    password: userPass,
    phone: '+91-9876543211',
    role: 'user',
    vehicles: [{ plate: 'MH12AB1234', type: 'car', model: 'Honda City' }]
  });

  const user2 = await User.create({
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: userPass,
    phone: '+91-9876543212',
    role: 'user',
    vehicles: [{ plate: 'MH14CD5678', type: 'bike', model: 'Activa 6G' }]
  });

  console.log('🅿️  Creating parking areas...');
  const areas = await ParkingArea.insertMany([
    {
      name: 'SmartPark Central Mall',
      address: 'FC Road, Shivajinagar',
      city: 'Pune',
      totalSlots: 80,
      availableSlots: 55,
      pricePerHour: 40,
      facilities: ['CCTV', 'EV Charging', '24/7', 'Security Guard', 'Covered'],
      slots: generateSlots(80, 'C'),
      rating: 4.5,
      reviews: 128,
      coordinates: { lat: 18.5204, lng: 73.8567 },
      operatingHours: { open: '00:00', close: '23:59' }
    },
    {
      name: 'TechPark Parking Hub',
      address: 'Hinjewadi Phase 1',
      city: 'Pune',
      totalSlots: 150,
      availableSlots: 62,
      pricePerHour: 30,
      facilities: ['CCTV', 'Covered', 'Security Guard', 'Valet'],
      slots: generateSlots(150, 'T'),
      rating: 4.2,
      reviews: 94,
      coordinates: { lat: 18.5910, lng: 73.7380 },
      operatingHours: { open: '06:00', close: '22:00' }
    },
    {
      name: 'Station Road Parking',
      address: 'Near Pune Railway Station',
      city: 'Pune',
      totalSlots: 60,
      availableSlots: 18,
      pricePerHour: 20,
      facilities: ['24/7', 'Security Guard'],
      slots: generateSlots(60, 'R'),
      rating: 3.8,
      reviews: 210,
      coordinates: { lat: 18.5286, lng: 73.8742 },
      operatingHours: { open: '00:00', close: '23:59' }
    },
    {
      name: 'Airport Parking Zone',
      address: 'Lohegaon, Near Airport',
      city: 'Pune',
      totalSlots: 200,
      availableSlots: 134,
      pricePerHour: 60,
      facilities: ['CCTV', 'Covered', 'EV Charging', '24/7', 'Security Guard', 'Shuttle Service'],
      slots: generateSlots(200, 'A'),
      rating: 4.7,
      reviews: 312,
      coordinates: { lat: 18.5821, lng: 73.9197 },
      operatingHours: { open: '00:00', close: '23:59' }
    },
    {
      name: 'Koregaon Park Smart Lot',
      address: 'Lane 5, Koregaon Park',
      city: 'Pune',
      totalSlots: 45,
      availableSlots: 22,
      pricePerHour: 35,
      facilities: ['CCTV', 'Covered', 'Valet'],
      slots: generateSlots(45, 'K'),
      rating: 4.3,
      reviews: 67,
      coordinates: { lat: 18.5362, lng: 73.8929 },
      operatingHours: { open: '08:00', close: '23:00' }
    },
    {
      name: 'MG Road Parking Plaza',
      address: 'MG Road, Pune Camp',
      city: 'Pune',
      totalSlots: 90,
      availableSlots: 41,
      pricePerHour: 25,
      facilities: ['CCTV', 'Security Guard'],
      slots: generateSlots(90, 'M'),
      rating: 4.0,
      reviews: 155,
      coordinates: { lat: 18.5195, lng: 73.8553 },
      operatingHours: { open: '07:00', close: '22:00' }
    }
  ]);

  console.log('📅 Creating demo bookings...');
  const now = new Date();
  const startTime1 = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const endTime1 = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  await Booking.create([
    {
      user: user1._id,
      parkingArea: areas[0]._id,
      slotNumber: 'C001',
      vehiclePlate: 'MH12AB1234',
      vehicleType: 'car',
      startTime: startTime1,
      endTime: endTime1,
      duration: 4,
      totalAmount: 160,
      status: 'active',
      paymentStatus: 'paid'
    },
    {
      user: user2._id,
      parkingArea: areas[1]._id,
      slotNumber: 'T005',
      vehiclePlate: 'MH14CD5678',
      vehicleType: 'bike',
      startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() - 20 * 60 * 60 * 1000),
      duration: 4,
      totalAmount: 120,
      status: 'completed',
      paymentStatus: 'paid'
    },
    {
      user: user1._id,
      parkingArea: areas[3]._id,
      slotNumber: 'A010',
      vehiclePlate: 'MH12AB1234',
      vehicleType: 'car',
      startTime: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() - 45 * 60 * 60 * 1000),
      duration: 3,
      totalAmount: 180,
      status: 'completed',
      paymentStatus: 'paid'
    }
  ]);

  console.log('\n✅ Seeding complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 Admin:  admin@smartpark.com / admin123');
  console.log('👤 User 1: john@example.com / user123');
  console.log('👤 User 2: priya@example.com / user123');
  console.log('🅿️  Parking Areas:', areas.length);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
