import { Router } from 'express';
import * as settingsController from '../controllers/settingsController';
import { authenticate } from '../middlewares/auth';
import { adminOnly } from '../middlewares/role';
import { updateSettingsValidator } from '../validators/settingsValidator';
import { validate } from '../middlewares/validate';

const router = Router();

router.use(authenticate, adminOnly);

router.get('/', settingsController.getSettings);
router.put('/', updateSettingsValidator, validate, settingsController.updateSettings);

export default router;
