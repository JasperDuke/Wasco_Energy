import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';
import { createPageMetadata } from '@/config/metadata';

export const metadata: Metadata = createPageMetadata(PAGE_TITLES.login);

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
