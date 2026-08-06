'use client';

import { useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { StatisticCard, LoadingSkeleton } from '@/components/common';
import { adminNavItems } from '@/config/navigation';
import { useDashboardStore } from '@/stores/dashboardStore';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

export default function AdminDashboardPage() {
  const { stats, isLoading, fetchAdminStats } = useDashboardStore();

  useEffect(() => {
    fetchAdminStats();
  }, [fetchAdminStats]);

  return (
    <AuthGuard allowedRoles={['admin']}>
      <DashboardLayout
        navItems={adminNavItems}
        title="Admin Portal"
        pageTitle="Dashboard"
        pageSubtitle="System administration overview"
        breadcrumbs={[{ label: 'Dashboard' }]}
      >
        {isLoading ? (
          <LoadingSkeleton count={6} />
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatisticCard title="Total Applications" value={stats?.totalApplications ?? 0} icon={<AssignmentOutlinedIcon />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatisticCard title="Processing" value={stats?.processing ?? 0} icon={<HourglassEmptyOutlinedIcon />} color="warning.main" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatisticCard title="Assessment Completed" value={stats?.assessmentCompleted ?? 0} icon={<CheckCircleOutlineIcon />} color="success.main" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatisticCard title="Need Clarification" value={stats?.needClarification ?? 0} icon={<HelpOutlineIcon />} color="warning.dark" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatisticCard title="Approved" value={stats?.approved ?? 0} icon={<ThumbUpOutlinedIcon />} color="success.dark" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatisticCard title="Pending Vendors" value={stats?.pendingVendors ?? 0} icon={<PeopleOutlinedIcon />} color="info.main" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatisticCard title="Total Vendors" value={stats?.totalVendors ?? 0} icon={<PeopleOutlinedIcon />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatisticCard title="Active Staff" value={stats?.totalStaff ?? 0} icon={<BadgeOutlinedIcon />} />
            </Grid>
          </Grid>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
