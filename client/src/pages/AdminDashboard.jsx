import React, { useEffect, useState } from 'react';
import { getAdminStats, getAdminUsers, toggleUserStatus, deleteUser, getAdminArtworks, getAuctions } from '../services/api';
import toast from 'react-hot-toast';
import './Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, artRes, auctRes] = await Promise.all([
        getAdminStats(), getAdminUsers(), getAdminArtworks(), getAuctions({ status: '' }),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setArtworks(artRes.data.data);
      setAuctions(auctRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load dashboard data');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleToggle = async (id) => {
    try {
      await toggleUserStatus(id);
      toast.success('User status updated');
      setUsers(users.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      setUsers(users.filter(u => u._id !== id));
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="loading-spinner" style={{ marginTop: '120px' }}><div className="spinner" /></div>;

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Platform management & oversight</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {['overview', 'users', 'artworks', 'auctions'].map(tab => (
            <button key={tab} className={`admin-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && stats && (
          <div>
            <div className="grid-4" style={{ marginBottom: '32px' }}>
              <div className="stat-card"><div className="stat-value">{stats.totalUsers}</div><div className="stat-label">Total Users</div></div>
              <div className="stat-card"><div className="stat-value">{stats.totalArtworks}</div><div className="stat-label">Total Artworks</div></div>
              <div className="stat-card"><div className="stat-value">{stats.activeAuctions}</div><div className="stat-label">Active Auctions</div></div>
              <div className="stat-card"><div className="stat-value">₹{stats.totalRevenue?.toLocaleString('en-IN')}</div><div className="stat-label">Total Revenue</div></div>
            </div>
            <div className="grid-4">
              <div className="stat-card"><div className="stat-value">{stats.artists}</div><div className="stat-label">Artists</div></div>
              <div className="stat-card"><div className="stat-value">{stats.buyers}</div><div className="stat-label">Buyers</div></div>
              <div className="stat-card"><div className="stat-value">{stats.totalBids}</div><div className="stat-label">Total Bids</div></div>
              <div className="stat-card"><div className="stat-value">{stats.totalOrders}</div><div className="stat-label">Total Orders</div></div>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: '500' }}>{u.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td><span className={`badge ${u.role === 'artist' ? 'badge-gold' : u.role === 'admin' ? 'badge-red' : 'badge-blue'}`}>{u.role}</span></td>
                    <td><span className={`badge ${u.isActive ? 'badge-green' : 'badge-gray'}`}>{u.isActive ? 'Active' : 'Suspended'}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleToggle(u._id)} className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-ghost'}`}>
                          {u.isActive ? 'Suspend' : 'Activate'}
                        </button>
                        <button onClick={() => handleDelete(u._id)} className="btn btn-sm btn-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Artworks */}
        {activeTab === 'artworks' && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Title</th><th>Artist</th><th>Category</th><th>Price</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {artworks.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: '500' }}>{a.title}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{a.artistId?.name}</td>
                    <td><span className="badge badge-gold">{a.category}</span></td>
                    <td style={{ color: 'var(--gold)', fontWeight: '600' }}>₹{a.basePrice?.toLocaleString('en-IN')}</td>
                    <td><span className={`badge ${a.status === 'available' ? 'badge-green' : a.status === 'auction' ? 'badge-red' : 'badge-gray'}`}>{a.status}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Auctions */}
        {activeTab === 'auctions' && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Artwork</th><th>Starting Bid</th><th>Current Bid</th><th>Status</th><th>End Date</th></tr></thead>
              <tbody>
                {auctions.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: '500' }}>{a.artworkId?.title || 'N/A'}</td>
                    <td>₹{a.startingBid?.toLocaleString('en-IN')}</td>
                    <td style={{ color: 'var(--gold)', fontWeight: '700' }}>₹{a.currentHighestBid?.toLocaleString('en-IN')}</td>
                    <td><span className={`badge ${a.status === 'active' ? 'badge-red' : 'badge-gray'}`}>{a.status}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(a.auctionEndDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .admin-tabs { display: flex; gap: 4px; margin-bottom: 28px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0; }
        .admin-tab { padding: 10px 20px; background: none; border: none; color: var(--text-secondary); font-size: 0.95rem; font-weight: 500; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: var(--transition-fast); }
        .admin-tab:hover { color: var(--text-primary); }
        .admin-tab.active { color: var(--gold); border-bottom-color: var(--gold); }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
