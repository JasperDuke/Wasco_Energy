import { Router } from 'express';
import * as vendorController from '../controllers/vendorController';
import { authenticate } from '../middlewares/auth';
import { adminOnly, staffOnly } from '../middlewares/role';
import { validate } from '../middlewares/validate';
import { adminUpdateVendorValidator } from '../validators/vendorValidator';

const router = Router();

router.use(authenticate);

router.get('/', adminOnly, vendorController.getAllVendors);
router.get('/:id', staffOnly, vendorController.getVendorByUserId);
router.put(
  '/:id',
  staffOnly,
  adminUpdateVendorValidator,
  validate,
  vendorController.adminUpdateVendor
);
router.put('/:id/approve', adminOnly, vendorController.approveVendor);
router.put('/:id/deactivate', adminOnly, vendorController.deactivateVendor);

export default router;
