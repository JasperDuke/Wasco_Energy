import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.vendorDetails };

export default function AdminVendorDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
