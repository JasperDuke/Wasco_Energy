import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.submissionDetails };

export default function VendorSubmissionDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
