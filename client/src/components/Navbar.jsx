import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { getNotifications } from '../services/api';
import { setNotifications } from '../redux/notificationSlice';
import './Navbar.css';

const Navbar = () => {
  const { user } = useSelector((s) => s.auth);
  const { unreadCount } = useSelector((s) => s.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      getNotifications().then(res => dispatch(setNotifications(res.data.data))).catch(() => {});
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'artist') return '/artist-dashboard';
    if (user.role === 'admin') return '/admin-dashboard';
    return '/buyer-dashboard';
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🎨</span>
          <span className="brand-text">ArtVault</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`} onClick={(e) => e.target.closest('a') && setMenuOpen(false)}>
          <Link to="/gallery" className={`nav-link ${location.pathname === '/gallery' ? 'active' : ''}`}>Gallery</Link>
          <Link to="/auctions" className={`nav-link ${location.pathname === '/auctions' ? 'active' : ''}`}>Auctions</Link>
          {user ? (
            <>
              <Link to={getDashboardPath()} className={`nav-link ${location.pathname.includes('dashboard') ? 'active' : ''}`}>Dashboard</Link>
              {user.role === 'buyer' && (
                <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>Orders</Link>
              )}
              <Link to="/notifications" className="nav-link notif-link" style={{ position: 'relative' }}>
                🔔
                {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </Link>
              <div className="nav-user">
                <span className="nav-user-name">{user.name}</span>
                <span className={`nav-role-badge role-${user.role}`}>{user.role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join Now</Link>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
