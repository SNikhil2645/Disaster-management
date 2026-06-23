import { Router } from 'express';
import {
  getShelters,
  getNearbyShelters,
  createShelter,
  updateShelterCapacity,
} from '../controllers/shelterController';
import { protect, authorize } from '../middleware/auth';
import { UserRole } from '../types';
import { validate } from '../validators/validate';
import { createShelterSchema, updateCapacitySchema, nearbyQuerySchema } from '../validators/shelter';

const router = Router();

router.get('/nearby', validate(nearbyQuerySchema, 'query'), getNearbyShelters);

router.route('/')
  .get(getShelters)
  .post(protect, authorize(UserRole.ADMIN), validate(createShelterSchema), createShelter);

router.put('/:id/capacity', protect, authorize(UserRole.ADMIN, UserRole.COORDINATOR), validate(updateCapacitySchema), updateShelterCapacity);

export default router;
