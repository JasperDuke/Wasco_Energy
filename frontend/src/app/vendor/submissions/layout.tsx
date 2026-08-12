import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.mySubmissions };

export default function VendorSubmissionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
