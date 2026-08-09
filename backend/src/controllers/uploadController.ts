import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middlewares/auth';
import {
  assertVendorApplicationAccess,
  saveUploadedFile,
} from '../services/uploadService';
import { AppError } from '../utils/AppError';

function getApplicationId(req: AuthRequest): string {
  const applicationId =
    (req.query.applicationId as string | undefined) ??
    (req.body?.applicationId as string | undefined);

  if (!applicationId) {
    throw new AppError('applicationId is required', 400);
  }

  return applicationId;
}

export const uploadFile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const applicationId = getApplicationId(req);
  const vendorId = req.user!.userId;
  await assertVendorApplicationAccess(applicationId, vendorId);

  const file = saveUploadedFile(req.file);
  res.status(201).json({ success: true, message: 'File uploaded', data: { file } });
});

export const uploadFiles = asyncHandler(async (req: AuthRequest, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files?.length) {
    throw new AppError('No files uploaded', 400);
  }

  const applicationId = getApplicationId(req);
  const vendorId = req.user!.userId;
  await assertVendorApplicationAccess(applicationId, vendorId);

  const uploaded = files.map((file) => saveUploadedFile(file));
  res.status(201).json({ success: true, message: 'Files uploaded', data: { files: uploaded } });
});
