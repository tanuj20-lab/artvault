import React from 'react';
import './PaymentReceipt.css';

const PaymentReceiptModal = ({ order, onClose }) => {
  if (!order) return null;

  const {
    paymentTransactionId,
    paymentDate,
    paymentMethod,
    amount,
    artworkId,
    deliveryStatus,
    shippingAddress,
    createdAt,
  } = order;

  const formatDate = (d) =>
    new Date(d).toLocaleString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });

  const statusMap = {
    processing: { label: 'Processing', icon: '🔄', cls: 'status-processing' },
    shipped:    { label: 'Shipped',    icon: '🚚', cls: 'status-shipped'    },
    delivered:  { label: 'Delivered',  icon: '✅', cls: 'status-delivered'  },
  };
  const delivery = statusMap[deliveryStatus] || statusMap.processing;

  return (
    <div className="receipt-overlay" onClick={onClose}>
      <div className="receipt-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="receipt-header">
          <div className="receipt-logo">
            <span className="receipt-crown">♛</span>
            <span className="receipt-brand">ArtVault</span>
          </div>
          <button className="receipt-close" onClick={onClose}>✕</button>
        </div>

        {/* Success banner */}
        <div className="receipt-success-banner">
          <div className="receipt-success-icon">✓</div>
          <div>
            <p className="receipt-success-title">Payment Verified & Confirmed</p>
            <p className="receipt-success-sub">Your payment has been securely processed</p>
          </div>
        </div>

        {/* Artwork strip */}
        <div className="receipt-artwork-row">
          {artworkId?.imageUrl && (
            <img
              src={artworkId.imageUrl.startsWith('http') ? artworkId.imageUrl : `http://localhost:5000${artworkId.imageUrl}`}
              alt={artworkId.title}
              className="receipt-artwork-img"
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}
          <div className="receipt-artwork-info">
            <p className="receipt-artwork-title">{artworkId?.title}</p>
            <p className="receipt-artwork-category">{artworkId?.category}</p>
            <span className={`receipt-delivery-badge ${delivery.cls}`}>{delivery.icon} {delivery.label}</span>
          </div>
          <div className="receipt-amount-col">
            <p className="receipt-amount-label">Amount Paid</p>
            <p className="receipt-amount">₹{amount?.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Divider with dots */}
        <div className="receipt-perforation" />

        {/* Transaction Details */}
        <div className="receipt-details-grid">
          <div className="receipt-detail-item">
            <span className="receipt-detail-label">Transaction ID</span>
            <span className="receipt-detail-value txn-id">{paymentTransactionId || 'N/A'}</span>
          </div>
          <div className="receipt-detail-item">
            <span className="receipt-detail-label">Payment Method</span>
            <span className="receipt-detail-value">{paymentMethod || 'Online Transfer'}</span>
          </div>
          <div className="receipt-detail-item">
            <span className="receipt-detail-label">Payment Date</span>
            <span className="receipt-detail-value">{paymentDate ? formatDate(paymentDate) : formatDate(createdAt)}</span>
          </div>
          <div className="receipt-detail-item">
            <span className="receipt-detail-label">Order Placed</span>
            <span className="receipt-detail-value">{formatDate(createdAt)}</span>
          </div>
          {shippingAddress && (
            <div className="receipt-detail-item full-width">
              <span className="receipt-detail-label">Shipping Address</span>
              <span className="receipt-detail-value">{shippingAddress}</span>
            </div>
          )}
        </div>

        {/* Footer stamp */}
        <div className="receipt-footer">
          <div className="receipt-stamp">
            <span className="receipt-stamp-text">PAID</span>
          </div>
          <p className="receipt-footer-note">
            This is an official ArtVault payment receipt. Keep it safe for your records.
          </p>
        </div>

        <div className="receipt-actions">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}>🖨 Print Receipt</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptModal;
