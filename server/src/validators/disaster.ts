import { z } from 'zod';
import { DisasterStatus, DisasterSeverity } from '../types';

const pointSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.array(z.number()).length(2),
});

export const createDisasterSchema = z.object({
  name: z.string().min(1, 'Disaster name is required').max(200),
  type: z.string().min(1, 'Disaster type is required'),
  description: z.string().min(1, 'Description is required'),
  location: pointSchema,
  address: z.string().optional(),
  status: z.nativeEnum(DisasterStatus).optional(),
  severity: z.nativeEnum(DisasterSeverity).optional(),
  casualties: z.number().int().min(0).optional(),
  displaced: z.number().int().min(0).optional(),
  mediaUrls: z.array(z.string().url()).optional(),
});

export const updateDisasterSchema = createDisasterSchema.partial();
