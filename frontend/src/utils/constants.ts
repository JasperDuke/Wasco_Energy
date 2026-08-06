import { ApplicationStatus } from '@/types';

export const ROLE_LABELS: Record<string, string> = {
  vendor: 'Vendor',
  staff: 'Staff',
  admin: 'Admin',
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: 'Pending',
  pending_approval: 'Pending Approval',
  processing: 'Processing',
  proposal_under_review: 'Proposal Under Review',
  assessment_completed: 'Assessment Completed',
  need_clarification: 'Need Clarification',
  approved: 'Approved',
  conditionally_approved: 'Conditionally Approved',
  rejected: 'Rejected',
  draft: 'Draft',
  submitted: 'Submitted',
};

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, { bg: string; color: string }> = {
  pending: { bg: '#E3F2FD', color: '#1565C0' },
  pending_approval: { bg: '#E3F2FD', color: '#1565C0' },
  processing: { bg: '#FFF3E0', color: '#E65100' },
  proposal_under_review: { bg: '#F3E5F5', color: '#7B1FA2' },
  assessment_completed: { bg: '#E8F5E9', color: '#2E7D32' },
  need_clarification: { bg: '#FFF8E1', color: '#F57F17' },
  approved: { bg: '#E8F5E9', color: '#2E7D32' },
  conditionally_approved: { bg: '#E0F2F1', color: '#00695C' },
  rejected: { bg: '#FFEBEE', color: '#C62828' },
  draft: { bg: '#F5F5F5', color: '#616161' },
  submitted: { bg: '#E3F2FD', color: '#1565C0' },
};

export const USER_STATUS_COLORS: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  suspended: 'default',
  deactivated: 'error',
};

export const STATUS_COLORS: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  ...USER_STATUS_COLORS,
  draft: 'default',
  submitted: 'info',
  processing: 'warning',
  review: 'warning',
};

export const FIELD_TYPE_LABELS: Record<string, string> = {
  text: 'Text',
  textarea: 'Textarea',
  email: 'Email',
  website: 'Website',
  phone: 'Phone',
  number: 'Number',
  dropdown: 'Dropdown',
  radio: 'Radio',
  checkbox: 'Checkbox',
  date: 'Date',
  file: 'File Upload',
};

export const VENDOR_GROUPS = [
  'Equipment Supply',
  'Valves & Fittings',
  'Fabrication',
  'Electrical & Instrumentation',
  'Civil & Construction',
  'Professional Services',
  'IT & Technology',
  'Logistics & Transportation',
];

export const VENDOR_CATEGORIES = [
  'Mechanical Equipment',
  'Valves & Fittings',
  'Steel Fabrication',
  'Electrical Equipment',
  'Instrumentation',
  'Piping & Fittings',
  'Civil Works',
  'Consulting Services',
  'Maintenance Services',
  'Other',
];

export const COUNTRIES = [
  'Malaysia',
  'Singapore',
  'Indonesia',
  'Thailand',
  'Vietnam',
  'Philippines',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Other',
];

export const BUSINESS_TYPES = [
  'Corporation',
  'Partnership',
  'Sole Proprietorship',
  'Limited Liability Company',
  'Other',
];

export const EMPLOYEE_RANGES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '500+',
];
