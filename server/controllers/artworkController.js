const asyncHandler = require('express-async-handler');
const Artwork = require('../models/Artwork');

// @desc    Upload/Create artwork
// @route   POST /api/artworks
const createArtwork = asyncHandler(async (req, res) => {
  const { title, description, category, medium, dimensions, basePrice, tags } = req.body;
  if (!req.file) { res.status(400); throw new Error('Please upload an image'); }

  const imageUrl = `/uploads/artwork-images/${req.file.filename}`;
  const artwork = await Artwork.create({
    artistId: req.user._id, title, description, category,
    medium, dimensions, basePrice: Number(basePrice),
    imageUrl, tags: tags ? tags.split(',').map(t => t.trim()) : [],
  });
  res.status(201).json({ success: true, data: artwork });
});

// @desc    Get all artworks (with filters)
// @route   GET /api/artworks
const getArtworks = asyncHandler(async (req, res) => {
  const { category, status, artist, minPrice, maxPrice, sort, search } = req.query;
  const query = {};
  if (category) query.category = category;
  if (status) query.status = status;
  if (artist) query.artistId = artist;
  if (minPrice || maxPrice) {
    query.basePrice = {};
    if (minPrice) query.basePrice.$gte = Number(minPrice);
    if (maxPrice) query.basePrice.$lte = Number(maxPrice);
  }
  if (search) query.title = { $regex: search, $options: 'i' };

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { basePrice: 1 };
  else if (sort === 'price_desc') sortOption = { basePrice: -1 };
  else if (sort === 'oldest') sortOption = { createdAt: 1 };

  const artworks = await Artwork.find(query).sort(sortOption).populate('artistId', 'name avatar bio');
  res.json({ success: true, count: artworks.length, data: artworks });
});

// @desc    Get single artwork
// @route   GET /api/artworks/:id
const getArtworkById = asyncHandler(async (req, res) => {
  const artwork = await Artwork.findById(req.params.id).populate('artistId', 'name avatar bio');
  if (!artwork) { res.status(404); throw new Error('Artwork not found'); }
  res.json({ success: true, data: artwork });
});

// @desc    Update artwork
// @route   PUT /api/artworks/:id
const updateArtwork = asyncHandler(async (req, res) => {
  const artwork = await Artwork.findById(req.params.id);
  if (!artwork) { res.status(404); throw new Error('Artwork not found'); }
  if (artwork.artistId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized to update this artwork');
  }
  const updated = await Artwork.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, data: updated });
});

// @desc    Delete artwork
// @route   DELETE /api/artworks/:id
const deleteArtwork = asyncHandler(async (req, res) => {
  const artwork = await Artwork.findById(req.params.id);
  if (!artwork) { res.status(404); throw new Error('Artwork not found'); }
  if (artwork.artistId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized to delete this artwork');
  }
  await artwork.deleteOne();
  res.json({ success: true, message: 'Artwork removed' });
});

// @desc    Get artworks by artist
// @route   GET /api/artworks/my
const getMyArtworks = asyncHandler(async (req, res) => {
  const artworks = await Artwork.find({ artistId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: artworks.length, data: artworks });
});

module.exports = { createArtwork, getArtworks, getArtworkById, updateArtwork, deleteArtwork, getMyArtworks };
