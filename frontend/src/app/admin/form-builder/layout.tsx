import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.formBuilder };

export default function AdminFormBuilderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
