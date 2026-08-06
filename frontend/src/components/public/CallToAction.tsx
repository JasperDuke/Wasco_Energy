'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

interface CallToActionProps {
  title: string;
  subtitle: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  image?: string;
}

export default function CallToAction({
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  image,
}: CallToActionProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        py: { xs: 8, md: 10 },
        color: 'white',
        backgroundImage: image
          ? `linear-gradient(135deg, rgba(13, 71, 161, 0.92), rgba(21, 101, 192, 0.85)), url(${image})`
          : undefined,
        backgroundColor: image ? undefined : 'primary.main',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
          {title}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.92, mb: 4, lineHeight: 1.8, maxWidth: 560, mx: 'auto' }}>
          {subtitle}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href={primaryHref}
            variant="contained"
            size="large"
            sx={{ backgroundColor: 'white', color: 'primary.main', px: 4, '&:hover': { backgroundColor: 'grey.100' } }}
          >
            {primaryLabel}
          </Button>
          {secondaryLabel && secondaryHref && (
            <Button
              component={Link}
              href={secondaryHref}
              variant="outlined"
              size="large"
              sx={{ borderColor: 'white', color: 'white', px: 4, '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              {secondaryLabel}
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
}
