import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTaskStatus,
  addTaskProgress,
} from '../controllers/taskController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';
import { validate } from '../validators/validate';
import { createTaskSchema, updateTaskStatusSchema, addTaskProgressSchema } from '../validators/task';

const router = Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, authorize(UserRole.ADMIN, UserRole.COORDINATOR), validate(createTaskSchema), createTask);

router.put('/:id/status', protect, validate(updateTaskStatusSchema), updateTaskStatus);
router.post('/:id/updates', protect, validate(addTaskProgressSchema), addTaskProgress);

export default router;
