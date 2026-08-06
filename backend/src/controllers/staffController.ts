import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middlewares/auth';
import * as staffService from '../services/staffService';
import { getParamId } from '../utils/params';

export const getAll = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const staff = await staffService.getStaffUsers();
  res.json({ success: true, data: { staff } });
});

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const staff = await staffService.createStaffUser(req.body);
  res.status(201).json({ success: true, message: 'Staff user created', data: { staff } });
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const staff = await staffService.updateStaffUser(getParamId(req, 'id'), req.body);
  res.json({ success: true, message: 'Staff user updated', data: { staff } });
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  await staffService.deleteStaffUser(getParamId(req, 'id'));
  res.json({ success: true, message: 'Staff user deactivated' });
});
