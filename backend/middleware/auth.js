const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided. Access denied.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token. Access denied.' });
  }
};

module.exports = authMiddleware;

