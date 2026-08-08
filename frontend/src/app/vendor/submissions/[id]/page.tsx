'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ApplicationDetailView from '@/components/applications/ApplicationDetailView';
import { LoadingSkeleton } from '@/components/common';
import { vendorNavItems } from '@/config/navigation';
import { useApplicationStore } from '@/stores/applicationStore';
import { applicationService } from '@/services/applicationService';
import { isPendingReviewStatus, usePollingRefresh } from '@/hooks/usePollingRefresh';

export default function VendorSubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id ?? '') as string;
  const { currentApplication, isLoading, fetchById } = useApplicationStore();

  useEffect(() => {
    if (id) fetchById(id);
  }, [id, fetchById]);

  usePollingRefresh(
    !!id && isPendingReviewStatus(currentApplication?.status),
    () => fetchById(id, { silent: true })
  );

  return (
    <AuthGuard allowedRoles={['vendor']}>
      <DashboardLayout
        navItems={vendorNavItems}
        title="Vendor Portal"
        pageTitle="Submission Details"
        breadcrumbs={[
          { label: 'Dashboard', href: '/vendor/dashboard' },
          { label: 'My Submissions', href: '/vendor/submissions' },
          { label: 'Details' },
        ]}
      >
        {isLoading || !currentApplication ? (
          <LoadingSkeleton variant="detail" />
        ) : (
          <ApplicationDetailView
            application={currentApplication}
            mode="vendor"
            onDelete={async () => {
              await applicationService.delete(id);
              router.push('/vendor/submissions');
            }}
          />
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
