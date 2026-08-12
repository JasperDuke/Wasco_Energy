import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.vendorUsers };

export default function AdminVendorUsersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
