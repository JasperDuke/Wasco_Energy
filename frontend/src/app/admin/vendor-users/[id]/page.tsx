'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { AppCard, LoadingSkeleton } from '@/components/common';
import { adminNavItems } from '@/config/navigation';
import { useUserStore } from '@/stores/userStore';
import { formatDate } from '@/utils/helpers';
import { USER_STATUS_COLORS } from '@/utils/constants';

export default function VendorUserDetailPage() {
  const params = useParams();
  const userId = (params?.id ?? '') as string;
  const { vendorUsers, isLoading, fetchVendorUsers } = useUserStore();

  useEffect(() => {
    fetchVendorUsers();
  }, [fetchVendorUsers]);

  const vendor = vendorUsers.find((v) => v.userId === userId);

  return (
    <AuthGuard allowedRoles={['admin']}>
      <DashboardLayout
        navItems={adminNavItems}
        title="Admin Portal"
        pageTitle={vendor?.companyName ?? 'Vendor Details'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Vendor Users', href: '/admin/vendor-users' },
          { label: vendor?.companyName ?? 'Details' },
        ]}
      >
        {isLoading || !vendor ? (
          <LoadingSkeleton variant="detail" />
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <AppCard title="Company Information">
                <Grid container spacing={2}>
                  {[
                    ['Company Name', vendor.companyName],
                    ['Vendor Group', vendor.vendorGroup],
                    ['Parent Company', vendor.parentCompany ?? '—'],
                    ['Supplying Entity', vendor.supplyingEntity ?? '—'],
                    ['Registration No.', vendor.businessRegistrationNumber],
                    ['Country', vendor.country],
                    ['Address', vendor.address],
                    ['Website', vendor.website ?? '—'],
                    ['Category', vendor.vendorCategory],
                    ['Products', vendor.products],
                  ].map(([label, value]) => (
                    <Grid key={label} size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary">{label}</Typography>
                      <Typography variant="body2" fontWeight={500}>{value}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </AppCard>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <AppCard title="Contact & Status">
                <Field label="Primary Contact" value={vendor.primaryContactName} />
                <Field label="Email" value={vendor.primaryContactEmail} />
                <Field label="Phone" value={vendor.primaryContactPhone} />
                <Field label="Registered" value={formatDate(vendor.createdAt)} />
                <Chip
                  label={vendor.status}
                  color={USER_STATUS_COLORS[vendor.status] ?? 'default'}
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
