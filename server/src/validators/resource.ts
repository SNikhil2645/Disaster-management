import { z } from 'zod';
import { ResourceStatus } from '../types';
import { locationSchema } from './common';

export const createResourceSchema = z.object({
  name: z.string().min(1, 'Resource name is required').max(200),
  type: z.string().min(1, 'Resource type is required'),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  unit: z.string().min(1, 'Unit is required'),
  status: z.nativeEnum(ResourceStatus).optional(),
  location: locationSchema,
  disaster: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid disaster ID').optional(),
  allocatedTo: z.string().optional(),
  notes: z.string().optional(),
});

export const allocateResourceSchema = z.object({
  quantity: z.number().int().min(1, 'Allocation quantity must be at least 1'),
  allocatedTo: z.string().optional(),
  disaster: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid disaster ID').optional(),
});

export const updateResourceStatusSchema = z.object({
  status: z.nativeEnum(ResourceStatus),
});

export const resourceQuerySchema = z.object({
  status: z.nativeEnum(ResourceStatus).optional(),
  type: z.string().optional(),
});
