'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useSidebarStore } from '@/stores/sidebarStore';

export default function MobileHeader() {
  const { toggle } = useSidebarStore();

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        display: { xs: 'block', md: 'none' },
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Toolbar>
        <IconButton edge="start" onClick={toggle} aria-label="Open menu">
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
