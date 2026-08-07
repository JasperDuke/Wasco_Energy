import { IVendorProfile } from '../models/VendorProfile';
import { IDynamicForm, IFormField } from '../models/DynamicForm';
import { FieldType } from '../types';

const FORM_KEY_TO_PROFILE: Partial<Record<string, keyof IVendorProfile>> = {
  vendor_group: 'vendorGroup',
  parent_company: 'parentCompany',
  supplying_entity: 'supplyingEntity',
  country: 'country',
  website: 'website',
  vendor_category: 'vendorCategory',
  proposed_products: 'products',
  products: 'products',
  company_name: 'companyName',
  company_legal_name: 'companyName',
  address: 'address',
  business_registration_number: 'businessRegistrationNumber',
  business_registration: 'businessRegistrationNumber',
  company_email: 'companyEmail',
  contact_email: 'primaryContactEmail',
  company_phone: 'companyPhone',
  primary_contact_name: 'primaryContactName',
  primary_contact_email: 'primaryContactEmail',
  primary_contact_phone: 'primaryContactPhone',
  company_description: 'companyDescription',
};

export function isEmptyFormValue(value: unknown, fieldType: FieldType): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (fieldType === 'checkbox' && Array.isArray(value) && value.length === 0) return true;
  if (fieldType === 'number' && value === '') return true;
  return false;
}

function resolveProfileField(field: IFormField): keyof IVendorProfile | undefined {
  if (field.vendorField) {
    return field.vendorField as keyof IVendorProfile;
  }
  return FORM_KEY_TO_PROFILE[field.key];
}

function normalizeProfileValue(
  profileKey: keyof IVendorProfile,
  value: unknown
): string | undefined {
  if (profileKey === 'products') {
    if (Array.isArray(value)) {
      return value.map(String).join(', ');
    }
    return String(value).trim();
  }
  return String(value).trim();
}

export function syncVendorProfileFromFormData(
  profile: IVendorProfile,
  form: IDynamicForm,
  formData: Record<string, unknown>
): void {
  for (const field of form.fields) {
    if (field.type === 'file') continue;

    const value = formData[field.key];
    if (isEmptyFormValue(value, field.type)) continue;

    const profileKey = resolveProfileField(field);
    if (!profileKey) continue;

    const normalized = normalizeProfileValue(profileKey, value);
    if (!normalized) continue;

    (profile as unknown as Record<string, unknown>)[profileKey] = normalized;
  }
}

export function syncApplicationVendorSnapshot(
  application: { vendorName: string; vendorGroup?: string; supplyingEntity?: string; vendorCategory: string },
  profile: IVendorProfile
): void {
  application.vendorName = profile.companyName;
  application.vendorGroup = profile.vendorGroup;
  application.supplyingEntity = profile.supplyingEntity;
  application.vendorCategory = profile.vendorCategory;
}

export function buildTriggerVendorPayload(profile: IVendorProfile): Record<string, unknown> {
  const proposedProducts = profile.products
    ? profile.products.split(',').map((item) => item.trim()).filter(Boolean)
    : [];

  return {
    vendor_group: profile.vendorGroup,
    parent_company: profile.parentCompany,
    supplying_entity: profile.supplyingEntity,
    country: profile.country,
    website: profile.website,
    vendor_category: profile.vendorCategory,
    proposed_products: proposedProducts,
  };
}

export function buildFormFieldsPayload(
  form: IDynamicForm,
  formData: Record<string, unknown>
): Array<{ key: string; label: string; type: string; value: unknown }> {
  return form.fields
    .filter((field) => field.type !== 'file')
    .map((field) => ({
      key: field.key,
      label: field.label,
      type: field.type,
      value: formData[field.key] ?? null,
    }));
}
