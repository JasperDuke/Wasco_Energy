'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import PageHeader from '@/components/common/PageHeader';
import { BreadcrumbItem, NavItem } from '@/types';
import { DRAWER_WIDTH } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
  pageTitle: string;
  pageSubtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
}

export default function DashboardLayout({
  children,
  navItems,
  title,
  pageTitle,
  pageSubtitle,
  breadcrumbs,
  action,
}: DashboardLayoutProps) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Sidebar navItems={navItems} title={title} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minWidth: 0,
        }}
      >
        <MobileHeader />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <PageHeader
            title={pageTitle}
            subtitle={pageSubtitle}
            breadcrumbs={breadcrumbs}
            action={action}
          />
          {children}
        </Container>
      </Box>
    </Box>
  );
}
