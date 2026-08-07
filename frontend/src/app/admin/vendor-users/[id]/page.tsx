'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import VendorProfileEditor from '@/components/vendors/VendorProfileEditor';
import { AppCard, LoadingSkeleton } from '@/components/common';
import { adminNavItems } from '@/config/navigation';
import { useUserStore } from '@/stores/userStore';
import { userService } from '@/services/userService';
import { formatDate } from '@/utils/helpers';
import { USER_STATUS_COLORS } from '@/utils/constants';
import { VendorProfile } from '@/types';

export default function VendorUserDetailPage() {
  const params = useParams();
  const userId = (params?.id ?? '') as string;
  const { vendorUsers, isLoading, fetchVendorUsers } = useUserStore();
  const [profile, setProfile] = useState<VendorProfile | null>(null);

  useEffect(() => {
    fetchVendorUsers();
  }, [fetchVendorUsers]);

  useEffect(() => {
    const vendor = vendorUsers.find((v) => v.userId === userId);
    if (vendor) setProfile(vendor);
  }, [vendorUsers, userId]);

  return (
    <AuthGuard allowedRoles={['admin']}>
      <DashboardLayout
        navItems={adminNavItems}
        title="Admin Portal"
        pageTitle={profile?.companyName ?? 'Vendor Details'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Vendor Users', href: '/admin/vendor-users' },
          { label: profile?.companyName ?? 'Details' },
        ]}
      >
        {isLoading || !profile ? (
          <LoadingSkeleton variant="detail" />
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <AppCard title="Company Information">
                <VendorProfileEditor
                  profile={profile}
                  onSave={async (data) => {
                    const updated = await userService.updateVendor(userId, data);
                    setProfile(updated);
                    await fetchVendorUsers();
                  }}
                />
              </AppCard>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <AppCard title="Account Status">
                <Field label="Registered" value={formatDate(profile.createdAt)} />
                <Chip
                  label={profile.status}
                  color={USER_STATUS_COLORS[profile.status] ?? 'default'}
                  sx={{ mt: 1, textTransform: 'capitalize' }}
                />
              </AppCard>
            </Grid>
          </Grid>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={500}>{value}</Typography>
    </div>
  );
}
