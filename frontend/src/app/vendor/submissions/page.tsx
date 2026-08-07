'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { AppDataGrid, ApplicationStatusChip, LoadingSkeleton } from '@/components/common';
import { vendorNavItems } from '@/config/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useApplicationStore } from '@/stores/applicationStore';
import {
  hasPendingReviewApplications,
  usePollingRefresh,
} from '@/hooks/usePollingRefresh';
import { formatDate } from '@/utils/helpers';
import { Application } from '@/types';

export default function MySubmissionsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { applications, isLoading, fetchByVendor } = useApplicationStore();

  useEffect(() => {
    if (user) fetchByVendor(user.id);
  }, [user, fetchByVendor]);

  usePollingRefresh(
    !!user && hasPendingReviewApplications(applications),
    () => fetchByVendor(user?.id, { silent: true })
  );

  const columns: GridColDef[] = [
    { field: 'caseId', headerName: 'Case ID', flex: 1, minWidth: 150 },
    {
      field: 'submittedAt',
      headerName: 'Submitted Date',
      flex: 1,
      minWidth: 130,
      valueFormatter: (value: string) => (value ? formatDate(value) : '—'),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => <ApplicationStatusChip status={params.value} />,
    },
    { field: 'recommendation', headerName: 'Recommendation', flex: 1, minWidth: 140 },
    {
      field: 'overallScore',
      headerName: 'Overall Score',
      width: 120,
      valueGetter: (_v, row: Application) => row.assessment?.overallScore ?? '—',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Action',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          icon={<VisibilityOutlinedIcon />}
          label="View"
          onClick={() => router.push(`/vendor/submissions/${params.id}`)}
        />,
      ],
    },
  ];

  const rows = applications.map((a) => ({
    ...a,
    submittedAt: a.submittedAt ?? '',
  }));

  return (
    <AuthGuard allowedRoles={['vendor']}>
      <DashboardLayout
        navItems={vendorNavItems}
        title="Vendor Portal"
        pageTitle="My Submissions"
        pageSubtitle="View and track your qualification applications"
        breadcrumbs={[
          { label: 'Dashboard', href: '/vendor/dashboard' },
          { label: 'My Submissions' },
        ]}
      >
        {isLoading ? (
          <LoadingSkeleton variant="table" count={5} />
        ) : (
          <AppDataGrid
            rows={rows}
            columns={columns}
            onRowClick={(params) => router.push(`/vendor/submissions/${params.id}`)}
          />
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
