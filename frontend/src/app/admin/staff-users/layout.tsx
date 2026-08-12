import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.staffUsers };

export default function AdminStaffUsersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
