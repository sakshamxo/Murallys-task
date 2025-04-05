// travel-booking-app/backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

// Middleware to protect routes (authenticate user)
export const protect = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token; // ✅ Correct way to extract from cookies
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (excluding password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to restrict access based on roles
export const roleBasedAccess = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};





export default { protect, roleBasedAccess };