import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.contact };

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
