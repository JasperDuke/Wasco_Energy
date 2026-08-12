import { BRAND } from './data';

export const PUBLIC_IMAGES = {
  heroPipeline:
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
  heroEngineering:
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80',
  heroSustainability:
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1920&q=80',
  pipelineServices:
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80',
  energyFabrication:
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80',
  bioenergy:
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  about:
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80',
  services:
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80',
  industries:
    'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1920&q=80',
  marine:
    'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1920&q=80',
  infrastructure:
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80',
  vendor:
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80',
  contact:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
  /** Global operations / team photo used on About and related sections */
  globalOps:
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80',
} as const;

export const HERO_SLIDES = [
  {
    image: PUBLIC_IMAGES.heroPipeline,
    overline: 'Pipeline Services',
    title: 'Expertise Across 22,000+ km of Pipelines Globally',
    subtitle:
      'Renowned for pipe coating, manufacturing, and corrosion protection solutions across four continents and 25 countries.',
    cta: { label: 'Explore Services', href: '/services' },
  },
  {
    image: PUBLIC_IMAGES.heroEngineering,
    overline: 'Energy & Fabrication',
    title: 'World-Class Engineering & Fabrication for Global Energy',
    subtitle:
      'Comprehensive EPC solutions from design and procurement to fabrication, installation, commissioning, and O&M.',
    cta: { label: 'Our Capabilities', href: '/industries' },
  },
  {
    image: PUBLIC_IMAGES.heroSustainability,
    overline: 'Sustainability',
    title: 'Committed to Net Zero Operational Emissions by 2026',
    subtitle:
      'Integrating economic, environmental, and social considerations into our business strategy for a sustainable future.',
    cta: { label: `About ${BRAND.name}`, href: '/about' },
  },
] as const;

export const COMPANY_STATS = [
  { value: '22,000+', label: 'km of Pipelines Coated' },
  { value: '12', label: 'Countries Worldwide' },
  { value: '5,000+', label: 'Employees Globally' },
  { value: '25+', label: 'Years of Excellence' },
] as const;

export const BUSINESS_DIVISIONS = [
  {
    title: 'Pipeline Services',
    description:
      'Market leader in pipe coating, pipe manufacturing, and corrosion protection for onshore and offshore projects.',
    image: PUBLIC_IMAGES.pipelineServices,
    href: '/services',
  },
  {
    title: 'Energy & Fabrication Services',
    description:
      'EPC and fabrication solutions spanning engineering design, procurement, packaging, installation, and O&M.',
    image: PUBLIC_IMAGES.energyFabrication,
    href: '/services',
  },
  {
    title: 'Bioenergy Services',
    description:
      'One of the largest fabricators of steam biomass turbines and boilers, enabling cleaner energy transitions.',
    image: PUBLIC_IMAGES.bioenergy,
    href: '/industries',
  },
] as const;
