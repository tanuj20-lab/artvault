import React from 'react';
import { Link } from 'react-router-dom';
import './ArtworkCard.css';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const categoryColors = {
  Painting: '#d4af37', Sculpture: '#60a5fa', Photography: '#a78bfa',
  'Digital Art': '#34d399', Sketch: '#fb923c', 'Mixed Media': '#f472b6', Other: '#94a3b8',
};

const ArtworkCard = ({ artwork }) => {
  if (!artwork) return null;

  const imgSrc = artwork.imageUrl?.startsWith('http')
    ? artwork.imageUrl
    : `${API_URL}${artwork.imageUrl || ''}`;

  return (
    <Link to={`/artwork/${artwork._id}`} className="artwork-card">
      <div className="artwork-img-wrap">
        <img src={imgSrc} alt={artwork.title} className="artwork-img" onError={e => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzE2MTYxZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzZlNjY1OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfjqg8L3RleHQ+PC9zdmc+'; }} />
        <div className="artwork-overlay">
          <span className="artwork-view-btn">View Details →</span>
        </div>
        <span
          className="artwork-category-badge"
          style={{ borderColor: categoryColors[artwork.category] || '#d4af37', color: categoryColors[artwork.category] || '#d4af37' }}
        >
          {artwork.category}
        </span>
        {artwork.status === 'auction' && <span className="artwork-live-badge">🔴 LIVE AUCTION</span>}
        {artwork.status === 'sold' && <span className="artwork-sold-badge">SOLD</span>}
      </div>
      <div className="artwork-info">
        <h3 className="artwork-title">{artwork.title}</h3>
        <p className="artwork-artist">by {artwork.artistId?.name || 'Unknown Artist'}</p>
        {artwork.medium && <p className="artwork-medium">{artwork.medium}</p>}
        <div className="artwork-footer">
          <span className="artwork-price">₹{artwork.basePrice?.toLocaleString('en-IN')}</span>
          {artwork.dimensions && <span className="artwork-dims">{artwork.dimensions}</span>}
        </div>
      </div>
    </Link>
  );
};

export default ArtworkCard;
