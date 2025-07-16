import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import logger from '../config/logger.js';

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw Object.assign(new Error('All fields are required'), { status: 400 });
    }

    logger.info(`Registering new user: ${username}`);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    logger.info(`User registered successfully: ${username}`);
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.warn(`Failed login attempt for username: ${username}`);
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    logger.info(`User logged in: ${username}`);

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export { register, login };
