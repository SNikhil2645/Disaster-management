import { Request, Response } from 'express';
import Alert from '../models/Alert';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';
import { broadcastAlert } from '../services/notificationService';

export const getAlerts = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;

  const [alerts, total] = await Promise.all([
    Alert.find()
      .populate('createdBy', 'name')
      .populate('disaster', 'name type severity')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Alert.countDocuments(),
  ]);

  res.json({
    success: true,
    count: alerts.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: alerts,
  });
});

export const getAlert = asyncHandler(async (req: Request, res: Response) => {
  const alert = await Alert.findById(req.params.id)
    .populate('createdBy', 'name')
    .populate('disaster', 'name type severity');

  if (!alert) throw new ApiError(404, 'Alert not found');

  res.json({ success: true, data: alert });
});

export const createAlert = asyncHandler(async (req: Request, res: Response) => {
  req.body.createdBy = (req as any).user.id;
  const alert = await Alert.create(req.body);

  await broadcastAlert(alert);

  const populatedAlert = await Alert.findById(alert._id)
    .populate('createdBy', 'name')
    .populate('disaster', 'name type severity');

  res.status(201).json({ success: true, data: populatedAlert });
});

export const markAlertRead = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const alert = await Alert.findById(req.params.id);

  if (!alert) throw new ApiError(404, 'Alert not found');

  const alreadyRead = alert.readBy.some(
    (r) => r.user.toString() === userId
  );

  if (!alreadyRead) {
    alert.readBy.push({ user: userId, readAt: new Date() } as any);
    await alert.save();
  }

  res.json({ success: true, data: alert });
});
