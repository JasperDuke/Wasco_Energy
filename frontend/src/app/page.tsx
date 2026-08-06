'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from 'next/link';
import PublicLayout from '@/components/layouts/PublicLayout';
import HeroCarousel from '@/components/public/HeroCarousel';
import StatBar from '@/components/public/StatBar';
import SectionHeading from '@/components/public/SectionHeading';
import ImageFeatureCard from '@/components/public/ImageFeatureCard';
import CallToAction from '@/components/public/CallToAction';
import {
  HERO_SLIDES,
  COMPANY_STATS,
  BUSINESS_DIVISIONS,
  PUBLIC_IMAGES,
} from '@/config/publicContent';
import EnergySavingsLeafOutlinedIcon from '@mui/icons-material/EnergySavingsLeafOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

const vendorBenefits = [
  {
    icon: <HandshakeOutlinedIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
    title: 'Global Project Access',
    description: 'Partner on energy infrastructure projects across Asia-Pacific, Middle East, and beyond.',
  },
  {
    icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
    title: 'Fair & Transparent Evaluation',
    description: 'Standardized qualification with AI-assisted assessment and clear procurement criteria.',
  },
  {
    icon: <SpeedOutlinedIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
    title: 'Digital Onboarding',
    description: 'Register, submit documents, and track your application status entirely online.',
  },
  {
    icon: <EnergySavingsLeafOutlinedIcon sx={{ fontSize: 36, color: 'primary.main' }} />,
    title: 'Sustainability Focus',
    description: 'Join a group committed to net zero operational emissions and responsible operations.',
  },
];

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroCarousel slides={HERO_SLIDES} />
      <StatBar stats={COMPANY_STATS} />

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <SectionHeading
          overline="Our Divisions"
          title="Integrated Energy Solutions Across the Value Chain"
          subtitle="From pipeline coating and corrosion protection to world-class fabrication and bioenergy — Wasco delivers comprehensive solutions for the global energy industry."
        />
        <Grid container spacing={3}>
          {BUSINESS_DIVISIONS.map((division) => (
            <Grid key={division.title} size={{ xs: 12, md: 4 }}>
              <ImageFeatureCard {...division} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          backgroundImage: `linear-gradient(90deg, rgba(245,247,250,0.97) 55%, rgba(245,247,250,0.85) 100%), url(${PUBLIC_IMAGES.globalOps})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ letterSpacing: 2 }}>
                About Wasco Berhad
              </Typography>
              <Typography variant="h3" fontWeight={700} sx={{ mt: 1, mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                Vision With Action for a Globally Sustainable Future
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.9 }}>
                Since 1999, Wasco Berhad has emerged as a leading global energy solutions provider,
                listed on the Main Market of Bursa Malaysia Securities Berhad. With a diverse
                workforce exceeding 5,000 employees across 40+ nationalities, our operations span
                12 countries worldwide.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.9 }}>
                We prioritise two strategic pillars — Energy Services and Bioenergy Services —
                delivering value to stakeholders through responsible, sustainable operations.
              </Typography>
              <Button component={Link} href="/about" variant="contained" size="large">
                Discover Our Story
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(13,71,161,0.15)',
                  minHeight: 360,
                  backgroundImage: `url(${PUBLIC_IMAGES.about})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <SectionHeading
          overline="Sustainability"
          title="Committed to Net Zero Operational Emissions by 2026"
          subtitle="Carbon reduction initiatives are embedded across our global operations — balancing economic performance with environmental and social responsibility."
        />
        <Grid container spacing={3}>
          {[
            'Renewable energy integration across facilities',
            'Emissions monitoring and reduction programmes',
            'Responsible supply chain and vendor standards',
            'Community and stakeholder engagement',
          ].map((item) => (
            <Grid key={item} size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined" sx={{ height: '100%', borderColor: 'primary.light' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2.5 }}>
                  <EnergySavingsLeafOutlinedIcon color="primary" />
                  <Typography variant="body1" fontWeight={500}>{item}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ backgroundColor: 'background.default', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <SectionHeading
            overline="Vendor Portal"
            title="Why Partner With Wasco Energy?"
            subtitle="Our streamlined vendor qualification portal connects qualified suppliers with world-class energy projects."
          />
          <Grid container spacing={3}>
            {vendorBenefits.map((benefit) => (
              <Grid key={benefit.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ height: '100%', p: 1 }}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{benefit.icon}</Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {benefit.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <CallToAction
        title="Ready to Join Our Supplier Network?"
        subtitle="Register on our vendor portal, complete your qualification profile, and start partnering on projects that power the world."
        primaryLabel="Register as Vendor"
        primaryHref="/register"
        secondaryLabel="Contact Procurement"
        secondaryHref="/contact"
        image={PUBLIC_IMAGES.vendor}
      />
    </PublicLayout>
  );
}
