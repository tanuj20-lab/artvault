import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getArtworkById, getAuctions, deleteArtwork } from '../services/api';
import toast from 'react-hot-toast';
import './ArtworkDetails.css';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const ArtworkDetails = () => {
  const { id } = useParams();
  const { user } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArtworkById(id).then(({ data }) => {
      setArtwork(data.data);
      // Check if it has an active auction
      if (data.data.status === 'auction') {
        getAuctions({ status: 'active' }).then(({ data: auctData }) => {
          const match = auctData.data.find(a => a.artworkId?._id === id || a.artworkId === id);
          if (match) setAuction(match);
        }).catch(() => setAuction(null));
      }
    }).catch(() => navigate('/gallery')).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this artwork?')) return;
    try {
      await deleteArtwork(id);
      toast.success('Artwork deleted');
      navigate('/artist-dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  if (loading) return <div className="loading-spinner" style={{ marginTop: '120px' }}><div className="spinner" /></div>;
  if (!artwork) return null;

  const imgSrc = artwork.imageUrl?.startsWith('http') ? artwork.imageUrl : `${API_URL}${artwork.imageUrl}`;
  const isOwner = user && artwork.artistId?._id === user._id;
  const isAdmin = user?.role === 'admin';
  const isBuyer = user?.role === 'buyer';

  return (
    <div className="artwork-detail-page">
      <div className="container">
        <div className="artwork-detail-back">
          <Link to="/gallery" className="btn btn-ghost btn-sm">← Back to Gallery</Link>
        </div>
        <div className="artwork-detail-grid">
          {/* Image */}
          <div className="artwork-detail-img-wrap">
            <img src={imgSrc} alt={artwork.title} className="artwork-detail-img" onError={e => { e.target.src = ''; }} />
            <div className="artwork-detail-status">
              {artwork.status === 'available' && <span className="badge badge-green">Available for Purchase</span>}
              {artwork.status === 'auction' && <span className="badge badge-red">🔴 Live Auction</span>}
              {artwork.status === 'sold' && <span className="badge badge-gray">Sold</span>}
            </div>
          </div>

          {/* Info */}
          <div className="artwork-detail-info">
            <span className="badge badge-gold" style={{ marginBottom: '12px' }}>{artwork.category}</span>
            <h1 className="artwork-detail-title">{artwork.title}</h1>
            <div className="artwork-detail-artist">
              <div className="artist-avatar">{artwork.artistId?.name?.[0]?.toUpperCase()}</div>
              <div>
                <p className="artist-name">{artwork.artistId?.name}</p>
                {artwork.artistId?.bio && <p className="artist-bio-short">{artwork.artistId.bio}</p>}
              </div>
            </div>

            <div className="gold-line" style={{ margin: '20px 0' }} />

            <p className="artwork-detail-desc">{artwork.description}</p>

            <div className="artwork-detail-specs">
              {artwork.medium && <div className="spec-item"><span className="spec-label">Medium</span><span className="spec-value">{artwork.medium}</span></div>}
              {artwork.dimensions && <div className="spec-item"><span className="spec-label">Dimensions</span><span className="spec-value">{artwork.dimensions}</span></div>}
              <div className="spec-item"><span className="spec-label">Category</span><span className="spec-value">{artwork.category}</span></div>
              <div className="spec-item">
                <span className="spec-label">{artwork.status === 'auction' ? 'Starting Price' : 'Price'}</span>
                <span className="spec-value price">₹{artwork.basePrice?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Auction info */}
            {auction && (
              <div className="artwork-auction-info">
                <h3>🏆 Current Highest Bid</h3>
                <div className="auction-current-bid">₹{auction.currentHighestBid?.toLocaleString('en-IN')}</div>
                {auction.highestBidderId && <p className="bid-by">by {auction.highestBidderId.name}</p>}
                <p className="auction-end-date">Ends: {new Date(auction.auctionEndDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
              </div>
            )}

            {/* Actions */}
            <div className="artwork-detail-actions">
              {isBuyer && artwork.status === 'auction' && auction && (
                <Link to={`/auction/${auction._id}`} className="btn btn-primary btn-lg" style={{ flex: 1 }}>💰 Place Bid</Link>
              )}
              {isBuyer && artwork.status === 'available' && (
                <div className="alert alert-info">Contact the artist to purchase this artwork directly.</div>
              )}
              {(isOwner || isAdmin) && (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {isOwner && artwork.status === 'available' && (
                    <Link to={`/upload-artwork?edit=${artwork._id}`} className="btn btn-secondary">✏️ Edit</Link>
                  )}
                  {isOwner && artwork.status === 'available' && (
                    <Link to="/artist-dashboard" className="btn btn-ghost">+ Create Auction</Link>
                  )}
                  <button onClick={handleDelete} className="btn btn-danger">🗑️ Delete</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetails;
