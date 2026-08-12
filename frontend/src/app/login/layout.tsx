import type { Metadata } from 'next';
import { PAGE_TITLES } from '@/config/data';

export const metadata: Metadata = { title: PAGE_TITLES.login };

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
