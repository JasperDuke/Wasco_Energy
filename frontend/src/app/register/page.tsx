'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { AppTextField, AppSelect, AppButton, BrandLogo } from '@/components/common';
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';
import { authService } from '@/services/authService';
import { VendorRegistration } from '@/types';
import { VENDOR_GROUPS, VENDOR_CATEGORIES, COUNTRIES } from '@/utils/constants';
import { PUBLIC_IMAGES } from '@/config/publicContent';
import { BRAND } from '@/config/data';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<VendorRegistration>();

  const password = watch('password');

  const onSubmit = async (data: VendorRegistration) => {
    try {
      setLoading(true);
      setError('');
      const message = await authService.register(data);
      setSuccess(message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      heroImage={PUBLIC_IMAGES.vendor}
      heroTitle="Join Our Qualified Vendor Network"
      heroSubtitle={`Register your company to begin the ${BRAND.fullName} vendor qualification process and unlock opportunities across our global energy projects.`}
      contentMaxWidth={720}
      formAlign="start"
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 24px rgba(21, 101, 192, 0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <BrandLogo size={36} />
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="primary.main" lineHeight={1.2}>
              {BRAND.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Vendor Registration
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <PersonAddOutlinedIcon color="primary" fontSize="small" />
          <Typography variant="h5" fontWeight={700}>
            Register as Vendor
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Complete the form below to submit your company for qualification review.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>Registration Successful</Typography>
            <Typography variant="body2">{success}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <Link href="/login" style={{ color: 'inherit', fontWeight: 600 }}>Sign in here</Link>
            </Typography>
          </Alert>
        )}

        {!success && (
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <SectionTitle>Company Information</SectionTitle>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField label="Company Name" {...register('companyName', { required: 'Required' })} error={!!errors.companyName} helperText={errors.companyName?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller name="vendorGroup" control={control} rules={{ required: 'Required' }} render={({ field }) => (
                  <AppSelect label="Vendor Group" value={field.value ?? ''} onChange={field.onChange} options={VENDOR_GROUPS.map((v) => ({ value: v, label: v }))} error={!!errors.vendorGroup} helperText={errors.vendorGroup?.message} />
                )} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField label="Parent Company" {...register('parentCompany')} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField label="Supplying Entity" {...register('supplyingEntity')} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField label="Business Registration Number" {...register('businessRegistrationNumber', { required: 'Required' })} error={!!errors.businessRegistrationNumber} helperText={errors.businessRegistrationNumber?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller name="country" control={control} rules={{ required: 'Required' }} render={({ field }) => (
                  <AppSelect label="Country" value={field.value ?? ''} onChange={field.onChange} options={COUNTRIES.map((c) => ({ value: c, label: c }))} error={!!errors.country} helperText={errors.country?.message} />
                )} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <AppTextField label="Address" {...register('address', { required: 'Required' })} error={!!errors.address} helperText={errors.address?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField label="Website" {...register('website')} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField label="Company Email" type="email" {...register('companyEmail', { required: 'Required' })} error={!!errors.companyEmail} helperText={errors.companyEmail?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField label="Company Phone" {...register('companyPhone', { required: 'Required' })} error={!!errors.companyPhone} helperText={errors.companyPhone?.message} />
              </Grid>
            </Grid>

            <SectionTitle>Primary Contact</SectionTitle>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField label="Primary Contact Name" {...register('primaryContactName', { required: 'Required' })} error={!!errors.primaryContactName} helperText={errors.primaryContactName?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField label="Primary Contact Email" type="email" {...register('primaryContactEmail', { required: 'Required' })} error={!!errors.primaryContactEmail} helperText={errors.primaryContactEmail?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField label="Primary Contact Phone" {...register('primaryContactPhone', { required: 'Required' })} error={!!errors.primaryContactPhone} helperText={errors.primaryContactPhone?.message} />
              </Grid>
            </Grid>

            <SectionTitle>Business Details</SectionTitle>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller name="vendorCategory" control={control} rules={{ required: 'Required' }} render={({ field }) => (
                  <AppSelect label="Vendor Category" value={field.value ?? ''} onChange={field.onChange} options={VENDOR_CATEGORIES.map((c) => ({ value: c, label: c }))} error={!!errors.vendorCategory} helperText={errors.vendorCategory?.message} />
                )} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField label="Products" {...register('products', { required: 'Required' })} error={!!errors.products} helperText={errors.products?.message} />
              </Grid>
            </Grid>

            <SectionTitle>Account Security</SectionTitle>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField label="Password" type="password" {...register('password', { required: 'Required', minLength: { value: 8, message: 'Min 8 characters' } })} error={!!errors.password} helperText={errors.password?.message} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <AppTextField label="Confirm Password" type="password" {...register('confirmPassword', { required: 'Required', validate: (v) => v === password || 'Passwords do not match' })} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <AppButton type="submit" variant="contained" disabled={loading} fullWidth size="large" sx={{ py: 1.25 }}>
                  {loading ? 'Registering...' : 'Register as Vendor'}
                </AppButton>
              </Grid>
            </Grid>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#1565C0', fontWeight: 600 }}>Sign In</Link>
        </Typography>
      </Paper>
    </AuthSplitLayout>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: 'primary.main' }}>
      {children}
    </Typography>
  );
}
