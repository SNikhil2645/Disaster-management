import { z } from 'zod';

const shelterTypes = ['shelter', 'hospital', 'distribution_center'] as const;

const pointSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.array(z.number()).length(2),
});

export const createShelterSchema = z.object({
  name: z.string().min(1, 'Shelter name is required').max(200),
  address: z.string().min(1, 'Address is required'),
  location: pointSchema,
  type: z.enum(shelterTypes),
  capacity: z.number().int().min(0, 'Capacity must be non-negative'),
  currentOccupancy: z.number().int().min(0).optional(),
  amenities: z.array(z.string()).optional(),
  contactPhone: z.string().optional(),
});

export const updateCapacitySchema = z.object({
  currentOccupancy: z.number().int().min(0, 'Occupancy must be non-negative'),
});

export const nearbyQuerySchema = z.object({
  lat: z.string().refine(v => !isNaN(parseFloat(v)), 'Latitude must be a number'),
  lng: z.string().refine(v => !isNaN(parseFloat(v)), 'Longitude must be a number'),
  radius: z.string().optional(),
  type: z.enum(shelterTypes).optional(),
});
