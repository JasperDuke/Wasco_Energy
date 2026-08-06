import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middlewares/auth';
import * as userService from '../services/userService';
import { UserStatus } from '../types';
import { getParamId } from '../utils/params';

export const getAllUsers = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const users = await userService.getAllUsers();
  res.json({ success: true, data: { users } });
});

export const getPendingVendors = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const users = await userService.getPendingVendors();
    res.json({ success: true, data: { users } });
  }
);

export const updateUserStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { status } = req.body as { status: UserStatus };
    const user = await userService.updateUserStatus(getParamId(req, 'id'), status);
    res.json({ success: true, message: 'User status updated', data: { user } });
  }
);

export const toggleUserActive = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await userService.toggleUserActive(getParamId(req, 'id'));
    res.json({ success: true, message: 'User status toggled', data: { user } });
  }
);
