import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middlewares/auth';
import * as settingsService from '../services/settingsService';

export const getSettings = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const settings = await settingsService.getSettings();
  res.json({ success: true, data: { settings } });
});

export const updateSettings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const settings = await settingsService.upsertSettings(req.body);
  res.json({ success: true, message: 'Settings updated', data: { settings } });
});
