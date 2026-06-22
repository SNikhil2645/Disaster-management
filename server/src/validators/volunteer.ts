import { z } from 'zod';

const pointSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.array(z.number()).length(2),
});

export const registerVolunteerSchema = z.object({
  skills: z.array(z.string()).optional(),
  phone: z.string().optional(),
  location: pointSchema.optional(),
});
