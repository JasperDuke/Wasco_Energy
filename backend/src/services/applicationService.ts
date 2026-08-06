import { Application, IApplication } from '../models/Application';
import { Types } from 'mongoose';
import { ApplicationResult, IApplicationResult } from '../models/ApplicationResult';
import { DynamicForm, IDynamicForm } from '../models/DynamicForm';
import { VendorProfile } from '../models/VendorProfile';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { generateCaseId } from '../utils/caseId';
import {
  ApplicationResponse,
  createTimelineEvent,
  mapApplication,
} from '../utils/applicationMapper';
import { triggerAtenxion, mapCallbackRecommendation, AtenxionCallbackPayload } from './atenxionService';
import { ApplicationStatus, HumanValidationAction, Recommendation } from '../types';
import { IUploadedFileMeta } from '../models/applicationSchemas';
import { toFileMeta, UploadFileResponse } from './uploadService';

export interface SubmitApplicationInput {
  formId: string;
  formData: Record<string, unknown>;
  uploadedDocuments: Record<string, UploadFileResponse[]>;
}

export interface FinalizeApplicationInput {
  formData: Record<string, unknown>;
  uploadedDocuments: Record<string, UploadFileResponse[]>;
}

function mapUploadedInput(
  input: Record<string, UploadFileResponse[]>
): Record<string, IUploadedFileMeta[]> {
  const result: Record<string, IUploadedFileMeta[]> = {};
  for (const [key, files] of Object.entries(input)) {
    result[key] = files.map(toFileMeta);
  }
  return result;
}

async function getDocumentFieldLabels(
  formId: Types.ObjectId | string
): Promise<Record<string, string>> {
  const form = await DynamicForm.findById(formId);
  if (!form) return {};

  return Object.fromEntries(
    form.fields
      .filter((field) => field.type === 'file')
      .map((field) => [field.key, field.label])
  );
}

async function enrichApplicationResponse(
  app: IApplication,
  result?: IApplicationResult | null
): Promise<ApplicationResponse> {
  const documentFieldLabels = await getDocumentFieldLabels(app.formId);
  return mapApplication(app, result, documentFieldLabels);
}

function validateFormSubmission(
  form: IDynamicForm | null,
  formData: Record<string, unknown>,
  uploadedDocuments: Record<string, UploadFileResponse[]>
): void {
  if (!form) throw new AppError('Form not found', 404);

  for (const field of form.fields) {
    if (field.required && field.type !== 'file') {
      const value = formData[field.key];
      if (value === undefined || value === null || value === '') {
        throw new AppError(`${field.label} is required`, 400);
      }
    }
    if (field.required && field.type === 'file') {
      const files = uploadedDocuments[field.key];
      if (!files?.length) {
        throw new AppError(`${field.label} is required`, 400);
      }
    }
  }
}

export async function createDraftApplication(
  vendorId: string,
  formId: string
): Promise<ApplicationResponse> {
  const profile = await VendorProfile.findOne({ userId: vendorId });
  if (!profile) throw new AppError('Vendor profile not found', 404);

  const form = await DynamicForm.findById(formId);
  if (!form || !form.isActive) throw new AppError('Active form not found', 404);

  const caseId = await generateCaseId();

  const application = await Application.create({
    caseId,
    vendorId,
    vendorProfileId: profile._id,
    vendorName: profile.companyName,
    vendorGroup: profile.vendorGroup,
    supplyingEntity: profile.supplyingEntity,
    vendorCategory: profile.vendorCategory,
    formId: form._id,
    status: 'draft',
    formData: {},
    uploadedDocuments: {},
    recommendation: 'Pending',
    createdBy: vendorId,
    timeline: [],
  });

  return mapApplication(application);
}

export async function finalizeApplication(
  applicationId: string,
  vendorId: string,
  input: FinalizeApplicationInput
): Promise<ApplicationResponse> {
  const app = await Application.findById(applicationId);
  if (!app) throw new AppError('Application not found', 404);
  if (app.vendorId.toString() !== vendorId) {
    throw new AppError('Access denied', 403);
  }
  if (app.status !== 'draft') {
    throw new AppError('Application is not in draft status', 400);
  }

  const profile = await VendorProfile.findOne({ userId: vendorId });
  if (!profile) throw new AppError('Vendor profile not found', 404);

  const form = await DynamicForm.findById(app.formId);
  validateFormSubmission(form, input.formData, input.uploadedDocuments);

  const now = new Date();
  app.formData = input.formData;
  app.uploadedDocuments = mapUploadedInput(input.uploadedDocuments);
  app.submittedAt = now;
  app.timeline = [
    createTimelineEvent('submitted', 'Submitted', 'Application submitted successfully'),
    createTimelineEvent('processing', 'Processing', 'Application is being processed'),
    createTimelineEvent('proposal_under_review', 'Proposal Under Review', 'Awaiting assessment'),
  ];
  app.status = 'proposal_under_review';

  try {
    const triggerResponse = await triggerAtenxion(app, profile, form!);
    app.atenxionTriggerResponse = { ...triggerResponse };
  } catch (error) {
    app.atenxionTriggerResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Atenxion trigger failed',
    };
  }

  await app.save();
  return enrichApplicationResponse(app);
}

export async function submitApplication(
  vendorId: string,
  input: SubmitApplicationInput
): Promise<ApplicationResponse> {
  const draft = await createDraftApplication(vendorId, input.formId);
  return finalizeApplication(draft.id, vendorId, {
    formData: input.formData,
    uploadedDocuments: input.uploadedDocuments,
  });
}

export async function getApplicationById(
  id: string,
  requesterId: string,
  requesterRole: string
): Promise<ApplicationResponse> {
  const app = await Application.findById(id);
  if (!app) throw new AppError('Application not found', 404);

  if (requesterRole === 'vendor' && app.vendorId.toString() !== requesterId) {
    throw new AppError('Access denied', 403);
  }

  const result = await ApplicationResult.findOne({ applicationId: app._id });
  return enrichApplicationResponse(app, result);
}

export async function getApplications(
  requesterId: string,
  requesterRole: string
): Promise<ApplicationResponse[]> {
  const filter =
    requesterRole === 'vendor' ? { vendorId: requesterId } : {};

  const apps = await Application.find({
    ...filter,
    status: { $ne: 'draft' },
  }).sort({ createdAt: -1 });
  const results = await Promise.all(
    apps.map(async (app) => {
      const result = await ApplicationResult.findOne({ applicationId: app._id });
      return mapApplication(app, result);
    })
  );
  return results;
}

export async function uploadClarification(
  applicationId: string,
  vendorId: string,
  fieldKey: string,
  files: UploadFileResponse[]
): Promise<ApplicationResponse> {
  const app = await Application.findById(applicationId);
  if (!app) throw new AppError('Application not found', 404);
  if (app.vendorId.toString() !== vendorId) {
    throw new AppError('Access denied', 403);
  }
  if (app.status !== 'need_clarification') {
    throw new AppError('Clarification upload not required', 400);
  }

  const existing = (app.uploadedDocuments[fieldKey] ?? []) as IUploadedFileMeta[];
  app.uploadedDocuments[fieldKey] = [
    ...existing,
    ...files.map(toFileMeta),
  ];
  app.status = 'processing';
  app.timeline.push(
    createTimelineEvent('processing', 'Document Uploaded', 'Clarification document submitted')
  );
  app.timeline.push(
    createTimelineEvent('proposal_under_review', 'Proposal Under Review', 'Re-submitted for assessment')
  );
  app.status = 'proposal_under_review';
  await app.save();

  const profile = await VendorProfile.findById(app.vendorProfileId);
  const form = await DynamicForm.findById(app.formId);
  if (profile && form) {
    const triggerResponse = await triggerAtenxion(app, profile, form);
    app.atenxionTriggerResponse = { ...triggerResponse };
    await app.save();
  }

  const result = await ApplicationResult.findOne({ applicationId: app._id });
  return enrichApplicationResponse(app, result);
}

export async function processCallback(
  payload: AtenxionCallbackPayload
): Promise<ApplicationResponse> {
  const app = await Application.findOne({ caseId: payload.case_id });
  if (!app) throw new AppError('Application not found for case', 404);

  const recommendation = mapCallbackRecommendation(payload.recommendation);
  const needMoreFiles = payload.need_more_files?.trim();

  await ApplicationResult.findOneAndUpdate(
    { applicationId: app._id },
    {
      applicationId: app._id,
      financialAssessment: payload.financial_assessment,
      technicalAssessment: payload.technical_assessment,
      complianceAssessment: payload.compliance_assessment,
      overallScore: payload.overall_score,
      riskBand: payload.risk_band,
      mandatoryGap: payload.mandatory_gap,
      needMoreFiles,
      recommendation,
      humanValidationRequired: payload.human_validation_required ?? true,
      rawResponse: payload as unknown as Record<string, unknown>,
      processedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  app.overallScore = payload.overall_score;
  app.recommendation = recommendation as Recommendation;

  if (needMoreFiles) {
    app.status = 'need_clarification';
    app.timeline.push(
      createTimelineEvent(
        'need_clarification',
        'Additional Documents Required',
        `${needMoreFiles} missing — vendor informed via email`
      )
    );
  } else {
    app.status = 'assessment_completed';
    app.timeline.push(
      createTimelineEvent(
        'assessment_completed',
        'Assessment Completed',
        payload.mandatory_gap ? `Outstanding: ${payload.mandatory_gap}` : 'AI assessment completed'
      )
    );
  }

  await app.save();

  const result = await ApplicationResult.findOne({ applicationId: app._id });
  return enrichApplicationResponse(app, result);
}

export async function humanValidation(
  applicationId: string,
  action: HumanValidationAction,
  remarks: string | undefined,
  decidedBy: string,
  decidedByName: string
): Promise<ApplicationResponse> {
  const app = await Application.findById(applicationId);
  if (!app) throw new AppError('Application not found', 404);

  if (!['assessment_completed', 'need_clarification'].includes(app.status)) {
    throw new AppError('Application is not ready for human validation', 400);
  }

  let newStatus: ApplicationStatus;
  let recommendation: Recommendation;
  let label: string;

  switch (action) {
    case 'approve':
      newStatus = 'approved';
      recommendation = 'Approve';
      label = 'Approved';
      break;
    case 'conditionally_approve':
      newStatus = 'conditionally_approved';
      recommendation = 'Conditionally Approve';
      label = 'Conditionally Approved';
      break;
    case 'reject':
      newStatus = 'rejected';
      recommendation = 'Reject';
      label = 'Rejected';
      break;
    case 'request_clarification':
      newStatus = 'need_clarification';
      recommendation = 'Conditionally Approve';
      label = 'Clarification Requested';
      break;
    default:
      throw new AppError('Invalid action', 400);
  }

  app.status = newStatus;
  app.recommendation = recommendation;
  app.humanDecision = {
    action,
    remarks,
    decidedAt: new Date(),
    decidedBy: new Types.ObjectId(decidedBy),
    decidedByName,
  };
  app.timeline.push(
    createTimelineEvent(newStatus, label, remarks, decidedByName)
  );
  await app.save();

  const result = await ApplicationResult.findOne({ applicationId: app._id });
  return enrichApplicationResponse(app, result);
}

export async function getDashboardStats(): Promise<{
  totalApplications: number;
  processing: number;
  assessmentCompleted: number;
  needClarification: number;
  approved: number;
  rejected: number;
  pendingVendors: number;
  totalVendors: number;
  totalStaff: number;
}> {
  const apps = await Application.find();
  const pendingVendors = await VendorProfile.countDocuments({ status: 'pending' });
  const totalVendors = await VendorProfile.countDocuments();
  const totalStaff = await User.countDocuments({ role: 'staff', isActive: true });

  return {
    totalApplications: apps.length,
    processing: apps.filter((a) =>
      ['processing', 'proposal_under_review', 'submitted'].includes(a.status)
    ).length,
    assessmentCompleted: apps.filter((a) => a.status === 'assessment_completed').length,
    needClarification: apps.filter((a) => a.status === 'need_clarification').length,
    approved: apps.filter((a) =>
      ['approved', 'conditionally_approved'].includes(a.status)
    ).length,
    rejected: apps.filter((a) => a.status === 'rejected').length,
    pendingVendors,
    totalVendors,
    totalStaff,
  };
}
