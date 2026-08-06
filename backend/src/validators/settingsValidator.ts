import { body } from 'express-validator';

export const updateSettingsValidator = [
  body('baseUrl').trim().notEmpty().isURL().withMessage('Valid base URL is required'),
  body('accessToken').optional({ values: 'falsy' }).trim(),
  body('agentId').trim().notEmpty().withMessage('Agent ID is required'),
  body('apiPublicUrl').optional({ values: 'falsy' }).trim().isURL().withMessage('Valid API public URL is required'),
];
