'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ApplicationDetailView from '@/components/applications/ApplicationDetailView';
import { LoadingSkeleton } from '@/components/common';
import { vendorNavItems } from '@/config/navigation';
import { useApplicationStore } from '@/stores/applicationStore';

export default function VendorSubmissionDetailPage() {
  const params = useParams();
  const id = (params?.id ?? '') as string;
  const { currentApplication, isLoading, fetchById, uploadClarification } = useApplicationStore();

  useEffect(() => {
    if (id) fetchById(id);
  }, [id, fetchById]);

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
            onUploadClarification={async (fieldKey, files) => {
              await uploadClarification(id, fieldKey, files);
            }}
          />
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
