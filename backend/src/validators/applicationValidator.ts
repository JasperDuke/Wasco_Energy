import { body, param } from 'express-validator';

export const submitApplicationValidator = [
  body('formId').notEmpty().isMongoId().withMessage('Valid form ID is required'),
  body('formData').isObject().withMessage('Form data is required'),
  body('uploadedDocuments').optional().isObject(),
];

export const draftApplicationValidator = [
  body('formId').notEmpty().isMongoId().withMessage('Valid form ID is required'),
];

export const finalizeApplicationValidator = [
  param('id').isMongoId(),
  body('formData').isObject().withMessage('Form data is required'),
  body('uploadedDocuments').optional().isObject(),
];

export const humanValidationValidator = [
  param('id').isMongoId(),
  body('action')
    .isIn(['approve', 'conditionally_approve', 'reject', 'request_clarification'])
    .withMessage('Invalid validation action'),
  body('remarks').optional().trim(),
];

export const clarificationValidator = [
  param('id').isMongoId(),
  body('fieldKey').trim().notEmpty(),
  body('files').isArray({ min: 1 }),
];

export const callbackValidator = [
  body('case_id').trim().notEmpty().withMessage('case_id is required'),
];
