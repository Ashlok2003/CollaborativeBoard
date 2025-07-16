import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    logger.warn('No token provided in request');
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    logger.info(`Authenticated user: ${decoded.username}`);
    next();
  } catch (error) {
    logger.error(`Invalid token: ${error.message}`);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default auth;
