import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
      navigate(user.role === 'admin' ? '/admin' : '/parking');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  const fillDemo = (type) => {
    if (type === 'admin') setForm({ email: 'admin@smartpark.com', password: 'admin123' });
    else setForm({ email: 'john@example.com', password: 'user123' });
  };

  return (
    <div className="auth-page">
      <div className="auth-illustration">
        <div className="auth-brand">🅿️ SmartPark</div>
        <h2>Park Smart, Live Easy</h2>
        <p>Access real-time parking availability and book your spot in seconds.</p>
        <div className="auth-features">
          {['🔍 Real-time availability', '📋 Instant booking', '💳 Secure payments', '📱 Digital pass'].map(f => (
            <div key={f} className="auth-feature">{f}</div>
          ))}
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-card">
          <h2>Sign In</h2>
          <p className="auth-subtitle">Welcome back! Enter your credentials.</p>

          <div className="demo-buttons">
            <p>Quick fill:</p>
            <button type="button" className="demo-btn admin" onClick={() => fillDemo('admin')}>👑 Demo Admin</button>
            <button type="button" className="demo-btn" onClick={() => fillDemo('user')}>👤 Demo User</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Enter your password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? '⏳ Signing In...' : 'Sign In →'}
            </button>
          </form>

          <p className="auth-switch">Don't have an account? <Link to="/register">Sign up free</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
