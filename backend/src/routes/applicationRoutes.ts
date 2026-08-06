import { Router } from 'express';
import * as applicationController from '../controllers/applicationController';
import { authenticate } from '../middlewares/auth';
import { staffOnly, vendorOnly } from '../middlewares/role';
import { validate } from '../middlewares/validate';
import {
  humanValidationValidator,
  clarificationValidator,
  submitApplicationValidator,
  draftApplicationValidator,
  finalizeApplicationValidator,
} from '../validators/applicationValidator';

const router = Router();

router.use(authenticate);

router.post('/draft', vendorOnly, draftApplicationValidator, validate, applicationController.createDraft);
router.post('/', vendorOnly, submitApplicationValidator, validate, applicationController.submit);
router.post(
  '/:id/submit',
  vendorOnly,
  finalizeApplicationValidator,
  validate,
  applicationController.finalize
);
router.get('/', applicationController.getAll);
router.get('/:id', applicationController.getById);
router.post(
  '/:id/clarifications',
  vendorOnly,
  clarificationValidator,
  validate,
  applicationController.uploadClarification
);
router.post(
  '/:id/validation',
  staffOnly,
  humanValidationValidator,
  validate,
  applicationController.humanValidation
);

export default router;
