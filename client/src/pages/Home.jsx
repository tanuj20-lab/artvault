import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArtworks, getAuctions } from '../services/api';
import ArtworkCard from '../components/ArtworkCard';
import AuctionCard from '../components/AuctionCard';
import './Home.css';

const CATEGORIES = [
  {
    name: 'Painting',
    icon: '🖼️',
    // Dark gold-framed classical oil painting in museum — Unsplash
    image: 'https://images.unsplash.com/photo-1575223970966-76ae61ee7838?q=80&w=600',
    desc: 'Oil, Acrylic & Watercolour',
  },
  {
    name: 'Sculpture',
    icon: '🗿',
    // Classical marble bust in dark dramatic studio lighting — Unsplash
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600',
    desc: 'Stone, Bronze & Clay',
  },
  {
    name: 'Photography',
    icon: '📸',
    // Dark cinematic fine-art moody portrait photography — Unsplash
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600',
    desc: 'Fine Art & Documentary',
  },
  {
    name: 'Digital Art',
    icon: '💻',
    // Dark glowing neon digital surrealism — Unsplash
    image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=600',
    desc: 'NFT, Illustrations & 3D',
  },
  {
    name: 'Sketch',
    icon: '✏️',
    // Detailed ink sketch on aged parchment, heritage style — Unsplash
    image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600',
    desc: 'Pencil, Ink & Charcoal',
  },
  {
    name: 'Mixed Media',
    icon: '🎭',
    // Dark gold-leaf luxury textured mixed media canvas — Unsplash
    image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=600',
    desc: 'Collage & Experimental',
  },
];

// Hero collage — dark, dramatic fine-art royal aesthetic (all verified Unsplash)
const HERO_IMAGES = [
  // Dark moody abstract oil painting brushwork — rich pigments
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=500',
  // Classical old-master style painting in ornate gold frame
  'https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=500',
  // Grand museum gallery hall — gilded frames, arched ceilings
  'https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=500',
  // Dramatic dark marble Greek sculpture — chiaroscuro
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=500',
  // Rich red & gold abstract expressionist canvas
  'https://images.unsplash.com/photo-1578926288207-a90a5366759d?q=80&w=500',
  // Dark atmospheric fine-art portrait photography
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=500',
];

const Home = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getArtworks({ status: 'available' }),
      getAuctions({ status: 'active' }),
    ]).then(([artRes, auctRes]) => {
      setFeaturedArtworks(artRes.data.data.slice(0, 4));
      setActiveAuctions(auctRes.data.data.slice(0, 3));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>
        <div className="container hero-inner">
          {/* Left: text */}
          <div className="hero-content">
            <div className="hero-badge">✦ Where Art Meets Collectors</div>
            <h1 className="hero-title">
              Discover &amp; Collect<br />
              <span className="hero-title-gold">Extraordinary Art</span>
            </h1>
            <p className="hero-subtitle">
              Browse thousands of original artworks from talented artists worldwide.
              Participate in live auctions and bring home a masterpiece.
            </p>
            <div className="hero-actions">
              <Link to="/gallery" className="btn btn-primary btn-lg">Explore Gallery</Link>
              <Link to="/auctions" className="btn btn-secondary btn-lg">Live Auctions</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><span className="hero-stat-num">500+</span><span className="hero-stat-lbl">Artworks</span></div>
              <div className="hero-stat-divider" />
              <div className="hero-stat"><span className="hero-stat-num">150+</span><span className="hero-stat-lbl">Artists</span></div>
              <div className="hero-stat-divider" />
              <div className="hero-stat"><span className="hero-stat-num">₹2M+</span><span className="hero-stat-lbl">in Sales</span></div>
            </div>
          </div>

          {/* Right: artwork collage */}
          <div className="hero-collage" aria-hidden="true">
            <div className="collage-grid">
              {HERO_IMAGES.map((src, i) => (
                <div key={i} className={`collage-item collage-item-${i + 1}`}>
                  <img src={src} alt="" loading="lazy" />
                  <div className="collage-shine" />
                </div>
              ))}
            </div>
            <div className="collage-glow" />
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">Find your perfect style across our curated art categories</p>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/gallery?category=${cat.name}`} className="category-card">
                <img src={cat.image} alt={cat.name} className="category-bg-img" loading="lazy" />
                <div className="category-overlay" />
                <div className="category-content">
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                  <span className="category-desc">{cat.desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ARTWORKS ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Artworks</h2>
              <p className="section-subtitle">Handpicked pieces from our talented community of artists</p>
            </div>
            <Link to="/gallery" className="btn btn-secondary">View All →</Link>
          </div>
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /><p>Loading artworks...</p></div>
          ) : featuredArtworks.length > 0 ? (
            <div className="grid-4">{featuredArtworks.map(a => <ArtworkCard key={a._id} artwork={a} />)}</div>
          ) : (
            <div className="empty-state"><h3>No artworks yet</h3><p>Artists are uploading their masterpieces. Check back soon!</p></div>
          )}
        </div>
      </section>

      {/* ── LIVE AUCTIONS ── */}
      <section className="section auctions-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">🔴 Live Auctions</h2>
              <p className="section-subtitle">Place bids on exclusive artworks before time runs out!</p>
            </div>
            <Link to="/auctions" className="btn btn-secondary">All Auctions →</Link>
          </div>
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : activeAuctions.length > 0 ? (
            <div className="grid-3">{activeAuctions.map(a => <AuctionCard key={a._id} auction={a} />)}</div>
          ) : (
            <div className="empty-state" style={{ padding: '40px' }}>
              <p style={{ fontSize: '2.5rem' }}>🔨</p>
              <h3>No live auctions right now</h3>
              <p>Check back soon — new auctions are added regularly!</p>
              <Link to="/auctions" className="btn btn-primary" style={{ marginTop: '16px' }}>Browse All Auctions</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section how-section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '8px' }}>How ArtVault Works</h2>
          <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: '48px' }}>Three simple steps to own original art</p>
          <div className="how-grid">
            {[
              {
                step: '01',
                title: 'Discover Art',
                desc: 'Browse our curated gallery of original artworks across all styles and mediums.',
                // Grand museum gallery with paintings on walls — classical arcade
                img: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=400',
                icon: '🎨',
              },
              {
                step: '02',
                title: 'Place Your Bid',
                desc: 'Join live auctions in real time. Bid competitively and track your position on the leaderboard.',
                // Elegant dark auction paddle / raised bid — fine art sale
                img: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?q=80&w=400',
                icon: '💰',
              },
              {
                step: '03',
                title: 'Own a Masterpiece',
                desc: 'Win the auction, complete your secure payment and have the artwork shipped to your door.',
                // Collector holding / receiving framed artwork — delivery
                img: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=400',
                icon: '🏆',
              },
            ].map(item => (
              <div key={item.step} className="how-card">
                <div className="how-img-wrap">
                  <img src={item.img} alt={item.title} loading="lazy" />
                  <div className="how-img-overlay" />
                  <span className="how-step-badge">{item.step}</span>
                </div>
                <div className="how-body">
                  <span className="how-icon">{item.icon}</span>
                  <h3 className="how-title">{item.title}</h3>
                  <p className="how-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTIST CTA ── */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-img-bg">
              {/* Grand royal palace gallery interior — dark dramatic Unsplash */}
              <img src="https://images.unsplash.com/photo-1551776235-dde6d7516648?q=80&w=1200" alt="" loading="lazy" />
              <div className="cta-img-overlay" />
            </div>
            <div className="cta-content">
              <span className="hero-badge" style={{ marginBottom: '20px' }}>✦ For Artists</span>
              <h2>Showcase Your Talent to the World</h2>
              <p>Join ArtVault and reach collectors worldwide. Upload your artwork, set your price, or run live auctions.</p>
              <Link to="/register" className="btn btn-primary btn-lg">Start Selling Your Art</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
