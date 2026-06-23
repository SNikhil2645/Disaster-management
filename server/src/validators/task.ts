import { z } from 'zod';
import { TaskStatus, AlertPriority } from '../types';
import { locationSchema, objectId } from './common';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200),
  description: z.string().min(1, 'Task description is required'),
  disaster: objectId.optional(),
  assignedTo: objectId.refine(v => !!v, 'Assignee is required'),
  priority: z.nativeEnum(AlertPriority).optional(),
  location: locationSchema,
});

export const updateTaskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus),
});

export const addTaskProgressSchema = z.object({
  message: z.string().min(1, 'Progress message is required'),
});
