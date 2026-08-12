import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';
import { createPageMetadata } from '@/config/metadata';

export const metadata: Metadata = createPageMetadata(PAGE_TITLES.register);

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
