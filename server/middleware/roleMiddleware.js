const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error(`Access denied. Requires role: ${roles.join(' or ')}`);
  }
  next();
};

const requireArtist = requireRole('artist');
const requireBuyer = requireRole('buyer');
const requireAdmin = requireRole('admin');
const requireArtistOrAdmin = requireRole('artist', 'admin');

module.exports = { requireRole, requireArtist, requireBuyer, requireAdmin, requireArtistOrAdmin };
