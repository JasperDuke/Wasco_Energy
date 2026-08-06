'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { AppTextField, AppButton, AppCard, LoadingSkeleton } from '@/components/common';
import { vendorNavItems } from '@/config/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useVendorStore } from '@/stores/vendorStore';

interface ProfileForm {
  address: string;
  companyPhone: string;
  website: string;
  companyDescription: string;
  products: string;
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={500}>{value}</Typography>
      <Divider sx={{ mt: 1.5 }} />
    </Box>
  );
}

export default function CompanyProfilePage() {
  const user = useAuthStore((s) => s.user);
  const { profile, isLoading, fetchProfile, updateProfile } = useVendorStore();
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, reset } = useForm<ProfileForm>();

  useEffect(() => {
    if (user) fetchProfile(user.id);
  }, [user, fetchProfile]);

  useEffect(() => {
    if (profile) {
      reset({
        address: profile.address,
        companyPhone: profile.companyPhone,
        website: profile.website ?? '',
        companyDescription: profile.companyDescription ?? '',
        products: profile.products,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return;
    await updateProfile(user.id, data);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AuthGuard allowedRoles={['vendor']}>
      <DashboardLayout
        navItems={vendorNavItems}
        title="Vendor Portal"
        pageTitle="Company Profile"
        pageSubtitle="Manage your company information"
        breadcrumbs={[
          { label: 'Dashboard', href: '/vendor/dashboard' },
          { label: 'Company Profile' },
        ]}
      >
        {saved && <Alert severity="success" sx={{ mb: 2 }}>Profile updated successfully.</Alert>}

        {isLoading || !profile ? (
          <LoadingSkeleton variant="form" count={4} />
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <AppCard title="Editable Information">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <AppTextField label="Address" {...register('address')} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <AppTextField label="Phone" {...register('companyPhone')} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <AppTextField label="Website" {...register('website')} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <AppTextField label="Company Description" multiline rows={3} {...register('companyDescription')} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <AppTextField label="Products" multiline rows={2} {...register('products')} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <AppButton type="submit" variant="contained">Save Changes</AppButton>
                    </Grid>
                  </Grid>
                </form>
              </AppCard>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <AppCard title="Read-Only Information">
                <ReadOnlyField label="Company Name" value={profile.companyName} />
                <ReadOnlyField label="Vendor Group" value={profile.vendorGroup} />
                <ReadOnlyField label="Parent Company" value={profile.parentCompany ?? '—'} />
                <ReadOnlyField label="Supplying Entity" value={profile.supplyingEntity ?? '—'} />
                <ReadOnlyField label="Registration No." value={profile.businessRegistrationNumber} />
                <ReadOnlyField label="Category" value={profile.vendorCategory} />
              </AppCard>
            </Grid>
          </Grid>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
