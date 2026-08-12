'use client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import PublicLayout from '@/components/layouts/PublicLayout';
import PageHero from '@/components/public/PageHero';
import SectionHeading from '@/components/public/SectionHeading';
import ImageFeatureCard from '@/components/public/ImageFeatureCard';
import { PUBLIC_IMAGES } from '@/config/publicContent';
import { BRAND } from '@/config/data';

const services = [
  {
    title: 'Pipeline Services',
    description:
      'Pipe coating, manufacturing, and corrosion protection — expertise across 22,000+ km of pipelines in 25 countries.',
    image: PUBLIC_IMAGES.pipelineServices,
  },
  {
    title: 'Engineering & Fabrication',
    description:
      'EPC solutions from engineering design and procurement to fabrication, installation, commissioning, and O&M.',
    image: PUBLIC_IMAGES.energyFabrication,
  },
  {
    title: 'Bioenergy Services',
    description:
      'Fabrication of steam biomass turbines and boilers, supporting the transition to cleaner energy sources.',
    image: PUBLIC_IMAGES.bioenergy,
  },
  {
    title: 'Corrosion Protection',
    description:
      'Advanced coating systems and cathodic protection for onshore and offshore pipeline infrastructure.',
    image: PUBLIC_IMAGES.heroPipeline,
  },
  {
    title: 'Project Management',
    description:
      'End-to-end project delivery with rigorous quality, safety, and schedule management across global sites.',
    image: PUBLIC_IMAGES.services,
  },
  {
    title: 'Procurement & Supply Chain',
    description:
      'Strategic sourcing and vendor qualification ensuring the highest standards for critical components and services.',
    image: PUBLIC_IMAGES.vendor,
  },
];

export default function ServicesPage() {
  return (
    <PublicLayout>
      <PageHero
        overline="Our Services"
        title="Comprehensive Energy Solutions for Every Stage of the Value Chain"
        subtitle={`From pipeline coating to world-class fabrication — ${BRAND.name} delivers integrated services trusted by the global energy industry.`}
        image={PUBLIC_IMAGES.services}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading
          title="What We Deliver"
          subtitle="Our divisions combine deep technical expertise with global execution capability to deliver projects on time, on budget, and to the highest standards."
        />
        <Grid container spacing={3}>
          {services.map((service) => (
            <Grid key={service.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <ImageFeatureCard {...service} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </PublicLayout>
  );
}
