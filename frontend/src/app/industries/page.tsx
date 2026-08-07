'use client';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import PublicLayout from '@/components/layouts/PublicLayout';
import PageHero from '@/components/public/PageHero';
import SectionHeading from '@/components/public/SectionHeading';
import ImageFeatureCard from '@/components/public/ImageFeatureCard';
import { PUBLIC_IMAGES } from '@/config/publicContent';

const industries = [
  {
    title: 'Oil & Gas',
    description:
      'Upstream, midstream, and downstream — pipeline coating, platform fabrication, and corrosion protection for global operators.',
    image: PUBLIC_IMAGES.heroPipeline,
  },
  {
    title: 'Power & Utilities',
    description:
      'Power generation infrastructure, transmission assets, and utility-scale energy projects across Asia-Pacific.',
    image: PUBLIC_IMAGES.heroEngineering,
  },
  {
    title: 'Bioenergy & Renewables',
    description:
      'Biomass turbines, boilers, and renewable energy integration supporting the transition to cleaner power.',
    image: PUBLIC_IMAGES.bioenergy,
  },
  {
    title: 'Marine & Offshore',
    description:
      'Offshore platforms, subsea infrastructure, and marine coating solutions for harsh operating environments.',
    image: PUBLIC_IMAGES.marine,
  },
  {
    title: 'Industrial Manufacturing',
    description:
      'Heavy fabrication, structural steel, and custom engineering for industrial plants and processing facilities.',
    image: PUBLIC_IMAGES.energyFabrication,
  },
  {
    title: 'Infrastructure',
    description:
      'National infrastructure projects including pipelines, industrial parks, and critical energy logistics hubs.',
    image: PUBLIC_IMAGES.infrastructure,
  },
];

export default function IndustriesPage() {
  return (
    <PublicLayout>
      <PageHero
        overline="Industries"
        title="Specialised Solutions Across Diverse Sectors"
        subtitle="Wasco serves energy, industrial, and infrastructure clients worldwide with tailored solutions for each sector's unique challenges."
        image={PUBLIC_IMAGES.industries}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading
          title="Sectors We Serve"
          subtitle="Our global footprint and technical depth enable us to deliver world-class outcomes across the energy and industrial landscape."
        />
        <Grid container spacing={3} alignItems="stretch">
          {industries.map((industry) => (
            <Grid key={industry.title} size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
              <Box sx={{ width: '100%' }}>
                <ImageFeatureCard {...industry} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </PublicLayout>
  );
}
