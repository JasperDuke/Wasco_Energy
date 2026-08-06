import { Router } from 'express';
import * as vendorController from '../controllers/vendorController';
import { authenticate } from '../middlewares/auth';
import { adminOnly } from '../middlewares/role';

const router = Router();

router.use(authenticate, adminOnly);

router.get('/', vendorController.getAllVendors);
router.get('/:id', vendorController.getVendorByUserId);
router.put('/:id/approve', vendorController.approveVendor);
router.put('/:id/deactivate', vendorController.deactivateVendor);

export default router;
