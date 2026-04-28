import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, markRead, markAllRead } from '../services/api';
import { setNotifications, markOneRead, markAllRead as markAllReadState } from '../redux/notificationSlice';
import toast from 'react-hot-toast';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector(s => s.notifications);

  useEffect(() => {
    getNotifications()
      .then(({ data }) => dispatch(setNotifications(data.data)))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load notifications'));
  }, [dispatch]);

  const handleMarkRead = async (id) => {
    try {
      await markRead(id);
      dispatch(markOneRead(id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark notification as read');
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllRead();
      dispatch(markAllReadState());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark notifications as read');
    }
  };

  const typeIcons = { bid: '💰', auction_won: '🏆', payment: '✅', general: '📢' };

  return (
    <div style={{ padding: '100px 0 80px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div className="page-header" style={{ paddingTop: 0, borderBottom: 'none', marginBottom: 0 }}>
            <h1>Notifications</h1>
            <p>{notifications.filter(n => !n.isRead).length} unread</p>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button className="btn btn-ghost btn-sm" onClick={handleMarkAll}>Mark all as read</button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: '3rem' }}>🔔</p>
            <h3>No notifications yet</h3>
            <p>You'll receive updates here when bids are placed, auctions end, and more.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {notifications.map(n => (
              <div key={n._id} className={`card notif-item ${!n.isRead ? 'notif-unread' : ''}`} onClick={() => !n.isRead && handleMarkRead(n._id)} style={{ cursor: !n.isRead ? 'pointer' : 'default' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{typeIcons[n.type] || '📢'}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: n.isRead ? 'var(--text-secondary)' : 'var(--text-primary)', lineHeight: '1.6' }}>{n.message}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>{new Date(n.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                  {!n.isRead && <span className="notif-dot" style={{ position: 'static' }} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .notif-item { padding: 16px 20px; transition: var(--transition-fast); }
        .notif-unread { border-color: rgba(212, 175, 55, 0.2); background: rgba(212, 175, 55, 0.04); }
        .notif-unread:hover { border-color: var(--border); }
        .notif-dot { width: 8px; height: 8px; background: var(--gold); border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
      `}</style>
    </div>
  );
};

export default Notifications;
