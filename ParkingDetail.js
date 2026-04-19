import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getParkingArea, getSlots, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './ParkingDetail.css';

const facilityIcons = { 'CCTV': '📷', 'EV Charging': '⚡', '24/7': '🕐', 'Security Guard': '👮', 'Covered': '🏠', 'Valet': '🚗', 'Shuttle Service': '🚌' };

const ParkingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [area, setArea] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ selectedSlot: '', vehiclePlate: '', vehicleType: 'car', startTime: '', endTime: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getParkingArea(id);
        setArea(data);
        if (user) {
          const slotRes = await getSlots(id);
          setSlots(slotRes.data);
        }
        if (user?.vehicles?.[0]) setBooking(b => ({ ...b, vehiclePlate: user.vehicles[0].plate, vehicleType: user.vehicles[0].type }));
      } catch { toast.error('Failed to load parking details'); }
      finally { setLoading(false); }
    };
    load();
  }, [id, user]);

  const now = new Date();
  const minDate = now.toISOString().slice(0, 16);

  const calcDuration = () => {
    if (!booking.startTime || !booking.endTime) return 0;
    return Math.max(0, Math.ceil((new Date(booking.endTime) - new Date(booking.startTime)) / 3600000));
  };

  const calcTotal = () => calcDuration() * (area?.pricePerHour || 0);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!booking.selectedSlot) return toast.error('Please select a parking slot');
    if (!booking.startTime || !booking.endTime) return toast.error('Please select start and end time');
    if (calcDuration() < 1) return toast.error('Minimum booking duration is 1 hour');
    setBookingLoading(true);
    try {
      const res = await createBooking({ parkingAreaId: id, slotNumber: booking.selectedSlot, vehiclePlate: booking.vehiclePlate, vehicleType: booking.vehicleType, startTime: booking.startTime, endTime: booking.endTime });
      toast.success('Booking confirmed! 🎉');
      navigate(`/bookings/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner"></div><p>Loading parking details...</p></div>;
  if (!area) return <div className="page-loader"><h3>Parking area not found</h3></div>;

  return (
    <div className="parking-detail-page">
      <div className="detail-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <div className="detail-header-content">
            <div>
              <h1>{area.name}</h1>
              <p>📍 {area.address}, {area.city}</p>
              <div className="detail-badges">
                <span className="badge badge-primary">⭐ {area.rating} ({area.reviews} reviews)</span>
                <span className={`badge ${area.availableSlots > 10 ? 'badge-success' : area.availableSlots > 0 ? 'badge-warning' : 'badge-danger'}`}>
                  {area.availableSlots > 0 ? `${area.availableSlots} slots available` : 'Full'}
                </span>
                <span className="badge badge-gray">🕐 {area.operatingHours?.open} - {area.operatingHours?.close}</span>
              </div>
            </div>
            <div className="detail-price">
              <span className="price-amount">₹{area.pricePerHour}</span>
              <span className="price-unit">per hour</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container detail-layout">
        {/* Left: Details */}
        <div className="detail-main">
          <div className="detail-tabs">
            {['details', 'slots'].map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab === 'details' ? '📋 Details' : '🅿️ Slot Map'}
              </button>
            ))}
          </div>

          {activeTab === 'details' && (
            <div className="detail-panel">
              <div className="info-section">
                <h3>About This Parking</h3>
                <div className="info-grid">
                  <div className="info-item"><span className="info-label">Total Slots</span><span className="info-value">{area.totalSlots}</span></div>
                  <div className="info-item"><span className="info-label">Available</span><span className="info-value text-success">{area.availableSlots}</span></div>
                  <div className="info-item"><span className="info-label">Price/Hour</span><span className="info-value">₹{area.pricePerHour}</span></div>
                  <div className="info-item"><span className="info-label">Opens</span><span className="info-value">{area.operatingHours?.open}</span></div>
                  <div className="info-item"><span className="info-label">Closes</span><span className="info-value">{area.operatingHours?.close}</span></div>
                  <div className="info-item"><span className="info-label">Rating</span><span className="info-value">⭐ {area.rating}</span></div>
                </div>
              </div>
              {area.facilities?.length > 0 && (
                <div className="info-section">
                  <h3>Facilities</h3>
                  <div className="facilities-list">
                    {area.facilities.map(f => (
                      <div key={f} className="facility-item">
                        <span className="facility-icon">{facilityIcons[f] || '✓'}</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'slots' && (
            <div className="detail-panel">
              {!user ? (
                <div className="login-prompt">
                  <p>🔒 Please sign in to view slot availability</p>
                  <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
                </div>
              ) : (
                <>
                  <div className="slot-legend">
                    <span className="legend-item"><span className="slot-dot available"></span>Available</span>
                    <span className="legend-item"><span className="slot-dot occupied"></span>Occupied</span>
                    <span className="legend-item"><span className="slot-dot selected"></span>Selected</span>
                  </div>
                  <div className="slots-grid">
                    {slots.map(slot => (
                      <button
                        key={slot._id}
                        className={`slot-btn ${slot.isOccupied ? 'occupied' : booking.selectedSlot === slot.slotNumber ? 'selected' : 'free'}`}
                        disabled={slot.isOccupied}
                        onClick={() => !slot.isOccupied && setBooking(b => ({ ...b, selectedSlot: slot.slotNumber }))}
                      >
                        <span className="slot-no">{slot.slotNumber}</span>
                        <span className="slot-type">{slot.type}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Booking form */}
        <div className="booking-panel">
          <div className="booking-card">
            <h3>📅 Book This Spot</h3>
            {!user ? (
              <div className="login-prompt">
                <p>Sign in to book a parking spot</p>
                <button className="btn btn-primary btn-full" onClick={() => navigate('/login')}>Sign In to Book</button>
              </div>
            ) : area.availableSlots === 0 ? (
              <div className="full-notice">🔴 This parking area is currently full. Please check back later.</div>
            ) : (
              <form onSubmit={handleBook}>
                <div className="form-group">
                  <label className="form-label">Selected Slot</label>
                  <input className="form-control" value={booking.selectedSlot || 'Click a slot on the map'} readOnly />
                  {!booking.selectedSlot && <p className="form-hint">Go to "Slot Map" tab to select a slot</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Vehicle Plate</label>
                  <input className="form-control" placeholder="e.g. MH12AB1234" value={booking.vehiclePlate} onChange={e => setBooking(b => ({ ...b, vehiclePlate: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Vehicle Type</label>
                  <select className="form-control" value={booking.vehicleType} onChange={e => setBooking(b => ({ ...b, vehicleType: e.target.value }))}>
                    <option value="car">🚗 Car</option>
                    <option value="bike">🏍️ Bike</option>
                    <option value="truck">🚛 Truck</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input type="datetime-local" className="form-control" min={minDate} value={booking.startTime} onChange={e => setBooking(b => ({ ...b, startTime: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input type="datetime-local" className="form-control" min={booking.startTime || minDate} value={booking.endTime} onChange={e => setBooking(b => ({ ...b, endTime: e.target.value }))} required />
                </div>

                {calcDuration() > 0 && (
                  <div className="booking-summary">
                    <div className="summary-row"><span>Duration</span><span>{calcDuration()} hr{calcDuration() > 1 ? 's' : ''}</span></div>
                    <div className="summary-row"><span>Rate</span><span>₹{area.pricePerHour}/hr</span></div>
                    <div className="summary-row total"><span>Total</span><span>₹{calcTotal()}</span></div>
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={bookingLoading}>
                  {bookingLoading ? '⏳ Confirming...' : `Confirm Booking${calcTotal() > 0 ? ` — ₹${calcTotal()}` : ''}`}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingDetail;
