const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artworkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork', required: true },
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', default: null },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  deliveryStatus: { type: String, enum: ['processing', 'shipped', 'delivered'], default: 'processing' },
  shippingAddress: { type: String, default: '' },
  paymentTransactionId: { type: String, default: null },
  paymentDate: { type: Date, default: null },
  paymentMethod: { type: String, default: 'Online Payment' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

