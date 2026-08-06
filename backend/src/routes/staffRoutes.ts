import { Router } from 'express';
import * as staffController from '../controllers/staffController';
import { authenticate } from '../middlewares/auth';
import { adminOnly } from '../middlewares/role';

const router = Router();

router.use(authenticate, adminOnly);

router.get('/', staffController.getAll);
router.post('/', staffController.create);
router.put('/:id', staffController.update);
router.delete('/:id', staffController.remove);

export default router;
