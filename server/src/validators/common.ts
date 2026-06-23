import { z } from 'zod';

export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const locationSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.array(z.number()).length(2),
}).optional();

export const paginationSchema = z.object({
  page: z.string().optional().transform(v => v ? parseInt(v, 10) : 1).pipe(z.number().int().positive()),
  limit: z.string().optional().transform(v => v ? parseInt(v, 10) : 20).pipe(z.number().int().min(1).max(100)),
  sort: z.string().optional(),
});

export const statusQuerySchema = z.object({
  status: z.string().optional(),
});
