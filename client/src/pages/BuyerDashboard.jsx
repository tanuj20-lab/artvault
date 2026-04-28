import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMyOrders, getMyBids, payOrder, getOrderById } from '../services/api';
import PaymentReceiptModal from '../components/PaymentReceiptModal';
import toast from 'react-hot-toast';
import './Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const BuyerDashboard = () => {
  const { user } = useSelector(s => s.auth);
  const [orders, setOrders] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [receiptOrder, setReceiptOrder] = useState(null);

  const fetchData = async () => {
    try {
      const [ordRes, bidRes] = await Promise.all([getMyOrders(), getMyBids()]);
      setOrders(ordRes.data.data);
      setBids(bidRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load dashboard data');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handlePay = async (orderId) => {
    setPayingId(orderId);
    try {
      const res = await payOrder(orderId);
      toast.success('✅ Payment successful!');
      fetchData();
      // Show receipt immediately after payment
      setReceiptOrder(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setPayingId(null);
    }
  };

  const handleViewReceipt = async (orderId) => {
    try {
      const res = await getOrderById(orderId);
      setReceiptOrder(res.data.data);
    } catch {
      toast.error('Failed to load receipt');
    }
  };

  const pendingPayments = orders.filter(o => o.paymentStatus === 'pending');
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
  const activeBids = bids.filter(b => b.auctionId?.status === 'active');

  if (loading) return <div className="loading-spinner" style={{ marginTop: '120px' }}><div className="spinner" /></div>;

  return (
    <div className="dashboard-page">
      {receiptOrder && (
        <PaymentReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />
      )}

      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Buyer Dashboard</h1>
            <p>Welcome back, <span style={{ color: 'var(--gold)' }}>{user?.name}</span> 🛍️</p>
          </div>
          <Link to="/gallery" className="btn btn-primary">Browse Gallery →</Link>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '40px' }}>
          <div className="stat-card"><div className="stat-value">{bids.length}</div><div className="stat-label">Total Bids Placed</div></div>
          <div className="stat-card"><div className="stat-value">{activeBids.length}</div><div className="stat-label">Active Bids</div></div>
          <div className="stat-card"><div className="stat-value">{orders.length}</div><div className="stat-label">Total Orders</div></div>
          <div className="stat-card"><div className="stat-value">{paidOrders.length}</div><div className="stat-label">Completed Purchases</div></div>
        </div>

        {/* Pending Payments */}
        {pendingPayments.length > 0 && (
          <section className="dashboard-section">
            <h2 className="dashboard-section-title">💳 Pending Payments</h2>
            <div className="grid-3">
              {pendingPayments.map(o => {
                const imgSrc = o.artworkId?.imageUrl?.startsWith('http') ? o.artworkId.imageUrl : `${API_URL}${o.artworkId?.imageUrl}`;
                return (
                  <div key={o._id} className="card" style={{ border: '1px solid rgba(212, 175, 55, 0.3)', position: 'relative', overflow: 'hidden' }}>
                    {/* Urgency badge */}
                    <div style={{
                      position: 'absolute', top: '12px', right: '12px', zIndex: 1,
                      background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
                      borderRadius: '6px', padding: '3px 10px', fontSize: '0.7rem',
                      color: '#f87171', fontWeight: '700', fontFamily: 'Inter, sans-serif',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                    }}>⚠ Action Required</div>

                    <img src={imgSrc} alt={o.artworkId?.title}
                      style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}
                      onError={e => { e.target.style.display = 'none'; }} />

                    <span className="badge badge-gold" style={{ marginBottom: '8px', display: 'inline-block' }}>🏆 Auction Won!</span>
                    <h3 style={{ fontSize: '1rem', marginBottom: '6px' }}>{o.artworkId?.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '12px' }}>{o.artworkId?.category}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '12px', background: 'rgba(212,175,55,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(212,175,55,0.15)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Winning Bid</span>
                      <span style={{ color: 'var(--gold)', fontWeight: '800', fontSize: '1.2rem', fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif", letterSpacing: '-0.03em' }}>₹{o.amount?.toLocaleString('en-IN')}</span>
                    </div>

                    <button
                      onClick={() => handlePay(o._id)}
                      disabled={payingId === o._id}
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}>
                      {payingId === o._id ? '⏳ Processing...' : '💳 Complete Payment'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Active Bids */}
        {activeBids.length > 0 && (
          <section className="dashboard-section">
            <h2 className="dashboard-section-title">⚡ Active Bids</h2>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Artwork</th><th>Your Bid</th><th>Current Highest</th><th>Ends</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {activeBids.map(b => {
                    const auction = b.auctionId;
                    const isLeading = auction?.currentHighestBid === b.bidAmount;
                    return (
                      <tr key={b._id}>
                        <td><span style={{ fontWeight: '500' }}>{auction?.artworkId?.title || 'Artwork'}</span></td>
                        <td style={{ color: 'var(--gold)', fontWeight: '600' }}>₹{b.bidAmount?.toLocaleString('en-IN')}</td>
                        <td style={{ color: 'var(--text-primary)', fontWeight: '600' }}>₹{auction?.currentHighestBid?.toLocaleString('en-IN')}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(auction?.auctionEndDate).toLocaleDateString()}</td>
                        <td><span className={`badge ${isLeading ? 'badge-green' : 'badge-red'}`}>{isLeading ? '🏆 Leading' : 'Outbid'}</span></td>
                        <td><Link to={`/auction/${auction?._id}`} className="btn btn-ghost btn-sm">View Auction</Link></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Order History */}
        <section className="dashboard-section">
          <h2 className="dashboard-section-title">📦 Order History</h2>
          {orders.length === 0 ? (
            <div className="empty-state">
              <p style={{ fontSize: '3rem' }}>🛍️</p>
              <h3>No orders yet</h3>
              <p>Win an auction or purchase artwork to see your orders here.</p>
              <Link to="/auctions" className="btn btn-primary" style={{ marginTop: '16px' }}>Browse Auctions</Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Artwork</th><th>Amount</th><th>Payment</th><th>Delivery</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td><span style={{ fontWeight: '500' }}>{o.artworkId?.title}</span></td>
                      <td style={{ color: 'var(--gold)', fontWeight: '700' }}>₹{o.amount?.toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`badge ${o.paymentStatus === 'paid' ? 'badge-green' : 'badge-gold'}`}>
                          {o.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                        </span>
                      </td>
                      <td><span className={`badge ${o.deliveryStatus === 'delivered' ? 'badge-green' : 'badge-blue'}`}>{o.deliveryStatus}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      <td style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {o.paymentStatus === 'pending' && (
                          <button onClick={() => handlePay(o._id)} disabled={payingId === o._id} className="btn btn-primary btn-sm">
                            {payingId === o._id ? '⏳' : '💳 Pay'}
                          </button>
                        )}
                        {o.paymentStatus === 'paid' && (
                          <button onClick={() => handleViewReceipt(o._id)} className="btn btn-ghost btn-sm">
                            🧾 Receipt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BuyerDashboard;
