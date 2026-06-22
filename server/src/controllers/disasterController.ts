import { Request, Response } from 'express';
import Disaster from '../models/Disaster';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';

export const getDisasters = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;
  const { status, severity } = req.query;
  const filter: Record<string, any> = {};
  if (status) filter.status = status;
  if (severity) filter.severity = severity;

  const [disasters, total] = await Promise.all([
    Disaster.find(filter)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Disaster.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: disasters.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: disasters,
  });
});

export const getDisaster = asyncHandler(async (req: Request, res: Response) => {
  const disaster = await Disaster.findById(req.params.id)
    .populate('reportedBy', 'name email');

  if (!disaster) throw new ApiError(404, 'Disaster not found');

  res.json({ success: true, data: disaster });
});

export const createDisaster = asyncHandler(async (req: Request, res: Response) => {
  req.body.reportedBy = (req as any).user.id;
  const disaster = await Disaster.create(req.body);

  res.status(201).json({ success: true, data: disaster });
});

export const updateDisaster = asyncHandler(async (req: Request, res: Response) => {
  let disaster = await Disaster.findById(req.params.id);
  if (!disaster) throw new ApiError(404, 'Disaster not found');

  disaster = await Disaster.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: disaster });
});

export const deleteDisaster = asyncHandler(async (req: Request, res: Response) => {
  const disaster = await Disaster.findById(req.params.id);
  if (!disaster) throw new ApiError(404, 'Disaster not found');

  await disaster.deleteOne();
  res.json({ success: true, message: 'Disaster removed' });
});
