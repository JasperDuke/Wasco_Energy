import { body } from 'express-validator';

export const registerValidator = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('vendorGroup').trim().notEmpty().withMessage('Vendor group is required'),
  body('businessRegistrationNumber').trim().notEmpty().withMessage('Registration number is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('companyEmail').isEmail().normalizeEmail().withMessage('Valid company email is required'),
  body('companyPhone').trim().notEmpty().withMessage('Company phone is required'),
  body('primaryContactName').trim().notEmpty().withMessage('Primary contact name is required'),
  body('primaryContactEmail').isEmail().normalizeEmail().withMessage('Valid contact email is required'),
  body('primaryContactPhone').trim().notEmpty().withMessage('Primary contact phone is required'),
  body('vendorCategory').trim().notEmpty().withMessage('Vendor category is required'),
  body('products').trim().notEmpty().withMessage('Products is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is required'),
  body('website').optional({ values: 'falsy' }).isURL().withMessage('Valid website URL required'),
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];
