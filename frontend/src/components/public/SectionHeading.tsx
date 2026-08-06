'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface SectionHeadingProps {
  overline?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({
  overline,
  title,
  subtitle,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <Box sx={{ textAlign: align, mb: { xs: 4, md: 6 }, maxWidth: align === 'center' ? 720 : undefined, mx: align === 'center' ? 'auto' : 0 }}>
      {overline && (
        <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ letterSpacing: 2 }}>
          {overline}
        </Typography>
      )}
      <Typography variant="h3" fontWeight={700} sx={{ mt: overline ? 1 : 0, mb: subtitle ? 1.5 : 0, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
