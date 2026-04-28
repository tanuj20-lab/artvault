import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const useCountdown = (endDate) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    if (!endDate) {
      return undefined;
    }

    const calc = () => {
      const diff = new Date(endDate) - new Date();
      if (diff <= 0) return setTimeLeft({ expired: true });
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  return timeLeft;
};

const AuctionCard = ({ auction }) => {
  const timeLeft = useCountdown(auction?.auctionEndDate);

  if (!auction) return null;
  const { artworkId, startingBid, currentHighestBid, status } = auction;
  const imgSrc = artworkId?.imageUrl?.startsWith('http')
    ? artworkId.imageUrl
    : `${API_URL}${artworkId?.imageUrl || ''}`;

  return (
    <div className="auction-card">
      <Link to={`/auction/${auction._id}`} className="auction-img-wrap">
        <img src={imgSrc} alt={artworkId?.title} className="auction-img" onError={e => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzE2MTYxZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzZlNjY1OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfjqg8L3RleHQ+PC9zdmc+'; }} />
        <div className="auction-status-badge" data-status={status}>
          {status === 'active' ? '🔴 LIVE' : status.toUpperCase()}
        </div>
      </Link>

      <div className="auction-body">
        <Link to={`/auction/${auction._id}`} style={{ textDecoration: 'none' }}>
          <h3 className="auction-title">{artworkId?.title}</h3>
        </Link>
        <p className="auction-artist">by {artworkId?.artistId?.name}</p>

        <div className="auction-bids">
          <div className="auction-bid-item">
            <span className="auction-bid-label">Starting Bid</span>
            <span className="auction-bid-value">₹{startingBid?.toLocaleString('en-IN')}</span>
          </div>
          <div className="auction-bid-item highlight">
            <span className="auction-bid-label">Current Bid</span>
            <span className="auction-bid-value gold">₹{currentHighestBid?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {status === 'active' && (
          <div className="auction-timer">
            {timeLeft.expired ? (
              <span className="timer-expired">AUCTION ENDED</span>
            ) : (
              <div className="countdown">
                {timeLeft.days > 0 && (
                  <div className="countdown-block"><div className="countdown-num">{timeLeft.days}</div><div className="countdown-lbl">days</div></div>
                )}
                <div className="countdown-block"><div className="countdown-num">{String(timeLeft.hours).padStart(2,'0')}</div><div className="countdown-lbl">hrs</div></div>
                <span className="countdown-sep">:</span>
                <div className="countdown-block"><div className="countdown-num">{String(timeLeft.mins).padStart(2,'0')}</div><div className="countdown-lbl">min</div></div>
                <span className="countdown-sep">:</span>
                <div className="countdown-block"><div className="countdown-num">{String(timeLeft.secs).padStart(2,'0')}</div><div className="countdown-lbl">sec</div></div>
              </div>
            )}
          </div>
        )}

        <Link to={`/auction/${auction._id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
          {status === 'active' ? '💰 Place Bid' : 'View Auction'}
        </Link>
      </div>

      <style>{`
        .auction-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; transition: var(--transition); }
        .auction-card:hover { border-color: var(--border); transform: translateY(-5px); box-shadow: var(--shadow-lift); }
        .auction-img-wrap { display: block; position: relative; aspect-ratio: 4/3; overflow: hidden; background: var(--bg-secondary); }
        .auction-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
        .auction-card:hover .auction-img { transform: scale(1.04); }
        .auction-status-badge { position: absolute; top: 12px; left: 12px; background: rgba(248,113,113,0.2); color: var(--error); border: 1px solid rgba(248,113,113,0.4); padding: 4px 10px; border-radius: 100px; font-size: 0.72rem; font-weight: 700; animation: pulse-gold 1.5s infinite; }
        .auction-status-badge[data-status="ended"] { background: rgba(110,102,89,0.3); color: var(--text-muted); border-color: var(--border-subtle); animation: none; }
        .auction-body { padding: 18px; }
        .auction-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: var(--text-primary); margin-bottom: 4px; }
        .auction-artist { color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 14px; }
        .auction-bids { display: flex; gap: 16px; margin-bottom: 14px; }
        .auction-bid-item { flex: 1; padding: 10px 12px; background: var(--bg-secondary); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); }
        .auction-bid-item.highlight { border-color: var(--border); }
        .auction-bid-label { display: block; font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .auction-bid-value { font-weight: 700; font-size: 1rem; color: var(--text-primary); }
        .auction-bid-value.gold { color: var(--gold); }
        .auction-timer { padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); justify-content: center; display: flex; }
        .timer-expired { color: var(--text-muted); font-size: 0.85rem; font-weight: 600; letter-spacing: 0.08em; }
      `}</style>
    </div>
  );
};

export default AuctionCard;
