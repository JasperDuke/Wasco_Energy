import { AppError } from '../utils/AppError';
import { generateId } from '../utils/id';
import { IUploadedFileMeta } from '../models/applicationSchemas';
import { Application } from '../models/Application';

export interface UploadFileResponse {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export function buildUploadPublicPath(filename: string): string {
  return `/uploads/${filename}`;
}

export function saveUploadedFile(file: Express.Multer.File): UploadFileResponse {
  return {
    id: generateId('file'),
    filename: file.filename,
    originalName: file.originalname,
    path: buildUploadPublicPath(file.filename),
    size: file.size,
    mimeType: file.mimetype,
    uploadedAt: new Date().toISOString(),
  };
}

export async function assertVendorApplicationAccess(
  applicationId: string,
  vendorId: string
): Promise<void> {
  const app = await Application.findById(applicationId);
  if (!app) {
    throw new AppError('Application not found', 404);
  }
  if (app.vendorId.toString() !== vendorId) {
    throw new AppError('Access denied', 403);
  }
}

export function toFileMeta(uploaded: UploadFileResponse): IUploadedFileMeta {
  return {
    id: uploaded.id,
    filename: uploaded.filename,
    originalName: uploaded.originalName,
    path: uploaded.path,
    size: uploaded.size,
    mimeType: uploaded.mimeType,
    uploadedAt: new Date(uploaded.uploadedAt),
  };
}

export function ensureUploadError(err: unknown): never {
  if (err instanceof Error && err.message.includes('File type not allowed')) {
    throw new AppError(err.message, 400);
  }
  if (err instanceof Error && err.message.includes('File too large')) {
    throw new AppError('File size exceeds maximum allowed limit', 400);
  }
  throw err;
}
