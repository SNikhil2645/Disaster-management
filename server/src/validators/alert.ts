import { z } from 'zod';
import { AlertPriority, UserRole } from '../types';
import { locationSchema } from './common';

export const createAlertSchema = z.object({
  title: z.string().min(1, 'Alert title is required').max(200),
  message: z.string().min(1, 'Alert message is required'),
  priority: z.nativeEnum(AlertPriority).optional(),
  disaster: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid disaster ID').optional(),
  targetRoles: z.array(z.nativeEnum(UserRole)).optional(),
  location: locationSchema,
});
