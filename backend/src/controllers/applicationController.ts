import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middlewares/auth';
import * as applicationService from '../services/applicationService';
import { getParamId } from '../utils/params';
import { HumanValidationAction } from '../types';

export const submit = asyncHandler(async (req: AuthRequest, res: Response) => {
  const application = await applicationService.submitApplication(req.user!.userId, req.body);
  res.status(201).json({ success: true, message: 'Application submitted', data: { application } });
});

export const createDraft = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { formId } = req.body as { formId: string };
  const application = await applicationService.createDraftApplication(req.user!.userId, formId);
  res.status(201).json({ success: true, message: 'Draft created', data: { application } });
});

export const finalize = asyncHandler(async (req: AuthRequest, res: Response) => {
  const application = await applicationService.finalizeApplication(
    getParamId(req, 'id'),
    req.user!.userId,
    req.body
  );
  res.json({ success: true, message: 'Application submitted', data: { application } });
});

export const getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
  const applications = await applicationService.getApplications(
    req.user!.userId,
    req.user!.role
  );
  res.json({ success: true, data: { applications } });
});

export const getById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const application = await applicationService.getApplicationById(
    getParamId(req, 'id'),
    req.user!.userId,
    req.user!.role
  );
  res.json({ success: true, data: { application } });
});

export const uploadClarification = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { fieldKey, files } = req.body as {
    fieldKey: string;
    files: import('../services/uploadService').UploadFileResponse[];
  };
  const application = await applicationService.uploadClarification(
    getParamId(req, 'id'),
    req.user!.userId,
    fieldKey,
    files
  );
  res.json({ success: true, message: 'Document uploaded', data: { application } });
});

export const humanValidation = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { action, remarks } = req.body as {
    action: HumanValidationAction;
    remarks?: string;
  };
  const user = req.user!;
  const application = await applicationService.humanValidation(
    getParamId(req, 'id'),
    action,
    remarks,
    user.userId,
    user.email
  );
  res.json({ success: true, message: 'Decision recorded', data: { application } });
});

export const getDashboardStats = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const stats = await applicationService.getDashboardStats();
  res.json({ success: true, data: { stats } });
});
