export type UserRole = 'vendor' | 'staff' | 'admin';

export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended' | 'deactivated';

export type ApplicationStatus =
  | 'pending'
  | 'pending_approval'
  | 'processing'
  | 'proposal_under_review'
  | 'assessment_completed'
  | 'need_clarification'
  | 'approved'
  | 'conditionally_approved'
  | 'rejected'
  | 'draft'
  | 'submitted';

export type Recommendation =
  | 'Approve'
  | 'Conditionally Approve'
  | 'Reject'
  | 'Pending'
  | '—';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'website'
  | 'phone'
  | 'number'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'file';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
}

export interface VendorRegistration {
  companyName: string;
  vendorGroup: string;
  parentCompany?: string;
  supplyingEntity?: string;
  businessRegistrationNumber: string;
  country: string;
  address: string;
  website?: string;
  companyEmail: string;
  companyPhone: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  vendorCategory: string;
  products: string;
  password: string;
  confirmPassword: string;
}

export interface VendorProfile {
  id: string;
  userId: string;
  companyName: string;
  vendorGroup: string;
  parentCompany?: string;
  supplyingEntity?: string;
  businessRegistrationNumber: string;
  country: string;
  address: string;
  website?: string;
  companyEmail: string;
  companyPhone: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  vendorCategory: string;
  products: string;
  companyDescription?: string;
  status: UserStatus;
  createdAt: string;
}

export interface UploadedFile {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  path?: string;
  url?: string;
  filename?: string;
  /** Client-side only — actual File before upload */
  file?: File;
}

export interface ApplicationAssessment {
  overallScore: number;
  riskBand: 'Low' | 'Medium' | 'High';
  financialScore: number;
  technicalScore: number;
  complianceScore: number;
  recommendation: Recommendation;
  outstandingRequirement?: string;
  needMoreFiles?: string;
  assessedAt: string;
}

export interface TimelineEvent {
  id: string;
  status: ApplicationStatus;
  label: string;
  description?: string;
  timestamp: string;
  actor?: string;
}

export interface Application {
  id: string;
  caseId: string;
  vendorId: string;
  vendorName: string;
  vendorGroup: string;
  supplyingEntity?: string;
  vendorCategory: string;
  formId: string;
  status: ApplicationStatus;
  formData: Record<string, unknown>;
  uploadedDocuments: Record<string, UploadedFile[]>;
  assessment?: ApplicationAssessment;
  recommendation: Recommendation;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
  documentFieldLabels?: Record<string, string>;
  vendorProfile?: VendorProfile;
}

export interface StaffUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  isActive: boolean;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface FormField {
  _id?: string;
  label: string;
  key: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  options?: string[];
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  documentType?: string;
  vendorField?: string;
  order: number;
  helpText?: string;
}

export interface DynamicForm {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  id: string;
  baseUrl: string;
  agentId: string;
  apiPublicUrl: string;
  hasAccessToken: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: UserRole[];
}

export interface DashboardStats {
  totalApplications: number;
  processing: number;
  assessmentCompleted: number;
  needClarification: number;
  approved: number;
  rejected: number;
  pendingVendors?: number;
  totalVendors?: number;
  totalStaff?: number;
}

export interface VendorDashboardStats {
  companyStatus: UserStatus;
  recentSubmissions: Application[];
  currentSubmission?: Application;
}

export type HumanValidationAction =
  | 'approve'
  | 'conditionally_approve'
  | 'reject'
  | 'request_clarification';
