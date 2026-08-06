'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { SxProps, Theme } from '@mui/material/styles';

interface AppCardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function AppCard({ title, subtitle, action, children, sx }: AppCardProps) {
  return (
    <Card sx={sx}>
      {(title || subtitle) && (
        <CardHeader title={title} subheader={subtitle} action={action} />
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
