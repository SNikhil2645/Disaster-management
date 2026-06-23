import { Request, Response } from 'express';
import User from '../models/User';
import Task from '../models/Task';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';
import { UserRole } from '../types';

export const registerVolunteer = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { skills, phone, location } = req.body;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  if (skills) user.skills = skills;
  if (phone) user.phone = phone;
  if (location) user.location = location;

  user.role = UserRole.VOLUNTEER;
  await user.save();

  res.json({ success: true, data: user });
});

export const getVolunteerTasks = asyncHandler(async (req: Request, res: Response) => {
  const volunteerId = req.params.id;
  const { status } = req.query;
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = { assignedTo: volunteerId };
  if (status) filter.status = status;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate('disaster', 'name type severity')
      .populate('assignedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: tasks.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: tasks,
  });
});
