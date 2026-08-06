import { Schema, model, Document, Types } from 'mongoose';
import { ApplicationStatus, Recommendation } from '../types';
import {
  APPLICATION_STATUSES,
  IHumanDecision,
  ITimelineEvent,
  IUploadedFileMeta,
  RECOMMENDATIONS,
  timelineEventSchema,
} from './applicationSchemas';

export interface IApplication extends Document {
  _id: Types.ObjectId;
  caseId: string;
  vendorId: Types.ObjectId;
  vendorProfileId: Types.ObjectId;
  vendorName: string;
  vendorGroup?: string;
  supplyingEntity?: string;
  vendorCategory: string;
  formId: Types.ObjectId;
  status: ApplicationStatus;
  formData: Record<string, unknown>;
  uploadedDocuments: Record<string, IUploadedFileMeta[]>;
  recommendation: Recommendation;
  overallScore?: number;
  submittedAt?: Date;
  createdBy: Types.ObjectId;
  timeline: ITimelineEvent[];
  humanDecision?: IHumanDecision;
  atenxionTriggerResponse?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const humanDecisionSchema = new Schema<IHumanDecision>(
  {
    action: {
      type: String,
      enum: ['approve', 'conditionally_approve', 'reject', 'request_clarification'],
      required: true,
    },
    remarks: { type: String },
    decidedAt: { type: Date, required: true },
    decidedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    decidedByName: { type: String },
  },
  { _id: false }
);

const applicationSchema = new Schema<IApplication>(
  {
    caseId: { type: String, required: true, unique: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vendorProfileId: { type: Schema.Types.ObjectId, ref: 'VendorProfile', required: true },
    vendorName: { type: String, required: true, trim: true },
    vendorGroup: { type: String, trim: true, default: '' },
    supplyingEntity: { type: String, trim: true },
    vendorCategory: { type: String, required: true, trim: true },
    formId: { type: Schema.Types.ObjectId, ref: 'DynamicForm', required: true },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'processing',
    },
    formData: { type: Schema.Types.Mixed, default: {} },
    uploadedDocuments: { type: Schema.Types.Mixed, default: {} },
    recommendation: {
      type: String,
      enum: RECOMMENDATIONS,
      default: 'Pending',
    },
    overallScore: { type: Number },
    submittedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    timeline: [timelineEventSchema],
    humanDecision: humanDecisionSchema,
    atenxionTriggerResponse: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

applicationSchema.index({ vendorId: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ caseId: 1 });

export const Application = model<IApplication>('Application', applicationSchema);
