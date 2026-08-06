'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DynamicFormRenderer from '@/components/forms/DynamicFormRenderer';
import { AppButton, AppCard, LoadingSkeleton } from '@/components/common';
import { vendorNavItems } from '@/config/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useApplicationStore } from '@/stores/applicationStore';
import { useVendorStore } from '@/stores/vendorStore';
import { formService } from '@/services/formService';
import { DynamicForm, UploadedFile } from '@/types';

export default function NewSubmissionPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { profile, fetchProfile } = useVendorStore();
  const { submitApplication } = useApplicationStore();
  const [form, setForm] = useState<DynamicForm | null>(null);
  const [fileValues, setFileValues] = useState<Record<string, UploadedFile[]>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit } = useForm<Record<string, unknown>>();

  useEffect(() => {
    if (user) fetchProfile(user.id);
    formService.getActive().then((f) => {
      setForm(f);
      setLoading(false);
    });
  }, [user, fetchProfile]);

  const onSubmit = async (formData: Record<string, unknown>) => {
    if (!user || !profile || !form) return;

    const fileFields = form.fields.filter((f) => f.type === 'file');
    const missingFiles = fileFields
      .filter((f) => f.required)
      .filter((f) => !(fileValues[f.key]?.length));

    if (missingFiles.length > 0) {
      setError(`Please upload required files: ${missingFiles.map((f) => f.label).join(', ')}`);
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const app = await submitApplication(
        user.id,
        profile.companyName,
        profile.vendorCategory,
        form.id,
        formData,
        fileValues
      );
      setSuccess(true);
      setTimeout(() => router.push(`/vendor/submissions/${app.id}`), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const primaryFields = form?.fields.filter((f) => f.type !== 'file') ?? [];
  const documentFields = form?.fields.filter((f) => f.type === 'file') ?? [];

  if (success) {
    return (
      <AuthGuard allowedRoles={['vendor']}>
        <DashboardLayout
          navItems={vendorNavItems}
          title="Vendor Portal"
          pageTitle="Submission Successful"
          breadcrumbs={[
            { label: 'Dashboard', href: '/vendor/dashboard' },
            { label: 'New Submission' },
          ]}
        >
          <Alert severity="success">
            <Typography variant="subtitle1" fontWeight={600}>Submission Successful</Typography>
            <Typography variant="body2">Status: Processing — Proposal Under Review</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Your application is now under review. You will be notified when the assessment is complete.
            </Typography>
          </Alert>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={['vendor']}>
      <DashboardLayout
        navItems={vendorNavItems}
        title="Vendor Portal"
        pageTitle="New Submission"
        pageSubtitle={form?.description ?? 'Complete the vendor onboarding form'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/vendor/dashboard' },
          { label: 'New Submission' },
        ]}
      >
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <LoadingSkeleton variant="form" count={6} />
        ) : !form ? (
          <Alert severity="warning">No active onboarding form configured. Please contact administrator.</Alert>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <AppCard title="Primary Information" sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Provide your company and contact details below.
              </Typography>
              <DynamicFormRenderer
                fields={primaryFields}
                control={control}
                fileValues={fileValues}
                onFileChange={(key, files) =>
                  setFileValues((prev) => ({ ...prev, [key]: files }))
                }
              />
            </AppCard>

            <AppCard title="Supporting Documents" sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload required qualification documents. Files are stored under your vendor and submission folder for review.
              </Typography>
              <DynamicFormRenderer
                fields={documentFields}
                control={control}
                fileValues={fileValues}
                onFileChange={(key, files) =>
                  setFileValues((prev) => ({ ...prev, [key]: files }))
                }
              />
            </AppCard>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <AppButton variant="outlined" onClick={() => router.push('/vendor/submissions')}>
                Cancel
              </AppButton>
              <AppButton type="submit" variant="contained" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Application'}
              </AppButton>
            </Box>
          </form>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
