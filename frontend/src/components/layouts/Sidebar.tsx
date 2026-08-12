'use client';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { BrandLogo } from '@/components/common';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useAuthStore } from '@/stores/authStore';
import { NavItem } from '@/types';
import { isNavItemActive } from '@/utils/navigation';
import { BRAND } from '@/config/data';

const DRAWER_WIDTH = 260;

const iconMap: Record<string, React.ReactElement> = {
  dashboard: <DashboardOutlinedIcon />,
  forms: <DescriptionOutlinedIcon />,
  users: <PeopleOutlinedIcon />,
  settings: <SettingsOutlinedIcon />,
  builder: <BuildOutlinedIcon />,
  applications: <AssignmentOutlinedIcon />,
  new: <AddCircleOutlineIcon />,
  profile: <BusinessOutlinedIcon />,
  staff: <BadgeOutlinedIcon />,
};

interface SidebarProps {
  navItems: NavItem[];
  title?: string;
}

export default function Sidebar({ navItems, title = BRAND.portalName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, close } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const allHrefs = navItems.map((item) => item.href);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 2, py: 2 }}>
        <Box
          component={Link}
          href="/"
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', mb: 0.5 }}
        >
          <BrandLogo size={32} alt={BRAND.name} />
          <Box>
            <Typography variant="subtitle2" fontWeight={700} color="primary.main" lineHeight={1.2}>
              {BRAND.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider />

      <List sx={{ flex: 1, px: 1, py: 1.5 }}>
        {navItems.map((item) => {
          const isActive = isNavItemActive(pathname, item.href, allHrefs);
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive}
                onClick={close}
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                    '&:hover': { backgroundColor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {iconMap[item.icon] ?? <DashboardOutlinedIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: isActive ? 600 : 400, fontSize: '0.9rem' }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        {user && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5, px: 0.5 }}>
            Signed in as <strong>{user.firstName}</strong>
          </Typography>
        )}
        <Button
          component={Link}
          href="/"
          variant="outlined"
          fullWidth
          startIcon={<HomeOutlinedIcon />}
          sx={{ mb: 1, justifyContent: 'flex-start', py: 1 }}
        >
          Visit Website
        </Button>
        <Button
          variant="text"
          color="error"
          fullWidth
          startIcon={<LogoutOutlinedIcon />}
          onClick={handleLogout}
          sx={{ justifyContent: 'flex-start', py: 1 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={close}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export { DRAWER_WIDTH };
