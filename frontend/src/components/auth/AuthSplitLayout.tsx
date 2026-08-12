'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Image from 'next/image';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { BRAND } from '@/config/data';

const VALUE_PROPS = [
  {
    icon: PrecisionManufacturingOutlinedIcon,
    title: 'Pipeline Expertise',
    description: '22,000+ km of coated pipelines across 25 countries worldwide.',
  },
  {
    icon: SecurityOutlinedIcon,
    title: 'Secure Vendor Onboarding',
    description: 'Compliant qualification workflows with end-to-end data protection.',
  },
  {
    icon: PublicOutlinedIcon,
    title: 'Global Operations',
    description: 'Supporting procurement teams across 12 countries and counting.',
  },
] as const;

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  heroImage: string;
  heroTitle?: string;
  heroSubtitle?: string;
  portalLabel?: string;
  contentMaxWidth?: number | string;
  formAlign?: 'start' | 'center';
}

export default function AuthSplitLayout({
  children,
  heroImage,
  heroTitle = 'Partner with a Global Energy Leader',
  heroSubtitle = `Join ${BRAND.fullName}'s qualified vendor network and collaborate on world-class pipeline, engineering, and energy projects.`,
  portalLabel = BRAND.portalTagline,
  contentMaxWidth = 480,
  formAlign = 'center',
}: AuthSplitLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          flex: { md: '0 0 48%' },
          minHeight: { xs: 280, sm: 360, md: '100vh' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundImage: `linear-gradient(160deg, rgba(13, 71, 161, 0.92) 0%, rgba(21, 101, 192, 0.82) 45%, rgba(0, 0, 0, 0.55) 100%), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          p: { xs: 3, sm: 4, md: 5 },
        }}
      >
        <Box>
          <Box
            component={Link}
            href="/"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Image src="/favicon.svg" alt={BRAND.fullName} width={40} height={40} />
            <Box>
              <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
                {BRAND.fullName}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                {portalLabel}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ my: { xs: 3, md: 4 } }}>
          <Typography
            variant="overline"
            sx={{ letterSpacing: 3, opacity: 0.9, fontWeight: 600, display: 'block', mb: 1 }}
          >
            Trusted Partner Network
          </Typography>
          <Typography
            variant="h4"
            component="h1"
            fontWeight={700}
            sx={{ mb: 2, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }, lineHeight: 1.2 }}
          >
            {heroTitle}
          </Typography>
          <Typography
            variant="body1"
            sx={{ opacity: 0.9, lineHeight: 1.7, maxWidth: 480, fontSize: { xs: '0.9rem', md: '1rem' } }}
          >
            {heroSubtitle}
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: 'none', sm: 'grid' },
            gridTemplateColumns: { sm: '1fr', lg: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
            <Box
              key={title}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <Icon sx={{ fontSize: 28, mb: 1, opacity: 0.95 }} />
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {title}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85, lineHeight: 1.6, display: 'block' }}>
                {description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
          minHeight: { xs: 'auto', md: '100vh' },
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 4, md: 5 },
            pt: { xs: 2, md: 3 },
          }}
        >
          <Typography
            component={Link}
            href="/"
            variant="body2"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'text.secondary',
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': { color: 'primary.main' },
            }}
          >
            <ArrowBackOutlinedIcon sx={{ fontSize: 18 }} />
            Back to Home
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: { xs: 'flex-start', md: formAlign === 'center' ? 'center' : 'flex-start' },
            justifyContent: 'center',
            px: { xs: 2, sm: 4, md: 5 },
            py: { xs: 3, md: 4 },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: contentMaxWidth }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
