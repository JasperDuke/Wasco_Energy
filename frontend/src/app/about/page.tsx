'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PublicLayout from '@/components/layouts/PublicLayout';
import PageHero from '@/components/public/PageHero';
import SectionHeading from '@/components/public/SectionHeading';
import { PUBLIC_IMAGES } from '@/config/publicContent';
import { BRAND } from '@/config/data';

export default function AboutPage() {
  return (
    <PublicLayout>
      <PageHero
        overline="About Us"
        title="Building a Sustainable Energy Future Since 1999"
        subtitle={`${BRAND.legalName} is a globally integrated infrastructure group listed on Bursa Malaysia, delivering excellence across pipeline services, energy fabrication, and bioenergy.`}
        image={PUBLIC_IMAGES.about}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.9 }}>
              {BRAND.legalName} has emerged as a leading global energy solutions provider with operations
              spanning 12 countries. Our diverse workforce of over 5,000 employees representing
              more than 40 nationalities brings world-class expertise to every project.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.9 }}>
              From coating more than 22,000 km of pipelines globally to fabricating biomass turbines
              and boilers, we deliver integrated solutions that meet the evolving needs of the
              global energy industry.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                borderRadius: 3,
                minHeight: 320,
                backgroundImage: `url(${PUBLIC_IMAGES.globalOps})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: 'grey.200',
                boxShadow: '0 16px 48px rgba(0,0,0,0.1)',
              }}
            />
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ backgroundColor: 'background.default', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <SectionHeading title="Our Mission, Vision & Values" align="left" />
          <Grid container spacing={3} alignItems="stretch">
            {[
              {
                title: 'Our Mission',
                text: 'Deliver innovative energy solutions that create lasting value for stakeholders, communities, and the environment.',
              },
              {
                title: 'Our Vision',
                text: 'Be the preferred integrated energy partner globally, recognised for excellence, integrity, and sustainability.',
              },
              {
                title: 'Our Values',
                text: 'Safety, integrity, excellence, teamwork, and sustainability guide every decision across our operations.',
              },
            ].map((item) => (
              <Grid key={item.title} size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
                <Card sx={{ height: '100%', width: '100%' }}>
                  <CardContent sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom color="primary.main">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {item.text}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading
          title="Sustainability at Our Core"
          subtitle="We go beyond business goals — integrating economic, environmental, and social considerations into our strategy, with a commitment to net zero operational emissions by 2026."
        />
        <Grid container spacing={3} alignItems="stretch">
          {[
            { stat: '2026', label: 'Net Zero Operational Emissions Target' },
            { stat: '12', label: 'Countries of Operation' },
            { stat: '40+', label: 'Nationalities in Our Workforce' },
            { stat: '5,000+', label: 'Employees Worldwide' },
          ].map((item) => (
            <Grid key={item.label} size={{ xs: 6, md: 3 }} sx={{ display: 'flex' }}>
              <Card
                variant="outlined"
                sx={{
                  textAlign: 'center',
                  py: 2,
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography variant="h4" fontWeight={700} color="primary.main">
                    {item.stat}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ minHeight: { xs: 40, md: 48 }, display: 'flex', alignItems: 'center' }}
                  >
                    {item.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </PublicLayout>
  );
}
