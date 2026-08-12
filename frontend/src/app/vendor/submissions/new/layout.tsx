import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.newSubmission };

export default function VendorNewSubmissionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
