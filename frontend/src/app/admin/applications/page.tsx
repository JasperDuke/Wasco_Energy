'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ApplicationFilterBar from '@/components/applications/ApplicationFilterBar';
import { AppDataGrid, ApplicationStatusChip, LoadingSkeleton } from '@/components/common';
import { adminNavItems } from '@/config/navigation';
import { useApplicationsStore } from '@/stores/applicationsStore';
import { formatDate } from '@/utils/helpers';
import { Application } from '@/types';

export default function AdminApplicationsPage() {
  const router = useRouter();
  const {
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
          onClick={() => router.push(`/admin/applications/${params.id}`)}
        />,
      ],
    },
  ];

  return (
    <AuthGuard allowedRoles={['admin']}>
      <DashboardLayout
        navItems={adminNavItems}
        title="Admin Portal"
        pageTitle="Applications"
        pageSubtitle="Manage all vendor applications"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
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
            onRowClick={(params) => router.push(`/admin/applications/${params.id}`)}
          />
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
