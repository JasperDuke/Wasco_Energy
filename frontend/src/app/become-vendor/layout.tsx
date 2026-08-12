import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.becomeVendor };

export default function BecomeVendorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
