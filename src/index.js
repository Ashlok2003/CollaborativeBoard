import { server } from './app.js';
import logger from './config/logger.js';

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

