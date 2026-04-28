import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMyArtworks, getMyAuctions, endAuction, createAuction } from '../services/api';
import toast from 'react-hot-toast';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const ArtistDashboard = () => {
  const { user } = useSelector(s => s.auth);
  const [artworks, setArtworks] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auctionForm, setAuctionForm] = useState({ artworkId: '', startingBid: '', auctionEndDate: '' });
  const [showAuctionModal, setShowAuctionModal] = useState(false);

  const fetchData = async () => {
    try {
      const [artRes, auctRes] = await Promise.all([getMyArtworks(), getMyAuctions()]);
      setArtworks(artRes.data.data);
      setAuctions(auctRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load dashboard data');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    try {
      await createAuction(auctionForm);
      toast.success('🎉 Auction created!');
      setShowAuctionModal(false);
      setAuctionForm({ artworkId: '', startingBid: '', auctionEndDate: '' });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create auction'); }
  };

  const handleEndAuction = async (auctionId) => {
    if (!window.confirm('End this auction now?')) return;
    try {
      await endAuction(auctionId);
      toast.success('Auction ended!');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const availableArtworks = artworks.filter(a => a.status === 'available');
  const activeAuctions = auctions.filter(a => a.status === 'active');
  const soldArtworks = artworks.filter(a => a.status === 'sold');

  if (loading) return <div className="loading-spinner" style={{ marginTop: '120px' }}><div className="spinner" /></div>;

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Artist Dashboard</h1>
            <p>Welcome back, <span style={{ color: 'var(--gold)' }}>{user?.name}</span> 🎨</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" onClick={() => setShowAuctionModal(true)}>⚡ Create Auction</button>
            <Link to="/upload-artwork" className="btn btn-primary">+ Upload Artwork</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '40px' }}>
          <div className="stat-card"><div className="stat-value">{artworks.length}</div><div className="stat-label">Total Artworks</div></div>
          <div className="stat-card"><div className="stat-value">{activeAuctions.length}</div><div className="stat-label">Active Auctions</div></div>
          <div className="stat-card"><div className="stat-value">{soldArtworks.length}</div><div className="stat-label">Artworks Sold</div></div>
          <div className="stat-card"><div className="stat-value">{availableArtworks.length}</div><div className="stat-label">Available for Sale</div></div>
        </div>

        {/* Active Auctions */}
        {activeAuctions.length > 0 && (
          <section className="dashboard-section">
            <h2 className="dashboard-section-title">🔴 Active Auctions</h2>
            <div className="grid-3">
              {activeAuctions.map(a => (
                <div key={a._id} className="card auction-manage-card">
                  {a.artworkId?.imageUrl && (
                    <img src={a.artworkId.imageUrl.startsWith('http') ? a.artworkId.imageUrl : `${API_URL}${a.artworkId.imageUrl}`} alt={a.artworkId?.title} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '12px' }} />
                  )}
                  <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{a.artworkId?.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Highest Bid</span>
                    <span style={{ color: 'var(--gold)', fontWeight: '700' }}>₹{a.currentHighestBid?.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Ends</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{new Date(a.auctionEndDate).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/auction/${a._id}`} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>View</Link>
                    <button onClick={() => handleEndAuction(a._id)} className="btn btn-danger btn-sm">End</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* My Artworks */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">🖼️ My Artworks</h2>
          {artworks.length === 0 ? (
            <div className="empty-state">
              <p style={{ fontSize: '3rem' }}>🎨</p>
              <h3>No artworks yet</h3>
              <p>Upload your first artwork to get started!</p>
              <Link to="/upload-artwork" className="btn btn-primary" style={{ marginTop: '16px' }}>+ Upload Artwork</Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Artwork</th><th>Category</th><th>Price</th><th>Status</th><th>Uploaded</th><th>Actions</th></tr></thead>
                <tbody>
                  {artworks.map(a => {
                    const imgSrc = a.imageUrl?.startsWith('http') ? a.imageUrl : `${API_URL}${a.imageUrl}`;
                    return (
                      <tr key={a._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={imgSrc} alt={a.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} onError={e => { e.target.style.display='none'; }} />
                            <span style={{ fontWeight: '500' }}>{a.title}</span>
                          </div>
                        </td>
                        <td><span className="badge badge-gold">{a.category}</span></td>
                        <td style={{ color: 'var(--gold)', fontWeight: '600' }}>₹{a.basePrice?.toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`badge ${a.status === 'available' ? 'badge-green' : a.status === 'auction' ? 'badge-red' : 'badge-gray'}`}>{a.status}</span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Link to={`/artwork/${a._id}`} className="btn btn-ghost btn-sm">View</Link>
                            {a.status === 'available' && <button className="btn btn-ghost btn-sm" onClick={() => { setAuctionForm(f => ({...f, artworkId: a._id, startingBid: a.basePrice})); setShowAuctionModal(true); }}>Auction</button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Auction Modal */}
      {showAuctionModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAuctionModal(false)}>
          <div className="modal-box">
            <h2 style={{ marginBottom: '24px' }}>Create Auction</h2>
            <form onSubmit={handleCreateAuction}>
              <div className="form-group">
                <label className="form-label">Select Artwork *</label>
                <select className="form-input" value={auctionForm.artworkId} onChange={e => setAuctionForm(f => ({...f, artworkId: e.target.value}))} required>
                  <option value="">Choose artwork...</option>
                  {availableArtworks.map(a => <option key={a._id} value={a._id}>{a.title}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Starting Bid (₹) *</label>
                <input type="number" className="form-input" value={auctionForm.startingBid} onChange={e => setAuctionForm(f => ({...f, startingBid: e.target.value}))} min="1" required />
              </div>
              <div className="form-group">
                <label className="form-label">Auction End Date *</label>
                <input type="datetime-local" className="form-input" value={auctionForm.auctionEndDate} onChange={e => setAuctionForm(f => ({...f, auctionEndDate: e.target.value}))} min={new Date().toISOString().slice(0,16)} required />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>⚡ Create Auction</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAuctionModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistDashboard;
