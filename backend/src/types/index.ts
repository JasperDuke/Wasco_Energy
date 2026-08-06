export type UserRole = 'vendor' | 'staff' | 'admin';

export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended' | 'deactivated';

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

export type ApplicationStatus =
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

export type HumanValidationAction =
  | 'approve'
  | 'conditionally_approve'
  | 'reject'
  | 'request_clarification';

export type Recommendation = 'Approve' | 'Conditionally Approve' | 'Reject' | 'Pending' | '—';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}
