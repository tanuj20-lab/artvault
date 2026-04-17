const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Painting', 'Sculpture', 'Photography', 'Digital Art', 'Sketch', 'Mixed Media', 'Other'],
    required: true,
  },
  medium: { type: String, default: '' },
  dimensions: { type: String, default: '' },
  basePrice: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, required: true },
  status: { type: String, enum: ['available', 'auction', 'sold'], default: 'available' },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Artwork', artworkSchema);
