import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} - ${err.stack}`);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
