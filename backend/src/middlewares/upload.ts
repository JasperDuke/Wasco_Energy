import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { AuthRequest } from './auth';
import { env } from '../config/env';

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];

function resolveUploadDir(req: Request): string {
  const authReq = req as AuthRequest;
  const applicationId =
    (req.query.applicationId as string | undefined) ??
    (req.body?.applicationId as string | undefined);

  // Flat dir for short URLs: /uploads/{filename}
  // Legacy paths under public/{vendorId}/{applicationId}/ remain served as-is.
  if (applicationId && authReq.user?.userId) {
    return env.uploadDir;
  }

  return path.join(env.uploadDir, 'temp');
}

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const uploadPath = resolveUploadDir(req);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    cb(new Error(`File type not allowed: ${ext}`));
    return;
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadSingle = upload.single('file');
export const uploadMultiple = upload.array('files', 10);
