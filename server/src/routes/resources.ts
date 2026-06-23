import { Router } from 'express';
import {
  getResources,
  getResourcesByDisaster,
  createResource,
  allocateResource,
  updateResourceStatus,
} from '../controllers/resourceController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';
import { validate } from '../validators/validate';
import { createResourceSchema, allocateResourceSchema, updateResourceStatusSchema } from '../validators/resource';

const router = Router();

router.get('/disasters/:id', protect, getResourcesByDisaster);

router.route('/')
  .get(protect, getResources)
  .post(protect, authorize(UserRole.ADMIN, UserRole.COORDINATOR), validate(createResourceSchema), createResource);

router.put('/:id/allocate', protect, authorize(UserRole.ADMIN, UserRole.COORDINATOR), validate(allocateResourceSchema), allocateResource);
router.put('/:id/status', protect, authorize(UserRole.ADMIN, UserRole.COORDINATOR), validate(updateResourceStatusSchema), updateResourceStatus);

export default router;
