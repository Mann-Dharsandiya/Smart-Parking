import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../services/api';
import { useToast } from '../context/ToastContext';
import { format } from 'date-fns';
import './Bookings.css';

const statusColors = { active: 'badge-success', pending: 'badge-warning', completed: 'badge-gray', cancelled: 'badge-danger' };
const statusIcons = { active: '🟢', pending: '🟡', completed: '✅', cancelled: '🔴' };

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const toast = useToast();
  const navigate = useNavigate();

  const load = async () => {
    try {
      const { data } = await getMyBookings();
      setBookings(data);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking? You will receive a full refund.')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled. Refund initiated.');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const tabs = ['all', 'active', 'completed', 'cancelled'];

  return (
    <div className="bookings-page">
      <div className="page-header">
        <div className="container">
          <h1>My Bookings</h1>
          <p>Manage and track all your parking reservations</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div className="bookings-tabs">
          {tabs.map(tab => (
            <button key={tab} className={`tab-filter-btn ${filter === tab ? 'active' : ''}`} onClick={() => setFilter(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="tab-count">{tab === 'all' ? bookings.length : bookings.filter(b => b.status === tab).length}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="page-loader"><div className="spinner"></div><p>Loading bookings...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 64 }}>📋</div>
            <h3>No bookings found</h3>
            <p>You don't have any {filter !== 'all' ? filter : ''} bookings yet.</p>
            <Link to="/parking" className="btn btn-primary" style={{ marginTop: 16 }}>Find Parking</Link>
          </div>
        ) : (
          <div className="bookings-list">
            {filtered.map(booking => (
              <div key={booking._id} className="booking-item">
                <div className="booking-item-header">
                  <div>
                    <h3>{booking.parkingArea?.name}</h3>
                    <p>📍 {booking.parkingArea?.address}, {booking.parkingArea?.city}</p>
                  </div>
                  <span className={`badge ${statusColors[booking.status]}`}>{statusIcons[booking.status]} {booking.status}</span>
                </div>

                <div className="booking-details-grid">
                  <div className="booking-detail"><span className="bd-label">Booking ID</span><span className="bd-value mono">{booking.bookingId}</span></div>
                  <div className="booking-detail"><span className="bd-label">Slot</span><span className="bd-value">{booking.slotNumber}</span></div>
                  <div className="booking-detail"><span className="bd-label">Vehicle</span><span className="bd-value">{booking.vehiclePlate} ({booking.vehicleType})</span></div>
                  <div className="booking-detail"><span className="bd-label">Duration</span><span className="bd-value">{booking.duration} hr{booking.duration > 1 ? 's' : ''}</span></div>
                  <div className="booking-detail"><span className="bd-label">Start</span><span className="bd-value">{format(new Date(booking.startTime), 'dd MMM, hh:mm a')}</span></div>
                  <div className="booking-detail"><span className="bd-label">End</span><span className="bd-value">{format(new Date(booking.endTime), 'dd MMM, hh:mm a')}</span></div>
                  <div className="booking-detail"><span className="bd-label">Amount</span><span className="bd-value price">₹{booking.totalAmount}</span></div>
                  <div className="booking-detail"><span className="bd-label">Payment</span><span className={`bd-value ${booking.paymentStatus === 'paid' ? 'text-success' : ''}`}>{booking.paymentStatus}</span></div>
                </div>

                <div className="booking-item-footer">
                  <span className="booking-date">Booked on {format(new Date(booking.createdAt), 'dd MMM yyyy')}</span>
                  <div className="booking-actions">
                    <Link to={`/bookings/${booking._id}`} className="btn btn-secondary btn-sm">View Details</Link>
                    {booking.status === 'active' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(booking._id)}>Cancel</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
