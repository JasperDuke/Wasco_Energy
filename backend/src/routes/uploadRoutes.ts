import { Router } from 'express';
import * as uploadController from '../controllers/uploadController';
import { authenticate } from '../middlewares/auth';
import { uploadSingle, uploadMultiple } from '../middlewares/upload';

const router = Router();

router.post('/file', authenticate, uploadSingle, uploadController.uploadFile);
router.post('/', authenticate, uploadMultiple, uploadController.uploadFiles);

export default router;
