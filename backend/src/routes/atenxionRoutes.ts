import { Router } from 'express';
import * as atenxionController from '../controllers/atenxionController';
import { callbackValidator } from '../validators/applicationValidator';
import { validate } from '../middlewares/validate';

const router = Router();

router.post('/callback', callbackValidator, validate, atenxionController.callback);

export default router;
