import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import formRoutes from './formRoutes';
import settingsRoutes from './settingsRoutes';
import applicationRoutes from './applicationRoutes';
import vendorRoutes from './vendorRoutes';
import vendorsRoutes from './vendorsRoutes';
import staffRoutes from './staffRoutes';
import uploadRoutes from './uploadRoutes';
import atenxionRoutes from './atenxionRoutes';
import dashboardRoutes from './dashboardRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/forms', formRoutes);
router.use('/form', formRoutes);
router.use('/settings', settingsRoutes);
router.use('/applications', applicationRoutes);
router.use('/vendor', vendorRoutes);
router.use('/vendors', vendorsRoutes);
router.use('/staff', staffRoutes);
router.use('/upload', uploadRoutes);
router.use('/atenxion', atenxionRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

export default router;
