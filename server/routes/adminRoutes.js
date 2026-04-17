const express = require('express');
const router = express.Router();
const { getAllUsers, toggleUserStatus, deleteUser, getStats, getAllArtworks } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.use(protect, requireAdmin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/artworks', getAllArtworks);

module.exports = router;
