'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from 'next/link';
import PublicLayout from '@/components/layouts/PublicLayout';
import PageHero from '@/components/public/PageHero';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { PUBLIC_IMAGES } from '@/config/publicContent';
import { BRAND } from '@/config/data';

const steps = [
  'Register your company on our vendor portal',
  'Complete the dynamic onboarding form',
  'Upload required qualification documents',
  'Await automated verification and review',
  `Receive approval and start partnering with ${BRAND.name}`,
];

export default function BecomeVendorPage() {
  return (
    <PublicLayout>
      <PageHero
        title="Become a Vendor"
        subtitle="Join our global network of qualified suppliers"
        image={PUBLIC_IMAGES.vendor}
        height={{ xs: 280, md: 360 }}
      />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Why Partner With Us?
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {BRAND.fullName} works with hundreds of qualified vendors worldwide.
              Our procurement process is transparent, efficient, and designed to
              give every supplier a fair opportunity.
            </Typography>
            <Button component={Link} href="/register" variant="contained" size="large">
              Start Registration
            </Button>
          </Box>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Registration Process
              </Typography>
              {steps.map((step, index) => (
                <Box key={step} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                  <CheckCircleOutlineIcon color="primary" sx={{ mt: 0.3 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      Step {index + 1}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </PublicLayout>
  );
}
