import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      toast.success('Account created! Welcome to SmartPark 🎉');
      navigate('/parking');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="auth-page">
      <div className="auth-illustration">
        <div className="auth-brand">🅿️ SmartPark</div>
        <h2>Join SmartPark Today</h2>
        <p>Create your free account and start booking parking spots instantly.</p>
        <div className="auth-features">
          {['✅ Free to sign up', '🚗 Save your vehicles', '📋 Booking history', '🔔 Slot alerts'].map(f => (
            <div key={f} className="auth-feature">{f}</div>
          ))}
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join 10,000+ drivers on SmartPark.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" placeholder="John Doe" value={form.name} onChange={e => upd('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={e => upd('email', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-control" placeholder="+91-9876543210" value={form.phone} onChange={e => upd('phone', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Min. 6 characters" value={form.password} onChange={e => upd('password', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" placeholder="Repeat password" value={form.confirm} onChange={e => upd('confirm', e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? '⏳ Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
