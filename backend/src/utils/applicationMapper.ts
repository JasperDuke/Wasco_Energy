import { Types } from 'mongoose';
import { IApplication } from '../models/Application';
import { IApplicationResult } from '../models/ApplicationResult';
import { ApplicationStatus, Recommendation } from '../types';
import { env } from '../config/env';

export interface UploadedFileResponse {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  path?: string;
  url?: string;
  filename?: string;
}

export interface TimelineEventResponse {
  id: string;
  status: ApplicationStatus;
  label: string;
  description?: string;
  timestamp: string;
  actor?: string;
}

export interface ApplicationAssessmentResponse {
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

export interface ApplicationResponse {
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
  uploadedDocuments: Record<string, UploadedFileResponse[]>;
  assessment?: ApplicationAssessmentResponse;
  recommendation: Recommendation;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEventResponse[];
  documentFieldLabels?: Record<string, string>;
}

function buildPublicFileUrl(filePath?: string): string | undefined {
  if (!filePath) return undefined;
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;

  const base = env.apiPublicUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
  const normalized = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return `${base}${normalized}`;
}

function extractScore(assessment?: Record<string, unknown>): number {
  if (!assessment) return 0;
  if (typeof assessment.score === 'number') return assessment.score;
  if (typeof assessment.overall_score === 'number') return assessment.overall_score;
  if (typeof assessment.value === 'number') return assessment.value;
  return 0;
}

function mapRiskBand(risk?: string): 'Low' | 'Medium' | 'High' {
  const normalized = (risk ?? '').toLowerCase();
  if (normalized.includes('low')) return 'Low';
  if (normalized.includes('high')) return 'High';
  return 'Medium';
}

export function mapAssessment(
  result: IApplicationResult
): ApplicationAssessmentResponse {
  return {
    overallScore: result.overallScore ?? 0,
    riskBand: mapRiskBand(result.riskBand),
    financialScore: extractScore(result.financialAssessment as Record<string, unknown>),
    technicalScore: extractScore(result.technicalAssessment as Record<string, unknown>),
    complianceScore: extractScore(result.complianceAssessment as Record<string, unknown>),
    recommendation: (result.recommendation as Recommendation) ?? 'Pending',
    outstandingRequirement: result.mandatoryGap,
    needMoreFiles: result.needMoreFiles,
    assessedAt: (result.processedAt ?? result.createdAt).toISOString(),
  };
}

export function mapUploadedDocuments(
  docs: Record<string, { id: string; originalName: string; size: number; mimeType: string; uploadedAt: Date; path?: string; filename?: string }[]>
): Record<string, UploadedFileResponse[]> {
  const mapped: Record<string, UploadedFileResponse[]> = {};
  for (const [key, files] of Object.entries(docs ?? {})) {
    mapped[key] = files.map((f) => ({
      id: f.id,
      originalName: f.originalName,
      size: f.size,
      mimeType: f.mimeType,
      uploadedAt: new Date(f.uploadedAt).toISOString(),
      path: f.path,
      url: buildPublicFileUrl(f.path),
      filename: f.filename,
    }));
  }
  return mapped;
}

export function mapApplication(
  app: IApplication,
  result?: IApplicationResult | null,
  documentFieldLabels?: Record<string, string>
): ApplicationResponse {
  return {
    id: app._id.toString(),
    caseId: app.caseId,
    vendorId: app.vendorId.toString(),
    vendorName: app.vendorName,
    vendorGroup: app.vendorGroup ?? '',
    supplyingEntity: app.supplyingEntity,
    vendorCategory: app.vendorCategory,
    formId: app.formId.toString(),
    status: app.status,
    formData: app.formData,
    uploadedDocuments: mapUploadedDocuments(
      app.uploadedDocuments as Record<string, { id: string; originalName: string; size: number; mimeType: string; uploadedAt: Date; path?: string; filename?: string }[]>
    ),
    assessment: result ? mapAssessment(result) : undefined,
    recommendation: app.recommendation,
    submittedAt: app.submittedAt?.toISOString(),
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    timeline: (app.timeline ?? []).map((t) => ({
      id: t.id,
      status: t.status,
      label: t.label,
      description: t.description,
      timestamp: new Date(t.timestamp).toISOString(),
      actor: t.actor,
    })),
    documentFieldLabels,
  };
}

export function createTimelineEvent(
  status: ApplicationStatus,
  label: string,
  description?: string,
  actor?: string
) {
  return {
    id: new Types.ObjectId().toString(),
    status,
    label,
    description,
    timestamp: new Date(),
    actor,
  };
}
