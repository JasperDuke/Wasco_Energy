import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middlewares/auth';
import { adminOnly, staffOnly } from '../middlewares/role';

const router = Router();

router.use(authenticate);

router.get('/pending', staffOnly, userController.getPendingVendors);
router.get('/', adminOnly, userController.getAllUsers);
router.patch('/:id/status', adminOnly, userController.updateUserStatus);
router.patch('/:id/toggle-active', adminOnly, userController.toggleUserActive);

export default router;
