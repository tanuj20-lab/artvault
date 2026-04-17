import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">🎨 ArtVault</div>
          <p className="footer-tagline">Where creativity meets collectors. Discover, bid, and own extraordinary artwork from artists worldwide.</p>
        </div>
        <div className="footer-links-col">
          <h4>Explore</h4>
          <Link to="/gallery">Gallery</Link>
          <Link to="/auctions">Live Auctions</Link>
        </div>
        <div className="footer-links-col">
          <h4>Account</h4>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Join as Artist</Link>
          <Link to="/register">Join as Buyer</Link>
        </div>
        <div className="footer-links-col">
          <h4>Categories</h4>
          <Link to="/gallery?category=Painting">Paintings</Link>
          <Link to="/gallery?category=Sculpture">Sculptures</Link>
          <Link to="/gallery?category=Digital Art">Digital Art</Link>
          <Link to="/gallery?category=Photography">Photography</Link>
        </div>
      </div>
      <div className="gold-line" style={{ margin: '32px 0 24px' }} />
      <div className="footer-bottom">
        <p>© 2026 ArtVault. All rights reserved.</p>
        <p className="footer-credit">Built with MERN Stack 🎨</p>
      </div>
    </div>
    <style>{`
      .footer { background: var(--bg-secondary); border-top: 1px solid var(--border-subtle); padding: 60px 0 24px; margin-top: 80px; position: relative; }
      .footer::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--gold), var(--pink), transparent); }
      .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }
      .footer-logo { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; background: linear-gradient(135deg, var(--gold), var(--pink)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 12px; }
      .footer-tagline { color: var(--text-muted); font-size: 0.9rem; line-height: 1.7; max-width: 280px; }
      .footer-links-col { display: flex; flex-direction: column; gap: 10px; }
      .footer-links-col h4 { color: var(--text-primary); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
      .footer-links-col a { color: var(--text-muted); font-size: 0.9rem; transition: var(--transition-fast); }
      .footer-links-col a:hover { color: var(--pink-light); }
      .footer-bottom { display: flex; justify-content: space-between; align-items: center; padding: 0; }
      .footer-bottom p { color: var(--text-muted); font-size: 0.85rem; }
      .footer-credit { color: var(--text-muted); }
      @media (max-width: 768px) {
        .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
        .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
      }
      @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr; } }
    `}</style>
  </footer>
);

export default Footer;
