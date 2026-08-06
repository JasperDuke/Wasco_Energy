'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid2';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  AppDataGrid,
  AppButton,
  AppTextField,
  AppDialog,
  ConfirmDialog,
  LoadingSkeleton,
} from '@/components/common';
import { adminNavItems } from '@/config/navigation';
import { useUserStore } from '@/stores/userStore';
import { formatDate } from '@/utils/helpers';
import { StaffUser } from '@/types';
import Chip from '@mui/material/Chip';

interface StaffForm {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

export default function AdminStaffUsersPage() {
  const { staffUsers, isLoading, fetchStaffUsers, createStaff, updateStaff, deactivateStaff } = useUserStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<StaffForm>();

  useEffect(() => {
    fetchStaffUsers();
  }, [fetchStaffUsers]);

  const openCreate = () => {
    setEditingStaff(null);
    reset({ firstName: '', lastName: '', email: '', department: 'Procurement' });
    setDialogOpen(true);
  };

  const openEdit = (staff: StaffUser) => {
    setEditingStaff(staff);
    reset({
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      department: staff.department,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: StaffForm) => {
    setSaving(true);
    try {
      if (editingStaff) {
        await updateStaff(editingStaff.id, data);
      } else {
        await createStaff({ ...data, isActive: true });
      }
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 200 },
    { field: 'department', headerName: 'Department', flex: 1 },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 110,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'default'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 120,
      valueFormatter: (value: string) => formatDate(value),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => {
        const row = params.row as StaffUser;
        return [
          <GridActionsCellItem key="edit" icon={<EditOutlinedIcon />} label="Edit" onClick={() => openEdit(row)} />,
          row.isActive ? (
            <GridActionsCellItem key="deactivate" icon={<BlockOutlinedIcon />} label="Deactivate" onClick={() => setDeactivateId(row.id)} />
          ) : (
            <GridActionsCellItem key="activate" icon={<EditOutlinedIcon />} label="Activate" onClick={() => updateStaff(row.id, { isActive: true })} />
          ),
        ];
      },
    },
  ];

  return (
    <AuthGuard allowedRoles={['admin']}>
      <DashboardLayout
        navItems={adminNavItems}
        title="Admin Portal"
        pageTitle="Staff Users"
        pageSubtitle="Manage procurement staff accounts"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Staff Users' },
        ]}
        action={
          <AppButton variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Add Staff
          </AppButton>
        }
      >
        {isLoading ? (
          <LoadingSkeleton variant="table" count={5} />
        ) : (
          <AppDataGrid rows={staffUsers} columns={columns} />
        )}

        <AppDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={editingStaff ? 'Edit Staff User' : 'Create Staff User'}
          actions={
            <>
              <AppButton onClick={() => setDialogOpen(false)}>Cancel</AppButton>
              <AppButton variant="contained" onClick={handleSubmit(onSubmit)} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </AppButton>
            </>
          }
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><AppTextField label="First Name" {...register('firstName', { required: true })} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><AppTextField label="Last Name" {...register('lastName', { required: true })} /></Grid>
            <Grid size={{ xs: 12 }}><AppTextField label="Email" type="email" {...register('email', { required: true })} /></Grid>
            <Grid size={{ xs: 12 }}><AppTextField label="Department" {...register('department', { required: true })} /></Grid>
          </Grid>
        </AppDialog>

        <ConfirmDialog
          open={!!deactivateId}
          onClose={() => setDeactivateId(null)}
          onConfirm={async () => {
            if (deactivateId) await deactivateStaff(deactivateId);
            setDeactivateId(null);
          }}
          title="Deactivate Staff User"
          message="This staff member will no longer be able to access the portal."
          confirmLabel="Deactivate"
          confirmColor="error"
        />
      </DashboardLayout>
    </AuthGuard>
  );
}
