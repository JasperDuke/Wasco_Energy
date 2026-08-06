import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as applicationService from '../services/applicationService';
import { AtenxionCallbackPayload } from '../services/atenxionService';

export const callback = asyncHandler(async (req: Request, res: Response) => {
  const application = await applicationService.processCallback(
    req.body as AtenxionCallbackPayload
  );
  res.json({ success: true, message: 'Callback processed', data: { application } });
});
