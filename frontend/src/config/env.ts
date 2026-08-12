import { APP_METADATA, BRAND } from './data';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4014/api';

export const APP_NAME = BRAND.fullName;
export const APP_DESCRIPTION = BRAND.portalTagline;
export { APP_METADATA };
