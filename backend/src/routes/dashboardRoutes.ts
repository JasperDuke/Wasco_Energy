import { Router } from 'express';
import * as applicationController from '../controllers/applicationController';
import { authenticate } from '../middlewares/auth';
import { staffOnly } from '../middlewares/role';

const router = Router();

router.use(authenticate, staffOnly);

router.get('/staff', applicationController.getDashboardStats);
router.get('/admin', applicationController.getDashboardStats);

export default router;
