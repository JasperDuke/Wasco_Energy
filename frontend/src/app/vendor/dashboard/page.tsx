'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  AppCard,
  ApplicationStatusChip,
  StatisticCard,
  LoadingSkeleton,
  AppButton,
} from '@/components/common';
import { vendorNavItems } from '@/config/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useApplicationStore } from '@/stores/applicationStore';
import { useVendorStore } from '@/stores/vendorStore';
import { formatDate, formatNeedMoreFilesMessage } from '@/utils/helpers';

export default function VendorDashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { applications, isLoading, fetchByVendor } = useApplicationStore();
  const { profile, fetchProfile } = useVendorStore();

  useEffect(() => {
    if (user) {
      fetchByVendor(user.id);
      fetchProfile(user.id);
    }
  }, [user, fetchByVendor, fetchProfile]);

  const currentSubmission = applications.find((a) =>
    ['processing', 'proposal_under_review', 'need_clarification', 'submitted'].includes(a.status)
  );

  const statusCounts = {
    pending: applications.filter((a) => a.status === 'pending').length,
    processing: applications.filter((a) =>
      ['processing', 'proposal_under_review'].includes(a.status)
    ).length,
    completed: applications.filter((a) => a.status === 'assessment_completed').length,
    clarification: applications.filter((a) => a.status === 'need_clarification').length,
  };

  return (
    <AuthGuard allowedRoles={['vendor']}>
      <DashboardLayout
        navItems={vendorNavItems}
        title="Vendor Portal"
        pageTitle="Dashboard"
        pageSubtitle={`Welcome back, ${user?.firstName ?? ''}`}
        breadcrumbs={[{ label: 'Dashboard' }]}
        action={
          <AppButton variant="contained" onClick={() => router.push('/vendor/submissions/new')}>
            New Submission
          </AppButton>
        }
      >
        {isLoading ? (
          <LoadingSkeleton count={4} />
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 3, alignItems: 'stretch' }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex' }}>
                <StatisticCard
                  title="Company Status"
                  value={(profile?.status ?? user?.status ?? 'pending').replace(/^\w/, (c) => c.toUpperCase())}
                  color="success.main"
                  sx={{ width: '100%' }}
                  footer={
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {profile?.companyName ?? '—'}
                    </Typography>
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex' }}>
                <StatisticCard title="Processing" value={statusCounts.processing} sx={{ width: '100%' }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex' }}>
                <StatisticCard
                  title="Assessment Completed"
                  value={statusCounts.completed}
                  color="success.main"
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: 'flex' }}>
                <StatisticCard
                  title="Need Clarification"
                  value={statusCounts.clarification}
                  color="warning.main"
                  sx={{ width: '100%' }}
                />
              </Grid>
            </Grid>

            {currentSubmission && (
              <AppCard title="Current Submission" sx={{ mb: 3 }}>
                {currentSubmission.assessment?.needMoreFiles && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      {formatNeedMoreFilesMessage(currentSubmission.assessment.needMoreFiles)}
                    </Typography>
                  </Alert>
                )}
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Typography variant="body2" color="text.secondary">Case ID</Typography>
                    <Typography variant="body1" fontWeight={600}>{currentSubmission.caseId}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <ApplicationStatusChip status={currentSubmission.status} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Typography variant="body2" color="text.secondary">Submitted</Typography>
                    <Typography variant="body2">
                      {currentSubmission.submittedAt ? formatDate(currentSubmission.submittedAt) : '—'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <AppButton
                      variant="outlined"
                      onClick={() => router.push(`/vendor/submissions/${currentSubmission.id}`)}
                    >
                      View Details
                    </AppButton>
                  </Grid>
                </Grid>
              </AppCard>
            )}

            <AppCard title="Recent Submissions">
              {applications.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No submissions yet. Start your vendor qualification application.
                </Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Case ID</TableCell>
                      <TableCell>Submitted</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.slice(0, 5).map((app) => (
                      <TableRow key={app.id} hover>
                        <TableCell>{app.caseId}</TableCell>
                        <TableCell>{app.submittedAt ? formatDate(app.submittedAt) : '—'}</TableCell>
                        <TableCell><ApplicationStatusChip status={app.status} /></TableCell>
                        <TableCell>{app.assessment?.overallScore ?? '—'}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => router.push(`/vendor/submissions/${app.id}`)}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </AppCard>
          </>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
