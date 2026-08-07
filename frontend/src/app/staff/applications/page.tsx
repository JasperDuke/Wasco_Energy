'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ApplicationFilterBar from '@/components/applications/ApplicationFilterBar';
import { AppDataGrid, ApplicationStatusChip, LoadingSkeleton } from '@/components/common';
import { staffNavItems } from '@/config/navigation';
import { useApplicationsStore } from '@/stores/applicationsStore';
import {
  hasPendingReviewApplications,
  usePollingRefresh,
} from '@/hooks/usePollingRefresh';
import { formatDate } from '@/utils/helpers';
import { Application } from '@/types';

export default function StaffApplicationsPage() {
  const router = useRouter();
  const {
    applications,
    isLoading,
    statusFilter,
    searchQuery,
    vendorFilter,
    setStatusFilter,
    setSearchQuery,
    setVendorFilter,
    fetchAll,
    getFiltered,
  } = useApplicationsStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  usePollingRefresh(
    hasPendingReviewApplications(applications),
    () => fetchAll({ silent: true })
  );

  const filtered = getFiltered();
  const vendors = [...new Map(filtered.map((a) => [a.vendorId, { id: a.vendorId, name: a.vendorName }])).values()];

  const columns: GridColDef[] = [
    { field: 'caseId', headerName: 'Case ID', flex: 1, minWidth: 140 },
    { field: 'vendorName', headerName: 'Vendor', flex: 1.2, minWidth: 180 },
    { field: 'vendorCategory', headerName: 'Category', flex: 1, minWidth: 140 },
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
    { field: 'recommendation', headerName: 'Recommendation', width: 150 },
    {
      field: 'overallScore',
      headerName: 'Overall Score',
      width: 120,
      valueGetter: (_v, row: Application) => row.assessment?.overallScore ?? '—',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          icon={<VisibilityOutlinedIcon />}
          label="View"
          onClick={() => router.push(`/staff/applications/${params.id}`)}
        />,
      ],
    },
  ];

  return (
    <AuthGuard allowedRoles={['staff', 'admin']}>
      <DashboardLayout
        navItems={staffNavItems}
        title="Staff Portal"
        pageTitle="Applications"
        pageSubtitle="Review vendor qualification applications"
        breadcrumbs={[
          { label: 'Dashboard', href: '/staff/dashboard' },
          { label: 'Applications' },
        ]}
      >
        <ApplicationFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          vendorFilter={vendorFilter}
          onVendorChange={setVendorFilter}
          vendors={vendors}
        />

        {isLoading ? (
          <LoadingSkeleton variant="table" count={8} />
        ) : (
          <AppDataGrid
            rows={filtered.map((a) => ({ ...a, submittedAt: a.submittedAt ?? '' }))}
            columns={columns}
            onRowClick={(params) => router.push(`/staff/applications/${params.id}`)}
          />
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
