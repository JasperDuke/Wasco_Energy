'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  overline?: string;
  height?: { xs: number; md: number };
  align?: 'left' | 'center';
}

export default function PageHero({
  title,
  subtitle,
  image,
  overline,
  height = { xs: 320, md: 420 },
  align = 'left',
}: PageHeroProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: height,
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `linear-gradient(135deg, rgba(13, 71, 161, 0.88) 0%, rgba(21, 101, 192, 0.72) 50%, rgba(0, 0, 0, 0.45) 100%), url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: 760, mx: align === 'center' ? 'auto' : 0, textAlign: align }}>
          {overline && (
            <Typography
              variant="overline"
              sx={{ letterSpacing: 3, opacity: 0.9, fontWeight: 600 }}
            >
              {overline}
            </Typography>
          )}
          <Typography
            variant="h2"
            component="h1"
            fontWeight={700}
            sx={{ mt: overline ? 1 : 0, mb: 2, fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.15 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="h6"
              sx={{ opacity: 0.92, fontWeight: 400, lineHeight: 1.7, fontSize: { xs: '1rem', md: '1.2rem' } }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
}
