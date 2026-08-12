/**
 * Central brand configuration.
 * Change BRAND_NAME here to update the brand across the entire frontend.
 */
export const BRAND_NAME = 'Apex';

export const BRAND = {
  name: BRAND_NAME,
  fullName: `${BRAND_NAME} Energy`,
  legalName: `${BRAND_NAME} Berhad`,
  legalFullName: `${BRAND_NAME} Energy Berhad`,
  portalName: `${BRAND_NAME} Portal`,
  buildingName: `Menara ${BRAND_NAME}`,
  portalTagline: 'Vendor Qualification Portal',
  contactEmail: `procurement@${BRAND_NAME.toLowerCase()}energy.com`,
  logo: '/icon.png',
} as const;

export const APP_METADATA = {
  title: `${BRAND.fullName} - ${BRAND.portalTagline}`,
  description: `Vendor qualification and onboarding portal for ${BRAND.fullName} suppliers`,
} as const;

/** Short page names used with the root metadata title template. */
export const PAGE_TITLES = {
  about: 'About Us',
  services: 'Services',
  industries: 'Industries',
  becomeVendor: 'Become a Vendor',
  contact: 'Contact Us',
  login: 'Login',
  register: 'Register',
  dashboard: 'Dashboard',
  applications: 'Applications',
  applicationReview: 'Application Review',
  vendorUsers: 'Vendor Users',
  vendorDetails: 'Vendor Details',
  staffUsers: 'Staff Users',
  formBuilder: 'Form Builder',
  settings: 'System Settings',
  companyProfile: 'Company Profile',
  mySubmissions: 'My Submissions',
  newSubmission: 'New Submission',
  submissionDetails: 'Submission Details',
  submissionSuccess: 'Submission Successful',
} as const;
