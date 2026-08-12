import type { Metadata } from 'next';
import { BRAND } from './data';

export const SITE_ICONS: NonNullable<Metadata['icons']> = {
  icon: [{ url: BRAND.logo, type: 'image/png' }],
  shortcut: BRAND.logo,
  apple: BRAND.logo,
};

export function createPageMetadata(title: string): Metadata {
  return {
    title,
    icons: SITE_ICONS,
  };
}
