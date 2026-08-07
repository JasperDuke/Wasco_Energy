'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ApplicationDetailView from '@/components/applications/ApplicationDetailView';
import { LoadingSkeleton } from '@/components/common';
import { staffNavItems } from '@/config/navigation';
import { useApplicationStore } from '@/stores/applicationStore';
import { applicationService } from '@/services/applicationService';
import { userService } from '@/services/userService';
import { isPendingReviewStatus, usePollingRefresh } from '@/hooks/usePollingRefresh';
import { HumanValidationAction } from '@/types';

export default function StaffApplicationDetailPage() {
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
    <AuthGuard allowedRoles={['staff', 'admin']}>
      <DashboardLayout
        navItems={staffNavItems}
        title="Staff Portal"
        pageTitle="Application Review"
        breadcrumbs={[
          { label: 'Dashboard', href: '/staff/dashboard' },
          { label: 'Applications', href: '/staff/applications' },
          { label: currentApplication?.caseId ?? 'Details' },
        ]}
      >
        {isLoading || !currentApplication ? (
          <LoadingSkeleton variant="detail" />
        ) : (
          <ApplicationDetailView
            application={currentApplication}
            mode="staff"
            vendorProfile={currentApplication.vendorProfile}
            showHumanValidation={showValidation}
            onHumanValidation={handleValidation}
            onUpdateVendorProfile={async (data) => {
              await userService.updateVendor(currentApplication.vendorId, data, id);
              await fetchById(id);
            }}
            onDelete={async () => {
              await applicationService.delete(id);
              router.push('/staff/applications');
            }}
          />
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
