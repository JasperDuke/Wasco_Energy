'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { AppTextField, AppButton } from '@/components/common';
import { VendorProfile } from '@/types';

export type VendorProfileFormData = Pick<
  VendorProfile,
  | 'companyName'
  | 'vendorGroup'
  | 'parentCompany'
  | 'supplyingEntity'
  | 'businessRegistrationNumber'
  | 'country'
  | 'address'
  | 'website'
  | 'companyEmail'
  | 'companyPhone'
  | 'primaryContactName'
  | 'primaryContactEmail'
  | 'primaryContactPhone'
  | 'vendorCategory'
  | 'products'
  | 'companyDescription'
>;

interface VendorProfileEditorProps {
  profile: VendorProfile;
  onSave: (data: VendorProfileFormData) => Promise<void>;
  readOnly?: boolean;
}

export default function VendorProfileEditor({
  profile,
  onSave,
  readOnly = false,
}: VendorProfileEditorProps) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<VendorProfileFormData>();

  useEffect(() => {
    reset({
      companyName: profile.companyName,
      vendorGroup: profile.vendorGroup,
      parentCompany: profile.parentCompany ?? '',
      supplyingEntity: profile.supplyingEntity ?? '',
      businessRegistrationNumber: profile.businessRegistrationNumber,
      country: profile.country,
      address: profile.address,
      website: profile.website ?? '',
      companyEmail: profile.companyEmail,
      companyPhone: profile.companyPhone,
      primaryContactName: profile.primaryContactName,
      primaryContactEmail: profile.primaryContactEmail,
      primaryContactPhone: profile.primaryContactPhone,
      vendorCategory: profile.vendorCategory,
      products: profile.products,
      companyDescription: profile.companyDescription ?? '',
    });
  }, [profile, reset]);

  const onSubmit = async (data: VendorProfileFormData) => {
    setSaving(true);
    setError(null);
    try {
      await onSave(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update vendor profile');
    } finally {
      setSaving(false);
    }
  };

  if (readOnly) {
    return (
      <Grid container spacing={2}>
        {[
          ['Company Name', profile.companyName],
          ['Vendor Group', profile.vendorGroup],
          ['Parent Company', profile.parentCompany ?? '—'],
          ['Supplying Entity', profile.supplyingEntity ?? '—'],
          ['Registration No.', profile.businessRegistrationNumber],
          ['Country', profile.country],
          ['Address', profile.address],
          ['Website', profile.website ?? '—'],
          ['Company Email', profile.companyEmail],
          ['Company Phone', profile.companyPhone],
          ['Primary Contact', profile.primaryContactName],
          ['Contact Email', profile.primaryContactEmail],
          ['Contact Phone', profile.primaryContactPhone],
          ['Category', profile.vendorCategory],
          ['Products', profile.products],
          ['Description', profile.companyDescription ?? '—'],
        ].map(([label, value]) => (
          <Grid key={label} size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="body2" fontWeight={500}>{value}</Typography>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {saved && <Alert severity="success" sx={{ mb: 2 }}>Vendor details updated.</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField label="Company Name" required {...register('companyName', { required: true })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField label="Vendor Group" required {...register('vendorGroup', { required: true })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField label="Parent Company" {...register('parentCompany')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField label="Supplying Entity" {...register('supplyingEntity')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField label="Registration No." required {...register('businessRegistrationNumber', { required: true })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField label="Country" required {...register('country', { required: true })} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AppTextField label="Address" required {...register('address', { required: true })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField label="Website" {...register('website')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField label="Company Email" required {...register('companyEmail', { required: true })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField label="Company Phone" required {...register('companyPhone', { required: true })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField label="Primary Contact" required {...register('primaryContactName', { required: true })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField label="Contact Email" required {...register('primaryContactEmail', { required: true })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField label="Contact Phone" required {...register('primaryContactPhone', { required: true })} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField label="Category" required {...register('vendorCategory', { required: true })} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AppTextField label="Products" required {...register('products', { required: true })} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AppTextField label="Description" multiline rows={3} {...register('companyDescription')} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AppButton type="submit" variant="contained" disabled={saving}>
            {saving ? 'Saving...' : 'Save Vendor Details'}
          </AppButton>
        </Grid>
      </Grid>
    </form>
  );
}
