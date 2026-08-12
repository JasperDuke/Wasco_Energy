import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.settings };

export default function AdminSettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
