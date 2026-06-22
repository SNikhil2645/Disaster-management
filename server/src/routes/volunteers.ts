import { Router } from 'express';
import { registerVolunteer, getVolunteerTasks } from '../controllers/volunteerController';
import { protect } from '../middleware/auth';
import { validate } from '../validators/validate';
import { registerVolunteerSchema } from '../validators/volunteer';

const router = Router();

router.post('/register', protect, validate(registerVolunteerSchema), registerVolunteer);
router.get('/:id/tasks', protect, getVolunteerTasks);

export default router;
