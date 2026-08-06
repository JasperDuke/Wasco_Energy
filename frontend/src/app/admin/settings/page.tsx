'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { AppTextField, AppButton, AppCard, LoadingSpinner } from '@/components/common';
import { adminNavItems } from '@/config/navigation';
import { settingsService } from '@/services/settingsService';
import { SystemSettings } from '@/types';

interface SettingsInput {
  baseUrl: string;
  accessToken: string;
  agentId: string;
  apiPublicUrl?: string;
}
import { formatDate } from '@/utils/helpers';

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsInput>();

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await settingsService.get();
        setSettings(data);
        if (data) {
          reset({
            baseUrl: data.baseUrl,
            agentId: data.agentId,
            apiPublicUrl: data.apiPublicUrl,
            accessToken: '',
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: SettingsInput) => {
    try {
      setSaving(true);
      setError('');
      const updated = await settingsService.update(data);
      setSettings(updated);
      setSuccess('Settings saved successfully');
      reset({ ...data, accessToken: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard allowedRoles={['admin']}>
      <DashboardLayout
        navItems={adminNavItems}
        title="Admin Portal"
        pageTitle="System Settings"
        pageSubtitle="Configure Atenxion AI platform integration"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'System Settings' },
        ]}
      >
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <AppCard title="Atenxion Integration">
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Configure the connection to the Atenxion AI platform. Only one settings
                  record exists in the system. These credentials will be used to trigger
                  AI processing for vendor applications.
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <AppTextField
                        label="Trigger Webhook URL"
                        placeholder="https://agent.atenxion.ai/webhook/your-trigger-endpoint"
                        {...register('baseUrl', { required: 'Trigger webhook URL is required' })}
                        error={!!errors.baseUrl}
                        helperText={
                          errors.baseUrl?.message ??
                          'Full Atenxion trigger URL — we POST directly to this address (include path, not just host)'
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <AppTextField
                        label="API Public URL"
                        placeholder="http://localhost:5000"
                        {...register('apiPublicUrl')}
                        error={!!errors.apiPublicUrl}
                        helperText={
                          errors.apiPublicUrl?.message ??
                          'Public URL of this backend for attachment links and Origin header on Atenxion trigger calls'
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <AppTextField
                        label="Agent ID"
                        placeholder="Enter Atenxion Agent ID"
                        {...register('agentId', { required: 'Agent ID is required' })}
                        error={!!errors.agentId}
                        helperText={errors.agentId?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <AppTextField
                        label="Access Token"
                        type="password"
                        placeholder={
                          settings?.hasAccessToken
                            ? '••••••••••••••••'
                            : 'Enter access token'
                        }
                        {...register('accessToken', {
                          required: settings?.hasAccessToken ? false : 'Access token is required',
                        })}
                        error={!!errors.accessToken}
                        helperText={
                          errors.accessToken?.message ??
                          (settings?.hasAccessToken
                            ? 'Leave blank to keep existing token. Sent as Authorization header value (no Bearer prefix).'
                            : 'Sent as Authorization header value (no Bearer prefix).')
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <AppButton type="submit" variant="contained" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Settings'}
                      </AppButton>
                    </Grid>
                  </Grid>
                </Box>
              </AppCard>
            </Grid>

            {settings && (
              <Grid size={{ xs: 12, md: 4 }}>
                <AppCard title="Current Configuration">
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Trigger URL:</strong> {settings.baseUrl}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Agent ID:</strong> {settings.agentId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>API Public URL:</strong>{' '}
                    {settings.apiPublicUrl || 'Not set (uses env default)'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Token:</strong>{' '}
                    {settings.hasAccessToken ? 'Configured' : 'Not set'}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 2 }}>
                    Last updated: {formatDate(settings.updatedAt)}
                  </Typography>
                </AppCard>
              </Grid>
            )}
          </Grid>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
