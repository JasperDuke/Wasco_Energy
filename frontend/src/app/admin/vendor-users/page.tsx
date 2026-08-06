'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { AppDataGrid, ConfirmDialog, LoadingSkeleton } from '@/components/common';
import StatusChip from '@/components/common/StatusChip';
import { adminNavItems } from '@/config/navigation';
import { useUserStore } from '@/stores/userStore';
import { formatDate } from '@/utils/helpers';
import { VendorProfile } from '@/types';

export default function AdminVendorUsersPage() {
  const router = useRouter();
  const { vendorUsers, isLoading, fetchVendorUsers, approveVendor, deactivateVendor } = useUserStore();
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'deactivate'; userId: string; name: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchVendorUsers();
  }, [fetchVendorUsers]);

  const handleAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      if (confirmAction.type === 'approve') {
        await approveVendor(confirmAction.userId);
      } else {
        await deactivateVendor(confirmAction.userId);
      }
      setConfirmAction(null);
    } finally {
      setActionLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'companyName', headerName: 'Company', flex: 1.2, minWidth: 180 },
    { field: 'vendorGroup', headerName: 'Vendor Group', flex: 1, minWidth: 140 },
    { field: 'primaryContactName', headerName: 'Contact Person', flex: 1, minWidth: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      width: 130,
      valueFormatter: (value: string) => formatDate(value),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => {
        const row = params.row as VendorProfile;
        const actions = [
          <GridActionsCellItem
            key="view"
            icon={<VisibilityOutlinedIcon />}
            label="View"
            onClick={() => router.push(`/admin/vendor-users/${row.userId}`)}
          />,
        ];
        if (row.status === 'pending') {
          actions.push(
            <GridActionsCellItem
              key="approve"
              icon={<CheckCircleOutlineIcon />}
              label="Approve"
              onClick={() => setConfirmAction({ type: 'approve', userId: row.userId, name: row.companyName })}
            />
          );
        }
        if (row.status === 'approved') {
          actions.push(
            <GridActionsCellItem
              key="deactivate"
              icon={<BlockOutlinedIcon />}
              label="Deactivate"
              onClick={() => setConfirmAction({ type: 'deactivate', userId: row.userId, name: row.companyName })}
            />
          );
        }
        return actions;
      },
    },
  ];

  return (
    <AuthGuard allowedRoles={['admin']}>
      <DashboardLayout
        navItems={adminNavItems}
        title="Admin Portal"
        pageTitle="Vendor Users"
        pageSubtitle="Manage registered vendor accounts"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Vendor Users' },
        ]}
      >
        {isLoading ? (
          <LoadingSkeleton variant="table" count={6} />
        ) : (
          <AppDataGrid rows={vendorUsers} columns={columns} getRowId={(row) => row.id as string} />
        )}

        <ConfirmDialog
          open={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleAction}
          title={confirmAction?.type === 'approve' ? 'Approve Vendor' : 'Deactivate Vendor'}
          message={
            confirmAction?.type === 'approve'
              ? `Approve ${confirmAction.name}? They will be able to log in and submit applications.`
              : `Deactivate ${confirmAction?.name}? They will no longer be able to access the portal.`
          }
          confirmLabel={confirmAction?.type === 'approve' ? 'Approve' : 'Deactivate'}
          confirmColor={confirmAction?.type === 'approve' ? 'success' : 'error'}
          loading={actionLoading}
        />
      </DashboardLayout>
    </AuthGuard>
  );
}
