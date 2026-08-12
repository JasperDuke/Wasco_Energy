import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.industries };

export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
