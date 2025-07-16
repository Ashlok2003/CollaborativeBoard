import { Router } from 'express';
import { createTask, deleteTask, getTasks, updateTask } from '../controllers/task.controller.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);
router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
