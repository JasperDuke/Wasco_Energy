import { Router } from 'express';
import * as formController from '../controllers/formController';
import { authenticate } from '../middlewares/auth';
import { adminOnly, vendorOnly } from '../middlewares/role';
import { createFormValidator, updateFormValidator } from '../validators/formValidator';
import { validate } from '../middlewares/validate';

const router = Router();

router.get('/active', authenticate, vendorOnly, formController.getActiveForm);

router.use(authenticate, adminOnly);

router.post('/', createFormValidator, validate, formController.createForm);
router.get('/', formController.getAllForms);
router.get('/:id', formController.getFormById);
router.put('/:id', updateFormValidator, validate, formController.updateForm);
router.delete('/:id', formController.deleteForm);

export default router;
