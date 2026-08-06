import { body } from 'express-validator';
import { FieldType } from '../types';

const fieldTypes: FieldType[] = [
  'text',
  'textarea',
  'email',
  'website',
  'phone',
  'number',
  'dropdown',
  'radio',
  'checkbox',
  'date',
  'file',
];

export const createFormValidator = [
  body('name').trim().notEmpty().withMessage('Form name is required'),
  body('description').optional().trim(),
  body('fields').isArray({ min: 1 }).withMessage('At least one field is required'),
  body('fields.*.label').trim().notEmpty().withMessage('Field label is required'),
  body('fields.*.key').trim().notEmpty().withMessage('Field key is required'),
  body('fields.*.type')
    .isIn(fieldTypes)
    .withMessage('Invalid field type'),
  body('fields.*.required').isBoolean().withMessage('Required must be boolean'),
  body('fields.*.order').isInt({ min: 0 }).withMessage('Field order is required'),
];

export const updateFormValidator = [
  body('name').optional().trim().notEmpty().withMessage('Form name cannot be empty'),
  body('description').optional().trim(),
  body('fields').optional().isArray({ min: 1 }).withMessage('At least one field is required'),
  body('fields.*.label').optional().trim().notEmpty().withMessage('Field label is required'),
  body('fields.*.key').optional().trim().notEmpty().withMessage('Field key is required'),
  body('fields.*.type')
    .optional()
    .isIn(fieldTypes)
    .withMessage('Invalid field type'),
  body('fields.*.required').optional().isBoolean().withMessage('Required must be boolean'),
  body('fields.*.order').optional().isInt({ min: 0 }).withMessage('Field order is required'),
];
