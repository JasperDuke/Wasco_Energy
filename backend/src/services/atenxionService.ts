import axios from 'axios';
import crypto from 'crypto';
import { IApplication } from '../models/Application';
import { IVendorProfile } from '../models/VendorProfile';
import { IDynamicForm } from '../models/DynamicForm';
import { User } from '../models/User';
import * as settingsService from './settingsService';
import { IUploadedFileMeta } from '../models/applicationSchemas';
import { env } from '../config/env';
import { buildFormFieldsPayload, buildTriggerVendorPayload } from '../utils/vendorFormSync';

const TRIGGER_TYPE_VENDOR_QUALIFICATION = 'vendor_qualification';

interface SubmittedDocument {
  document_name: string;
  document_type: string;
}

interface NotSubmittedDocument {
  document_name: string;
  mandatory: boolean;
}

function resolveDocumentType(field: { label: string; documentType?: string }): string {
  return (field.documentType?.trim() || field.label).trim();
}

function buildDocumentLists(
  fileFields: IDynamicForm['fields'],
  uploadedDocuments: Record<string, IUploadedFileMeta[]>
): {
  documentsSubmitted: SubmittedDocument[];
  documentsNotSubmitted: NotSubmittedDocument[];
} {
  const documentsSubmitted: SubmittedDocument[] = [];
  const documentsNotSubmitted: NotSubmittedDocument[] = [];

  for (const field of fileFields) {
    const documentType = resolveDocumentType(field);
    const files = (uploadedDocuments?.[field.key] ?? []) as IUploadedFileMeta[];

    if (files.length > 0) {
      for (const file of files) {
        documentsSubmitted.push({
          document_name: file.originalName,
          document_type: documentType,
        });
      }
    } else if (field.required) {
      documentsNotSubmitted.push({
        document_name: documentType,
        mandatory: true,
      });
    }
  }

  return { documentsSubmitted, documentsNotSubmitted };
}

function getTriggerOrigin(config: TriggerConfig): string {
  return getPublicBaseUrl(config) || env.apiPublicUrl.replace(/\/$/, '');
}

export interface AtenxionTriggerResult {
  success: boolean;
  skipped?: boolean;
  status?: number;
  message?: string;
  data?: Record<string, unknown>;
}

interface TriggerConfig {
  apiUrl: string;
  triggerToken: string;
  apiPublicUrl?: string;
  agentId?: string;
}

function getPublicBaseUrl(config: TriggerConfig): string {
  const raw = (config.apiPublicUrl || env.apiPublicUrl || '').trim();
  if (!raw) return '';
  return raw.replace(/\/api\/?$/, '').replace(/\/$/, '');
}

function buildAttachmentUrls(filePaths: string[], baseUrl: string): string[] {
  if (!Array.isArray(filePaths) || filePaths.length === 0 || !baseUrl) return [];

  return filePaths
    .map((filePath) => {
      if (!filePath) return null;
      const normalized = String(filePath).replace(/\\/g, '/');
      if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
        return normalized;
      }
      const pathPart = normalized.startsWith('/') ? normalized : `/${normalized}`;
      return `${baseUrl}${pathPart}`;
    })
    .filter((url): url is string => Boolean(url));
}

function resolveAttachments(
  filePaths: string[],
  config: TriggerConfig,
  label: string
): string[] {
  const baseUrl = getPublicBaseUrl(config);
  const attachments = buildAttachmentUrls(filePaths, baseUrl);

  if (filePaths.length && !baseUrl) {
    console.warn(
      `[webhook] ${label}: files present but apiPublicUrl/API_PUBLIC_URL not set – attachments will be empty`
    );
  } else if (filePaths.length && attachments.length === 0) {
    console.warn(`[webhook] ${label}: could not build public URLs from file paths`, {
      filePaths,
    });
  } else if (attachments.length > 0) {
    console.log(`[webhook] ${label} public attachment URLs:`, attachments);
  }

  return attachments;
}

function collectFilePaths(
  uploadedDocuments: Record<string, IUploadedFileMeta[]>
): string[] {
  const paths: string[] = [];
  for (const files of Object.values(uploadedDocuments ?? {})) {
    for (const file of files) {
      if (file.path) paths.push(file.path);
    }
  }
  return paths;
}

async function sendWebhook({
  config,
  payload,
  label,
}: {
  config: TriggerConfig;
  payload: Record<string, unknown>;
  label: string;
}): Promise<AtenxionTriggerResult> {
  const requestHeaders = {
    Authorization: '[REDACTED]',
    'Content-Type': 'application/json',
    Origin: getTriggerOrigin(config),
  };

  console.log(`[webhook] ${label} OUTGOING request`, {
    url: config.apiUrl,
    headers: requestHeaders,
    payload,
  });

  try {
    const response = await axios.post(config.apiUrl, payload, {
      headers: {
        Authorization: config.triggerToken,
        'Content-Type': 'application/json',
        Origin: getTriggerOrigin(config),
      },
      timeout: 30000,
    });

    console.log(`[webhook] ${label} OUTGOING response`, {
      event_id: payload.event_id,
      status: response.status,
      data: response.data,
    });

    return {
      success: true,
      status: response.status,
      data: response.data as Record<string, unknown>,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[webhook] ${label} OUTGOING failed`, {
        event_id: payload.event_id,
        status: error.response?.status,
        data: error.response?.data || error.message,
      });
      return {
        success: false,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data as Record<string, unknown>,
      };
    }

    console.error(`[webhook] ${label} OUTGOING failed`, {
      event_id: payload.event_id,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown trigger error',
    };
  }
}

/**
 * Trigger the Atenxion agent webhook when a vendor submits a qualification application.
 * Only sends if System Settings exist with both baseUrl and accessToken.
 */
export async function triggerAtenxion(
  application: IApplication,
  profile: IVendorProfile,
  form: IDynamicForm
): Promise<AtenxionTriggerResult> {
  const settings = await settingsService.getSettingsForInternal();
  if (!settings?.baseUrl || !settings.accessToken) {
    console.log(
      '[webhook] Vendor qualification trigger config missing or incomplete – skipping'
    );
    return {
      success: false,
      skipped: true,
      message: 'Trigger config missing or incomplete',
    };
  }

  const config: TriggerConfig = {
    apiUrl: settings.baseUrl,
    triggerToken: settings.accessToken,
    apiPublicUrl: settings.apiPublicUrl,
    agentId: settings.agentId,
  };

  const fileFields = form.fields.filter((f) => f.type === 'file');
  const { documentsSubmitted, documentsNotSubmitted } = buildDocumentLists(
    fileFields,
    application.uploadedDocuments as Record<string, IUploadedFileMeta[]>
  );

  const filePaths = collectFilePaths(
    application.uploadedDocuments as Record<string, IUploadedFileMeta[]>
  );
  const attachments = resolveAttachments(
    filePaths,
    config,
    'vendor qualification trigger'
  );

  const user = await User.findById(application.vendorId);
  const eventId = `wasco_vq_event_${crypto.randomUUID()}`;

  const payload: Record<string, unknown> = {
    event_id: eventId,
    triggerType: TRIGGER_TYPE_VENDOR_QUALIFICATION,
    applicationId: String(application._id),
    caseId: application.caseId,
    agentId: settings.agentId,
    vendorId: application.vendorId.toString(),
    vendorEmail: user?.email,
    vendorCompanyName: profile.companyName,
    vendorGroup: profile.vendorGroup,
    vendorParentCompany: profile.parentCompany,
    vendorSupplyingEntity: profile.supplyingEntity,
    vendorBusinessRegistrationNumber: profile.businessRegistrationNumber,
    vendorCountry: profile.country,
    vendorAddress: profile.address,
    vendorWebsite: profile.website,
    vendorCompanyEmail: profile.companyEmail,
    vendorPhone: profile.companyPhone,
    vendorContactPerson: profile.primaryContactName,
    vendorContactEmail: profile.primaryContactEmail,
    vendorContactPhone: profile.primaryContactPhone,
    vendorCategory: profile.vendorCategory,
    vendorProducts: profile.products,
    vendorCompanyDescription: profile.companyDescription,
    vendor: buildTriggerVendorPayload(profile),
    form_fields: buildFormFieldsPayload(form, application.formData as Record<string, unknown>),
    attachments,
    message:
      'A vendor qualification application has been submitted. Please analyze the attached documents and provide a detailed assessment report.',
  };

  if (documentsSubmitted.length > 0) {
    payload.documents_submitted = documentsSubmitted;
  }

  if (documentsNotSubmitted.length > 0) {
    payload.documents_not_submitted = documentsNotSubmitted;
  }

  return sendWebhook({ config, payload, label: 'vendor qualification trigger' });
}

export interface AtenxionCallbackPayload {
  case_id: string;
  financial_assessment?: Record<string, unknown>;
  technical_assessment?: Record<string, unknown>;
  compliance_assessment?: Record<string, unknown>;
  overall_score?: number;
  risk_band?: string;
  mandatory_gap?: string;
  /** Missing document name/description — agent emails vendor when set */
  need_more_files?: string;
  recommendation?: string;
  human_validation_required?: boolean;
}

export function mapCallbackRecommendation(rec?: string): 'Approve' | 'Conditionally Approve' | 'Reject' | 'Pending' {
  const normalized = (rec ?? '').toLowerCase();
  if (normalized.includes('conditional')) return 'Conditionally Approve';
  if (normalized.includes('approve')) return 'Approve';
  if (normalized.includes('reject')) return 'Reject';
  return 'Pending';
}
