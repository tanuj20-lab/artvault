import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import { registerUser } from '../services/api';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      dispatch(setCredentials(data.data));
      toast.success(`Welcome to ArtVault, ${data.data.name}! 🎨`);
      const dashMap = { artist: '/artist-dashboard', buyer: '/buyer-dashboard' };
      navigate(dashMap[data.data.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">🎨 ArtVault</Link>
            <h1 className="auth-title">Join ArtVault</h1>
            <p className="auth-subtitle">Create your account and start your art journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" className="form-input" placeholder="Your name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="regEmail">Email Address</label>
              <input id="regEmail" name="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="regPass">Password</label>
              <input id="regPass" name="password" type="password" className="form-input" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">I want to join as</label>
              <div className="role-selector">
                <button type="button" className={`role-option ${form.role === 'buyer' ? 'selected' : ''}`} onClick={() => setForm({ ...form, role: 'buyer' })}>
                  <span className="role-icon">🛍️</span>
                  <span className="role-name">Buyer</span>
                  <span className="role-desc">Browse & collect art</span>
                </button>
                <button type="button" className={`role-option ${form.role === 'artist' ? 'selected' : ''}`} onClick={() => setForm({ ...form, role: 'artist' })}>
                  <span className="role-icon">🎨</span>
                  <span className="role-name">Artist</span>
                  <span className="role-desc">Upload & sell your art</span>
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? '⏳ Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in →</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
