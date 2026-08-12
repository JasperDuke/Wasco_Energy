import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.applicationReview };

export default function StaffApplicationDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
