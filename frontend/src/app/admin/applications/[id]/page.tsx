'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ApplicationDetailView from '@/components/applications/ApplicationDetailView';
import { LoadingSkeleton } from '@/components/common';
import { adminNavItems } from '@/config/navigation';
import { useApplicationStore } from '@/stores/applicationStore';
import { applicationService } from '@/services/applicationService';
import { userService } from '@/services/userService';
import { isPendingReviewStatus, usePollingRefresh } from '@/hooks/usePollingRefresh';
import { HumanValidationAction } from '@/types';

export default function AdminApplicationDetailPage() {
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

  const handleValidation = async (action: HumanValidationAction, notes?: string) => {
    await applicationService.humanValidation(id, action, notes);
    await fetchById(id);
  };

  const showValidation =
    currentApplication?.status === 'assessment_completed' ||
    currentApplication?.status === 'need_clarification';

  return (
    <AuthGuard allowedRoles={['admin']}>
      <DashboardLayout
        navItems={adminNavItems}
        title="Admin Portal"
        pageTitle="Application Review"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Applications', href: '/admin/applications' },
          { label: currentApplication?.caseId ?? 'Details' },
        ]}
      >
        {isLoading || !currentApplication ? (
          <LoadingSkeleton variant="detail" />
        ) : (
          <ApplicationDetailView
            application={currentApplication}
            mode="admin"
            vendorProfile={currentApplication.vendorProfile}
            showHumanValidation={showValidation}
            onHumanValidation={handleValidation}
            onUpdateVendorProfile={async (data) => {
              await userService.updateVendor(currentApplication.vendorId, data, id);
              await fetchById(id);
            }}
            onDelete={async () => {
              await applicationService.delete(id);
              router.push('/admin/applications');
            }}
          />
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
