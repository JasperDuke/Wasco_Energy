'use client';

import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { useAuthStore } from '@/stores/authStore';
import { getDashboardPath } from '@/utils/helpers';
import { BRAND } from '@/config/data';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Industries', href: '/industries' },
  { label: 'Become a Vendor', href: '/become-vendor' },
  { label: 'Contact', href: '/contact' },
];

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  const portalHref = user ? getDashboardPath(user.role) : '/login';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255,255,255,0.95)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 0.5 }}>
            <Box
              component={Link}
              href="/"
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', mr: 4 }}
            >
              <Image src="/favicon.svg" alt={BRAND.fullName} width={36} height={36} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1.1 }}>
                  {BRAND.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  {BRAND.portalTagline}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 0.5, flexGrow: 1 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  color={pathname === link.href ? 'primary' : 'inherit'}
                  sx={{
                    fontWeight: pathname === link.href ? 600 : 400,
                    fontSize: '0.9rem',
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, ml: 'auto' }}>
              {isAuthenticated && user ? (
                <Button
                  component={Link}
                  href={portalHref}
                  variant="contained"
                  size="small"
                  startIcon={<DashboardOutlinedIcon />}
                >
                  My Portal
                </Button>
              ) : (
                <>
                  <Button component={Link} href="/login" variant="outlined" size="small">
                    Login
                  </Button>
                  <Button component={Link} href="/register" variant="contained" size="small">
                    Register
                  </Button>
                </>
              )}
            </Box>

            <IconButton
              sx={{ display: { xs: 'flex', lg: 'none' }, ml: 'auto' }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280, pt: 2 }}>
          <List>
            {navLinks.map((link) => (
              <ListItemButton
                key={link.href}
                component={Link}
                href={link.href}
                selected={pathname === link.href}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
            {isAuthenticated && user ? (
              <ListItemButton component={Link} href={portalHref} onClick={() => setMobileOpen(false)}>
                <ListItemText primary="My Portal" />
              </ListItemButton>
            ) : (
              <>
                <ListItemButton component={Link} href="/login" onClick={() => setMobileOpen(false)}>
                  <ListItemText primary="Login" />
                </ListItemButton>
                <ListItemButton component={Link} href="/register" onClick={() => setMobileOpen(false)}>
                  <ListItemText primary="Register" />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          background: 'linear-gradient(180deg, #0D47A1 0%, #0a3d8f 100%)',
          color: 'primary.contrastText',
          py: 6,
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 4 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Image src="/favicon.svg" alt="" width={32} height={32} />
                <Typography variant="h6" fontWeight={700}>
                  {BRAND.fullName}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.85, maxWidth: 420, lineHeight: 1.8 }}>
                A leading global energy solutions provider delivering pipeline services, engineering
                & fabrication, and bioenergy solutions across 12 countries worldwide.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Quick Links
              </Typography>
              {navLinks.map((link) => (
                <Typography
                  key={link.href}
                  component={Link}
                  href={link.href}
                  variant="body2"
                  display="block"
                  sx={{ color: 'inherit', opacity: 0.8, textDecoration: 'none', mb: 0.75, '&:hover': { opacity: 1 } }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Level 12, {BRAND.buildingName}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Kuala Lumpur, Malaysia
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mt: 1 }}>
                {BRAND.contactEmail}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                +60 3 1234 5678
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ display: 'block', mt: 4, opacity: 0.6 }}>
            © {new Date().getFullYear()} {BRAND.legalFullName}. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
