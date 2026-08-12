import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.dashboard };

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
