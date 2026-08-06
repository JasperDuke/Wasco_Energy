import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middlewares/auth';
import * as vendorService from '../services/vendorService';
import { getParamId } from '../utils/params';

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const profile = await vendorService.getVendorProfile(req.user!.userId);
  res.json({ success: true, data: { profile } });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const profile = await vendorService.updateVendorProfile(req.user!.userId, req.body);
  res.json({ success: true, message: 'Profile updated', data: { profile } });
});

export const getAllVendors = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const vendors = await vendorService.getAllVendors();
  res.json({ success: true, data: { vendors } });
});

export const approveVendor = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vendor = await vendorService.approveVendor(getParamId(req, 'id'));
  res.json({ success: true, message: 'Vendor approved', data: { vendor } });
});

export const deactivateVendor = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vendor = await vendorService.deactivateVendor(getParamId(req, 'id'));
  res.json({ success: true, message: 'Vendor deactivated', data: { vendor } });
});

export const getVendorByUserId = asyncHandler(async (req: AuthRequest, res: Response) => {
  const profile = await vendorService.getVendorProfile(getParamId(req, 'id'));
  res.json({ success: true, data: { profile } });
});
