import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
    <div>
      <div style={{ fontSize: '8rem', lineHeight: 1, marginBottom: '24px' }}>🖼️</div>
      <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', color: 'var(--gold)', fontFamily: "'Playfair Display', serif", marginBottom: '16px' }}>404</h1>
      <h2 style={{ marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
        The artwork you're looking for seems to have been sold or doesn't exist.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">← Go Home</Link>
        <Link to="/gallery" className="btn btn-secondary">View Gallery</Link>
      </div>
    </div>
  </div>
);

export default NotFound;
