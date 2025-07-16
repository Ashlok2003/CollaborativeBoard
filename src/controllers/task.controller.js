import logger from '../config/logger.js';
import ActionLog from '../models/actionlog.js';
import Task from '../models/task.js';
import User from '../models/user.js';

const createTask = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    if (['Todo', 'In Progress', 'Done'].includes(title)) {
      logger.warn(`Invalid task title attempted: ${title} `);
      throw Object.assign(new Error('Title cannot match column names'), { status: 400 });
    }

    const task = new Task({ title, description, priority, assignedTo: null });
    await task.save();

    logger.info(`Task created: ${title} by user ${req.user.username} `);
    await logAction(task._id, req.user.id, 'created', { title }, req.io);

    req.io.emit('taskCreated', task);

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'username');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, assignedTo, priority, version, smartAssign } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      logger.warn(`Task not found: ${id} `);
      throw Object.assign(new Error('Task not found'), { status: 404 });
    }

    if (version !== task.version) {
      logger.warn(`Conflict detected for task: ${id} `);
      return res.status(409).json({ error: 'Conflict detected', currentTask: task });
    }

    let assignedUser = assignedTo;

    if (smartAssign) {
      const users = await User.find();
      const userTaskCounts = await Promise.all(
        users.map(async (user) => ({
          user,
          count: await Task.countDocuments({ assignedTo: user._id, status: { $ne: 'Done' } }),
        }))
      );
      assignedUser = userTaskCounts.sort((a, b) => a.count - b.count)[0].user._id;
      logger.info(`Smart Assign: Task ${id} assigned to user ${assignedUser} `);
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.assignedTo = assignedUser || task.assignedTo;
    task.priority = priority || task.priority;
    task.version += 1;
    task.updatedAt = Date.now();

    await task.save();

    await logAction(task._id, req.user.id, 'updated', { changes: req.body }, req.io);

    logger.info(`Task updated: ${id} by user ${req.user.username} `);

    req.io.emit('taskUpdated', task);

    res.json(task);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      logger.warn(`Task not found for deletion: ${id} `);
      throw Object.assign(new Error('Task not found'), { status: 404 });
    }

    await logAction(id, req.user.id, 'deleted', { title: task.title }, req.io);
    logger.info(`Task deleted: ${id} by user ${req.user.username} `);
    req.io.emit('taskDeleted', id);

    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

const logAction = async (taskId, userId, action, details, io) => {
  const log = new ActionLog({ taskId, userId, action, details });
  await log.save();
  io.emit('actionLogged', log);
};

export { createTask, deleteTask, getTasks, updateTask };

