const express = require('express');
const router = express.Router();
const { createArtwork, getArtworks, getArtworkById, updateArtwork, deleteArtwork, getMyArtworks } = require('../controllers/artworkController');
const { protect } = require('../middleware/authMiddleware');
const { requireArtist, requireArtistOrAdmin } = require('../middleware/roleMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', getArtworks);
router.get('/my', protect, requireArtist, getMyArtworks);
router.get('/:id', getArtworkById);
router.post('/', protect, requireArtist, upload.single('image'), createArtwork);
router.put('/:id', protect, requireArtistOrAdmin, updateArtwork);
router.delete('/:id', protect, requireArtistOrAdmin, deleteArtwork);

module.exports = router;
