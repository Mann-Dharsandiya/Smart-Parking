import React from 'react';
import { Link } from 'react-router-dom';
import './ParkingCard.css';

const facilityIcons = { 'CCTV': '📷', 'EV Charging': '⚡', '24/7': '🕐', 'Security Guard': '👮', 'Covered': '🏠', 'Valet': '🚗', 'Shuttle Service': '🚌' };

const ParkingCard = ({ area }) => {
  const occupancyPct = Math.round(((area.totalSlots - area.availableSlots) / area.totalSlots) * 100);
  const statusColor = area.availableSlots === 0 ? 'full' : area.availableSlots < 10 ? 'low' : 'available';

  return (
    <div className="parking-card">
      <div className={`availability-badge ${statusColor}`}>
        {area.availableSlots === 0 ? '🔴 Full' : area.availableSlots < 10 ? `🟡 ${area.availableSlots} left` : `🟢 ${area.availableSlots} available`}
      </div>
      <div className="parking-card-header">
        <div className="parking-icon">🅿</div>
        <div className="parking-info">
          <h3>{area.name}</h3>
          <p className="parking-address">📍 {area.address}, {area.city}</p>
        </div>
      </div>
      <div className="occupancy-bar">
        <div className="occupancy-fill" style={{ width: `${occupancyPct}%`, backgroundColor: occupancyPct > 90 ? 'var(--danger)' : occupancyPct > 70 ? 'var(--warning)' : 'var(--success)' }}></div>
      </div>
      <p className="occupancy-text">{occupancyPct}% occupied · {area.totalSlots} total spots</p>
      <div className="parking-meta">
        <div className="meta-item">
          <span className="meta-label">Price</span>
          <span className="meta-value price">₹{area.pricePerHour}/hr</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Rating</span>
          <span className="meta-value">⭐ {area.rating} ({area.reviews})</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Hours</span>
          <span className="meta-value">{area.operatingHours?.open} - {area.operatingHours?.close}</span>
        </div>
      </div>
      {area.facilities?.length > 0 && (
        <div className="facilities">
          {area.facilities.slice(0, 4).map(f => (
            <span key={f} className="facility-tag">{facilityIcons[f] || '✓'} {f}</span>
          ))}
          {area.facilities.length > 4 && <span className="facility-tag more">+{area.facilities.length - 4}</span>}
        </div>
      )}
      <div className="parking-card-footer">
        <Link to={`/parking/${area._id}`} className="btn btn-outline btn-sm">View Details</Link>
        {area.availableSlots > 0 && (
          <Link to={`/parking/${area._id}`} className="btn btn-primary btn-sm">Book Now →</Link>
        )}
      </div>
    </div>
  );
};

export default ParkingCard;
