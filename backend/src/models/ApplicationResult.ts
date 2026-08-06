import { Schema, model, Document, Types } from 'mongoose';
import { Recommendation } from '../types';
import { RECOMMENDATIONS } from './applicationSchemas';

export interface IApplicationResult extends Document {
  _id: Types.ObjectId;
  applicationId: Types.ObjectId;
  atenxionJobId?: string;
  financialAssessment?: Record<string, unknown>;
  technicalAssessment?: Record<string, unknown>;
  complianceAssessment?: Record<string, unknown>;
  overallScore?: number;
  riskBand?: string;
  mandatoryGap?: string;
  /** Missing document the agent requested from the vendor (vendor notified by email) */
  needMoreFiles?: string;
  recommendation?: Recommendation;
  humanValidationRequired?: boolean;
  rawResponse?: Record<string, unknown>;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const applicationResultSchema = new Schema<IApplicationResult>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      unique: true,
    },
    atenxionJobId: { type: String, trim: true },
    financialAssessment: { type: Schema.Types.Mixed },
    technicalAssessment: { type: Schema.Types.Mixed },
    complianceAssessment: { type: Schema.Types.Mixed },
    overallScore: { type: Number },
    riskBand: { type: String, trim: true },
    mandatoryGap: { type: String },
    needMoreFiles: { type: String },
    recommendation: { type: String, enum: RECOMMENDATIONS },
    humanValidationRequired: { type: Boolean, default: false },
    rawResponse: { type: Schema.Types.Mixed },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

applicationResultSchema.index({ applicationId: 1 });

export const ApplicationResult = model<IApplicationResult>(
  'ApplicationResult',
  applicationResultSchema
);
