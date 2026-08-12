'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import PublicLayout from '@/components/layouts/PublicLayout';
import PageHero from '@/components/public/PageHero';
import { AppTextField, AppButton } from '@/components/common';
import { PUBLIC_IMAGES } from '@/config/publicContent';
import { BRAND } from '@/config/data';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      <PageHero
        title="Contact Us"
        subtitle="Get in touch with our procurement team"
        image={PUBLIC_IMAGES.contact}
        height={{ xs: 280, md: 360 }}
      />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Office</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Level 12, {BRAND.buildingName}<br />
              Jalan Ampang<br />
              50450 Kuala Lumpur, Malaysia
            </Typography>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 3 }}>Email</Typography>
            <Typography variant="body2" color="text.secondary">{BRAND.contactEmail}</Typography>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 3 }}>Phone</Typography>
            <Typography variant="body2" color="text.secondary">+60 3 1234 5678</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            {submitted ? (
              <Alert severity="success">
                Thank you for your message. Our team will get back to you shortly.
              </Alert>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <AppTextField label="First Name" required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <AppTextField label="Last Name" required />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <AppTextField label="Email" type="email" required />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <AppTextField label="Subject" required />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <AppTextField label="Message" multiline rows={4} required />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <AppButton type="submit" variant="contained">Send Message</AppButton>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </PublicLayout>
  );
}
