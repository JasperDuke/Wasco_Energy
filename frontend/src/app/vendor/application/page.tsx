'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VendorApplicationRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/vendor/submissions');
  }, [router]);
  return null;
}
