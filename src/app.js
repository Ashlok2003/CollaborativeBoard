import 'dotenv/config.js';
import cors from 'cors';
import express from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import logger from './config/logger.js';
import actionLogRoutes from './routes/actionlog.routes.js';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import errorHandler from './middleware/error-handler.js';
import connectDB from './config/database.js';

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const onlineUsers = new Map();
const userActivities = new Map();

io.on('connection', (socket) => {
  const token = socket.handshake.query.token;

  if (!token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      onlineUsers.set(socket.id, { userId: decoded.id, username: decoded.username });
      io.emit('onlineUsers', Array.from(onlineUsers.values()));
      logger.info(`User connected: ${decoded.username}`);
    } catch (error) {
      logger.warn(`Invalid token on socket connection: ${error.message}`);
    }
  }

  socket.on('startActivity', ({ taskId, action }) => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      userActivities.set(user.userId, { taskId, action });
      io.emit('userActivity', { userId: user.userId, username: user.username, taskId, action });
      logger.info(`${user.username} started ${action} on task ${taskId}`);
    }
  });

  socket.on('endActivity', ({ taskId }) => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      userActivities.delete(user.userId);
      io.emit('userActivity', { userId: user.userId, username: user.username, taskId, action: null });
      logger.info(`${user.username} ended activity on task ${taskId}`);
    }
  });

  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      onlineUsers.delete(socket.id);
      userActivities.delete(user.userId);
      io.emit('onlineUsers', Array.from(onlineUsers.values()));
      io.emit('userActivity', { userId: user.userId, username: user.username, taskId: null, action: null });
      logger.info(`User disconnected: ${user.username}`);
    }
  });
})

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/actions', actionLogRoutes);

app.use(errorHandler);

export { app, server, io };
