import { Router } from 'express';
import { getActionLogs } from '../controllers/actionlog.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);
router.get('/', getActionLogs);

export default router;
