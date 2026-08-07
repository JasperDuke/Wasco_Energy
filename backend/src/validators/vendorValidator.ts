import { body } from 'express-validator';

const optionalString = (field: string) =>
  body(field).optional({ values: 'falsy' }).trim();

export const adminUpdateVendorValidator = [
  optionalString('companyName'),
  optionalString('vendorGroup'),
  optionalString('parentCompany'),
  optionalString('supplyingEntity'),
  optionalString('businessRegistrationNumber'),
  optionalString('country'),
  optionalString('address'),
  optionalString('website'),
  optionalString('companyEmail').isEmail().withMessage('Valid company email is required'),
  optionalString('companyPhone'),
  optionalString('primaryContactName'),
  optionalString('primaryContactEmail').isEmail().withMessage('Valid contact email is required'),
  optionalString('primaryContactPhone'),
  optionalString('vendorCategory'),
  optionalString('products'),
  optionalString('companyDescription'),
  body('applicationId').optional({ values: 'falsy' }).isMongoId(),
];
