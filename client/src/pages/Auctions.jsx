import React, { useEffect, useState } from 'react';
import { getAuctions } from '../services/api';
import AuctionCard from '../components/AuctionCard';

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [filter, setFilter] = useState('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAuctions({ status: filter })
      .then(({ data }) => active && setAuctions(data.data))
      .catch(() => active && setAuctions([]))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [filter]);

  const handleFilterChange = (status) => {
    if (status === filter) return;
    setLoading(true);
    setFilter(status);
  };

  return (
    <div style={{ padding: '100px 0 80px', minHeight: '100vh' }}>
      <div className="container">
        <div className="page-header">
          <h1>Art Auctions</h1>
          <p>Bid on unique artworks from talented artists around the world</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {['active', 'ended'].map(s => (
            <button key={s} className={`btn ${filter === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => handleFilterChange(s)}>
              {s === 'active' ? '🔴 Live Auctions' : 'Ended Auctions'}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : auctions.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: '3rem' }}>🔨</p>
            <h3>No {filter} auctions</h3>
            <p>{filter === 'active' ? 'Check back soon for new live auctions!' : 'No ended auctions to display.'}</p>
          </div>
        ) : (
          <div className="grid-3">{auctions.map(a => <AuctionCard key={a._id} auction={a} />)}</div>
        )}
      </div>
    </div>
  );
};

export default Auctions;
