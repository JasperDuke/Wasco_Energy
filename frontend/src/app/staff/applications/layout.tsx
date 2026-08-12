import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.applications };

export default function StaffApplicationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
