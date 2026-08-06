import { NavItem } from '@/types';

export const vendorNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/vendor/dashboard', icon: 'dashboard' },
  { label: 'New Submission', href: '/vendor/submissions/new', icon: 'new' },
  { label: 'My Submissions', href: '/vendor/submissions', icon: 'applications' },
  { label: 'Company Profile', href: '/vendor/profile', icon: 'profile' },
];

export const staffNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/staff/dashboard', icon: 'dashboard' },
  { label: 'Applications', href: '/staff/applications', icon: 'applications' },
];

export const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard' },
  { label: 'Vendor Users', href: '/admin/vendor-users', icon: 'users' },
  { label: 'Staff Users', href: '/admin/staff-users', icon: 'staff' },
  { label: 'Applications', href: '/admin/applications', icon: 'applications' },
  { label: 'Form Builder', href: '/admin/form-builder', icon: 'builder' },
  { label: 'System Settings', href: '/admin/settings', icon: 'settings' },
];
