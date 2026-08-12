import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.about };

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
