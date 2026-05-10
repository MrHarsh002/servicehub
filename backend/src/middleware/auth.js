const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  req.userId = decoded.id;
  req.userRole = decoded.role;
  next();
};

const customerMiddleware = (req, res, next) => {
  if (req.userRole !== 'customer') {
    return res.status(403).json({ message: 'Only customers can access this' });
  }
  next();
};

const vendorMiddleware = (req, res, next) => {
  if (req.userRole !== 'vendor') {
    return res.status(403).json({ message: 'Only vendors can access this' });
  }
  next();
};

module.exports = { authMiddleware, customerMiddleware, vendorMiddleware };
