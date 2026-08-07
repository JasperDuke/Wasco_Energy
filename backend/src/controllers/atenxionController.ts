import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as applicationService from '../services/applicationService';
import { AtenxionCallbackPayload } from '../services/atenxionService';

export const callback = asyncHandler(async (req: Request, res: Response) => {
  console.log('[atenxion] CALLBACK INCOMING request', {
    method: req.method,
    path: req.originalUrl,
    headers: {
      'content-type': req.headers['content-type'],
      origin: req.headers.origin,
      'user-agent': req.headers['user-agent'],
    },
    body: req.body,
  });

  try {
    const application = await applicationService.processCallback(
      req.body as AtenxionCallbackPayload
    );

    console.log('[atenxion] CALLBACK processed successfully', {
      case_id: req.body?.case_id,
      applicationId: application.id,
      status: application.status,
      recommendation: application.recommendation,
    });

    res.json({ success: true, message: 'Callback processed', data: { application } });
  } catch (error) {
    console.error('[atenxion] CALLBACK failed', {
      case_id: req.body?.case_id,
      body: req.body,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
});
