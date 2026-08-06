import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest, TOKEN_COOKIE_NAME } from '../middlewares/auth';
import * as authService from '../services/authService';

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.registerVendor(req.body);
  res.status(201).json({ success: true, message: result.message });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await authService.login(req.body);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: result.user,
      token: result.token,
    },
  });
});

export const logout = asyncHandler(async (_req: AuthRequest, res: Response) => {
  res.clearCookie(TOKEN_COOKIE_NAME, { path: '/' });
  res.json({ success: true, message: 'Logged out successfully' });
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.userId);
  res.json({ success: true, data: { user } });
});
