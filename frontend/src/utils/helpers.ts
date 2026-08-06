import { UserRole } from '@/types';

import { API_BASE_URL } from '@/config/env';

export function getFileUrl(file?: { path?: string; url?: string } | string): string {
  if (!file) return '#';

  if (typeof file === 'object') {
    if (file.url) return file.url;
    return getFileUrl(file.path);
  }

  if (file.startsWith('http://') || file.startsWith('https://')) return file;

  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
  const normalized = file.startsWith('/') ? file : `/${file}`;
  return `${apiOrigin}${normalized}`;
}

export function formatDocumentFieldLabel(
  fieldKey: string,
  labels?: Record<string, string>
): string {
  if (labels?.[fieldKey]) return labels[fieldKey];

  return fieldKey
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'staff':
      return '/staff/dashboard';
    case 'vendor':
      return '/vendor/dashboard';
    default:
      return '/';
  }
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function generateFieldKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

/** User-facing message when the agent requests additional documents via email. */
export function formatNeedMoreFilesMessage(needMoreFiles: string): string {
  const trimmed = needMoreFiles.trim();
  if (!trimmed) return '';

  if (trimmed.toLowerCase().includes('missing')) {
    return `${trimmed}. We informed via email. Please have a look.`;
  }

  return `${trimmed} missing. We informed via email. Please have a look.`;
}
