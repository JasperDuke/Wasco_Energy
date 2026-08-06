import { Router } from 'express';
import * as vendorController from '../controllers/vendorController';
import { authenticate } from '../middlewares/auth';
import { vendorOnly } from '../middlewares/role';

const router = Router();

router.get('/profile', authenticate, vendorOnly, vendorController.getProfile);
router.put('/profile', authenticate, vendorOnly, vendorController.updateProfile);

export default router;
