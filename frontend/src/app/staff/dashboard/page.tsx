'use client';

import { useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { StatisticCard, LoadingSkeleton } from '@/components/common';
import { staffNavItems } from '@/config/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';

export default function StaffDashboardPage() {
  const { stats, isLoading, fetchStaffStats } = useDashboardStore();

  useEffect(() => {
    fetchStaffStats();
  }, [fetchStaffStats]);

  return (
    <AuthGuard allowedRoles={['staff', 'admin']}>
      <DashboardLayout
        navItems={staffNavItems}
        title="Staff Portal"
        pageTitle="Dashboard"
        pageSubtitle="Procurement review overview"
        breadcrumbs={[{ label: 'Dashboard' }]}
      >
        {isLoading ? (
          <LoadingSkeleton count={6} />
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatisticCard title="Total Applications" value={stats?.totalApplications ?? 0} icon={<AssignmentOutlinedIcon />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatisticCard title="Processing" value={stats?.processing ?? 0} icon={<HourglassEmptyOutlinedIcon />} color="warning.main" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatisticCard title="Assessment Completed" value={stats?.assessmentCompleted ?? 0} icon={<CheckCircleOutlineIcon />} color="success.main" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatisticCard title="Need Clarification" value={stats?.needClarification ?? 0} icon={<HelpOutlineIcon />} color="warning.dark" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatisticCard title="Approved" value={stats?.approved ?? 0} icon={<ThumbUpOutlinedIcon />} color="success.dark" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatisticCard title="Rejected" value={stats?.rejected ?? 0} icon={<ThumbDownOutlinedIcon />} color="error.main" />
            </Grid>
          </Grid>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
