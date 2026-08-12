import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.companyProfile };

export default function VendorProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
