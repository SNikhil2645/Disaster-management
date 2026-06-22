import { Request, Response } from 'express';
import Resource from '../models/Resource';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';
import { ResourceStatus } from '../types';

export const getResources = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;
  const { status, type } = req.query;
  const filter: Record<string, any> = {};

  if (status) filter.status = status;
  if (type) filter.type = type;

  const [resources, total] = await Promise.all([
    Resource.find(filter)
      .populate('disaster', 'name type severity status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Resource.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: resources.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: resources,
  });
});

export const getResourcesByDisaster = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;
  const filter = { disaster: req.params.id };

  const [resources, total] = await Promise.all([
    Resource.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Resource.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: resources.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: resources,
  });
});

export const createResource = asyncHandler(async (req: Request, res: Response) => {
  const resource = await Resource.create(req.body);
  res.status(201).json({ success: true, data: resource });
});

export const allocateResource = asyncHandler(async (req: Request, res: Response) => {
  const { quantity, allocatedTo, disaster } = req.body;
  const resource = await Resource.findById(req.params.id);

  if (!resource) throw new ApiError(404, 'Resource not found');

  if (quantity > resource.quantity) {
    throw new ApiError(400, 'Allocation exceeds available quantity');
  }

  resource.quantity -= quantity;
  resource.allocatedTo = allocatedTo || resource.allocatedTo;
  if (disaster) resource.disaster = disaster;

  if (resource.quantity === 0) {
    resource.status = ResourceStatus.DEPLETED;
  } else {
    resource.status = ResourceStatus.DEPLOYED;
  }

  await resource.save();

  res.json({ success: true, data: resource });
});

export const updateResourceStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!resource) throw new ApiError(404, 'Resource not found');

  res.json({ success: true, data: resource });
});
