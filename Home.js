import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getParkingAreas } from '../services/api';
import ParkingCard from '../components/ParkingCard';
import './Home.css';

const Home = () => {
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getParkingAreas().then(res => setFeatured(res.data.slice(0, 3))).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/parking?search=${encodeURIComponent(search)}`);
  };

  const stats = [
    { icon: '🅿️', value: '500+', label: 'Parking Spots' },
    { icon: '👥', value: '10,000+', label: 'Happy Users' },
    { icon: '🏙️', value: '15+', label: 'Cities Covered' },
    { icon: '⭐', value: '4.8/5', label: 'Avg Rating' },
  ];

  const features = [
    { icon: '🔍', title: 'Find Instantly', desc: 'Search parking spots near you with real-time availability updates.' },
    { icon: '📱', title: 'Book Online', desc: 'Reserve your spot in advance — no more circling the block.' },
    { icon: '⚡', title: 'Quick Access', desc: 'Get your digital pass instantly after booking confirmation.' },
    { icon: '🔒', title: 'Secure & Safe', desc: 'All parking zones have CCTV surveillance and security guards.' },
    { icon: '💳', title: 'Easy Payment', desc: 'Pay online or at the spot. UPI, cards, wallets all accepted.' },
    { icon: '📊', title: 'Live Tracking', desc: 'Track your booking status and parking duration in real-time.' },
  ];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-badge">🚀 India's #1 Smart Parking Platform</div>
            <h1>Find & Book Parking<br /><span>In Seconds</span></h1>
            <p>No more parking stress. SmartPark shows real-time availability and lets you book your spot before you leave home.</p>
            <form className="search-bar" onSubmit={handleSearch}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by area, landmark or city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Search Parking</button>
            </form>
            <div className="hero-hints">
              <span>Popular:</span>
              {['Shivajinagar', 'Hinjewadi', 'Airport', 'MG Road'].map(s => (
                <button key={s} className="hint-tag" onClick={() => navigate(`/parking?search=${s}`)}>{s}</button>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="parking-grid-visual">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className={`spot ${i % 5 === 0 ? 'occupied' : i % 7 === 0 ? 'selected' : ''}`}>
                  {i % 5 === 0 ? '🚗' : i % 7 === 0 ? '✅' : ''}
                </div>
              ))}
            </div>
            <div className="hero-card">
              <p className="hc-label">Available Now</p>
              <p className="hc-count">342 <span>spots</span></p>
              <p className="hc-city">📍 Pune City</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <h2 className="section-title">Why Choose SmartPark?</h2>
            <p className="section-subtitle">Everything you need for a stress-free parking experience</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Parking */}
      {featured.length > 0 && (
        <section className="section featured-section">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <div>
                <h2 className="section-title">Featured Parking Areas</h2>
                <p className="section-subtitle">Top-rated spots in your city</p>
              </div>
              <Link to="/parking" className="btn btn-outline">View All →</Link>
            </div>
            <div className="featured-grid">
              {featured.map(area => <ParkingCard key={area._id} area={area} />)}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="section how-it-works">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Book your parking in 3 simple steps</p>
          </div>
          <div className="steps-grid">
            {[
              { step: '01', icon: '🔍', title: 'Search', desc: 'Enter your destination and find nearby parking areas with live availability.' },
              { step: '02', icon: '📋', title: 'Book', desc: 'Choose your preferred spot, set your time, and confirm the booking instantly.' },
              { step: '03', icon: '🚗', title: 'Park', desc: 'Show your digital pass at the entrance and drive straight to your reserved spot.' },
            ].map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{step.step}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container text-center">
          <h2>Ready to Park Smart?</h2>
          <p>Join 10,000+ drivers who've ditched parking stress with SmartPark.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/parking" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>Browse Parking</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
