import ActionLog from '../models/actionlog.js';
import logger from '../config/logger.js';

const getActionLogs = async (req, res, next) => {
  try {
    const logs = await ActionLog.find()
      .sort({ timestamp: -1 })
      .limit(20)
      .populate('userId', 'username')
      .populate('taskId', 'title');
    res.json(logs);
  } catch (error) {
    logger.error(`Error fetching action logs: ${error.message}`);
    next(error);
  }
};

export { getActionLogs };
