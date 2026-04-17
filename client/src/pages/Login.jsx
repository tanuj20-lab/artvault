import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import { loginUser } from '../services/api';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      dispatch(setCredentials(data.data));
      toast.success(`Welcome back, ${data.data.name}! 🎨`);
      const dashMap = { artist: '/artist-dashboard', buyer: '/buyer-dashboard', admin: '/admin-dashboard' };
      navigate(dashMap[data.data.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" className="form-input" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? '⏳ Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Create one →</Link></p>
          </div>

          <div className="auth-demo">
            <p className="auth-demo-title">Demo Credentials</p>
            <div className="auth-demo-items">
              <div><strong>Artist:</strong> artist@demo.com / demo123</div>
              <div><strong>Buyer:</strong> buyer@demo.com / demo123</div>
              <div><strong>Admin:</strong> admin@demo.com / demo123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
