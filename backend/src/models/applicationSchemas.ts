import { Schema, Types } from 'mongoose';
import { HumanValidationAction, Recommendation, ApplicationStatus } from '../types';

export interface IUploadedFileMeta {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

export interface ITimelineEvent {
  id: string;
  status: ApplicationStatus;
  label: string;
  description?: string;
  timestamp: Date;
  actor?: string;
}

export interface IHumanDecision {
  action: HumanValidationAction;
  remarks?: string;
  decidedAt: Date;
  decidedBy: Types.ObjectId;
  decidedByName?: string;
}

export const uploadedFileSchema = new Schema<IUploadedFileMeta>(
  {
    id: { type: String, required: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

export const timelineEventSchema = new Schema<ITimelineEvent>(
  {
    id: { type: String, required: true },
    status: { type: String, required: true },
    label: { type: String, required: true },
    description: { type: String },
    timestamp: { type: Date, required: true },
    actor: { type: String },
  },
  { _id: false }
);

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'pending_approval',
  'processing',
  'proposal_under_review',
  'assessment_completed',
  'need_clarification',
  'approved',
  'conditionally_approved',
  'rejected',
  'draft',
  'submitted',
];

export const RECOMMENDATIONS: Recommendation[] = [
  'Approve',
  'Conditionally Approve',
  'Reject',
  'Pending',
  '—',
];
