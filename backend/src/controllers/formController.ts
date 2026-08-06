import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middlewares/auth';
import * as formService from '../services/formService';
import { getParamId } from '../utils/params';

export const createForm = asyncHandler(async (req: AuthRequest, res: Response) => {
  const form = await formService.createForm(req.body, req.user!.userId);
  res.status(201).json({ success: true, message: 'Form created', data: { form } });
});

export const getAllForms = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const forms = await formService.getAllForms();
  res.json({ success: true, data: { forms } });
});

export const getFormById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const form = await formService.getFormById(getParamId(req, 'id'));
  res.json({ success: true, data: { form } });
});

export const getActiveForm = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const form = await formService.getActiveForm();
  res.json({ success: true, data: { form } });
});

export const updateForm = asyncHandler(async (req: AuthRequest, res: Response) => {
  const form = await formService.updateForm(getParamId(req, 'id'), req.body);
  res.json({ success: true, message: 'Form updated', data: { form } });
});

export const deleteForm = asyncHandler(async (req: AuthRequest, res: Response) => {
  await formService.deleteForm(getParamId(req, 'id'));
  res.json({ success: true, message: 'Form deleted' });
});
