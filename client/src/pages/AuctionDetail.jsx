import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { getAuctionById, placeBid, getBidsByAuction } from '../services/api';
import { setAuction, updateAuctionBid } from '../redux/auctionSlice';
import { setBids, addBid } from '../redux/bidSlice';
import toast from 'react-hot-toast';
import './AuctionDetail.css';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const useCountdown = (endDate) => {
  const [t, setT] = useState({});
  useEffect(() => {
    if (!endDate) {
      return undefined;
    }

    const calc = () => {
      const diff = new Date(endDate) - new Date();
      if (diff <= 0) return setT({ expired: true });
      setT({ days: Math.floor(diff/86400000), hours: Math.floor((diff%86400000)/3600000), mins: Math.floor((diff%3600000)/60000), secs: Math.floor((diff%60000)/1000) });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDate]);
  return t;
};

const AuctionDetail = () => {
  const { id } = useParams();
  const { user } = useSelector(s => s.auth);
  const { auction } = useSelector(s => s.auctions);
  const { bids } = useSelector(s => s.bids);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const timeLeft = useCountdown(auction?.auctionEndDate);

  useEffect(() => {
    Promise.all([getAuctionById(id), getBidsByAuction(id)])
      .then(([auctRes, bidsRes]) => {
        dispatch(setAuction(auctRes.data.data));
        dispatch(setBids(bidsRes.data.data));
        const minBid = (auctRes.data.data.currentHighestBid || auctRes.data.data.startingBid) + 1;
        setBidAmount(minBid);
      }).catch(() => navigate('/auctions')).finally(() => setLoading(false));

    // Socket.io
    const socket = io(SOCKET_URL);
    socket.emit('joinAuction', id);
    socket.on('newBid', (data) => {
      dispatch(updateAuctionBid(data));
      dispatch(addBid({ auctionId: id, buyerId: { name: data.bidder }, bidAmount: data.bidAmount, createdAt: data.timestamp }));
      setBidAmount(data.bidAmount + 1);
    });
    return () => { socket.emit('leaveAuction', id); socket.disconnect(); };
  }, [id, dispatch, navigate]);

  const handleBid = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!bidAmount || Number(bidAmount) <= (auction?.currentHighestBid || 0)) {
      toast.error(`Bid must be higher than ₹${auction?.currentHighestBid?.toLocaleString('en-IN')}`);
      return;
    }
    setBidding(true);
    try {
      await placeBid({ auctionId: id, bidAmount: Number(bidAmount) });
      toast.success(`🎉 Bid of ₹${Number(bidAmount).toLocaleString('en-IN')} placed!`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to place bid'); }
    finally { setBidding(false); }
  };

  if (loading) return <div className="loading-spinner" style={{ marginTop: '120px' }}><div className="spinner" /></div>;
  if (!auction) return null;

  const { artworkId } = auction;
  const imgSrc = artworkId?.imageUrl?.startsWith('http') ? artworkId.imageUrl : `${API_URL}${artworkId?.imageUrl}`;
  const minNextBid = (auction.currentHighestBid || auction.startingBid) + 1;
  const isBuyer = user?.role === 'buyer';
  const isExpired = timeLeft.expired || auction.status !== 'active';

  return (
    <div className="auction-detail-page">
      <div className="container">
        <div className="auction-detail-grid">
          {/* Left - Image & Info */}
          <div>
            <img src={imgSrc} alt={artworkId?.title} className="auction-detail-img" onError={e => { e.target.style.display='none'; }} />
            <div className="card" style={{ marginTop: '24px' }}>
              <h3 style={{ marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>About this Artwork</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>{artworkId?.description}</p>
              {artworkId?.medium && <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.9rem' }}>Medium: {artworkId.medium}</p>}
              {artworkId?.dimensions && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Dimensions: {artworkId.dimensions}</p>}
            </div>
          </div>

          {/* Right - Bid Panel */}
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '12px' }}>{artworkId?.category}</span>
            <h1 className="auction-detail-title">{artworkId?.title}</h1>
            <p className="auction-detail-artist">by <strong>{artworkId?.artistId?.name}</strong></p>

            <div className="auction-bid-panel">
              <div className="bid-panel-row">
                <div>
                  <p className="bid-panel-label">Starting Bid</p>
                  <p className="bid-panel-val">₹{auction.startingBid?.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="bid-panel-label">Current Highest Bid</p>
                  <p className="bid-panel-val gold">₹{auction.currentHighestBid?.toLocaleString('en-IN')}</p>
                </div>
              </div>
              {auction.highestBidderId && <p className="bid-leader">🏆 Leading: {auction.highestBidderId.name}</p>}
            </div>

            {/* Countdown */}
            <div className="auction-timer-panel">
              <p className="bid-panel-label" style={{ marginBottom: '12px' }}>
                {isExpired ? 'Auction Status' : '⏰ Time Remaining'}
              </p>
              {isExpired ? (
                <div className="auction-ended-msg">🔒 Auction Ended</div>
              ) : (
                <div className="countdown">
                  {timeLeft.days > 0 && <div className="countdown-block"><div className="countdown-num">{timeLeft.days}</div><div className="countdown-lbl">days</div></div>}
                  <div className="countdown-block"><div className="countdown-num">{String(timeLeft.hours).padStart(2,'0')}</div><div className="countdown-lbl">hrs</div></div>
                  <span className="countdown-sep">:</span>
                  <div className="countdown-block"><div className="countdown-num">{String(timeLeft.mins).padStart(2,'0')}</div><div className="countdown-lbl">min</div></div>
                  <span className="countdown-sep">:</span>
                  <div className="countdown-block"><div className="countdown-num">{String(timeLeft.secs).padStart(2,'0')}</div><div className="countdown-lbl">sec</div></div>
                </div>
              )}
            </div>

            {/* Bid Form */}
            {isBuyer && !isExpired && (
              <form onSubmit={handleBid} className="bid-form">
                <div className="form-group">
                  <label className="form-label">Your Bid Amount (₹)</label>
                  <input type="number" className="form-input" value={bidAmount} onChange={e => setBidAmount(e.target.value)} min={minNextBid} placeholder={`Minimum ₹${minNextBid?.toLocaleString('en-IN')}`} required />
                  <p className="bid-hint">Minimum bid: ₹{minNextBid?.toLocaleString('en-IN')}</p>
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={bidding} style={{ width: '100%', justifyContent: 'center' }}>
                  {bidding ? '⏳ Placing Bid...' : `💰 Place Bid — ₹${Number(bidAmount || 0).toLocaleString('en-IN')}`}
                </button>
              </form>
            )}
            {!user && (
              <div className="alert alert-info">
                <a href="/login">Login as a Buyer</a> to place a bid on this artwork.
              </div>
            )}
            {user?.role === 'artist' && <div className="alert alert-info">Artists cannot place bids.</div>}

            {/* Bid History */}
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>Bid History ({bids.length})</h3>
              {bids.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>No bids yet. Be the first!</div>
              ) : (
                <div className="bid-history">
                  {bids.map((bid, i) => (
                    <div key={bid._id || i} className={`bid-history-item ${i === 0 ? 'top-bid' : ''}`}>
                      <div className="bid-history-avatar">{bid.buyerId?.name?.[0]?.toUpperCase() || '?'}</div>
                      <div className="bid-history-info">
                        <p className="bid-history-name">{bid.buyerId?.name || 'Anonymous'}</p>
                        <p className="bid-history-time">{new Date(bid.createdAt).toLocaleString('en-IN')}</p>
                      </div>
                      <div className={`bid-history-amount ${i === 0 ? 'gold' : ''}`}>₹{bid.bidAmount?.toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
