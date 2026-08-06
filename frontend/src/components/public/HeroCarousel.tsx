'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

interface HeroSlide {
  image: string;
  overline: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
}

interface HeroCarouselProps {
  slides: readonly HeroSlide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[active];

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 520, md: 640 },
        overflow: 'hidden',
        color: 'white',
      }}
    >
      {slides.map((item, index) => (
        <Box
          key={item.title}
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: index === active ? 1 : 0,
            transition: 'opacity 1.2s ease-in-out',
            backgroundImage: `linear-gradient(120deg, rgba(13, 71, 161, 0.9) 0%, rgba(21, 101, 192, 0.65) 45%, rgba(0, 0, 0, 0.35) 100%), url(${item.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: { xs: 520, md: 640 },
          display: 'flex',
          alignItems: 'center',
          py: { xs: 8, md: 10 },
        }}
      >
        <Box sx={{ maxWidth: 780 }}>
          <Typography variant="overline" sx={{ letterSpacing: 3, opacity: 0.9, fontWeight: 600 }}>
            {slide.overline}
          </Typography>
          <Typography
            variant="h1"
            sx={{
              mt: 1.5,
              mb: 2.5,
              fontWeight: 700,
              fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.5rem' },
              lineHeight: 1.1,
            }}
          >
            {slide.title}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.92,
              fontWeight: 400,
              lineHeight: 1.7,
              mb: 4,
              maxWidth: 640,
              fontSize: { xs: '1rem', md: '1.2rem' },
            }}
          >
            {slide.subtitle}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href={slide.cta.href}
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                px: 3,
                '&:hover': { backgroundColor: 'grey.100' },
              }}
            >
              {slide.cta.label}
            </Button>
            <Button
              component={Link}
              href="/become-vendor"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 3,
                '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.12)' },
              }}
            >
              Become a Vendor
            </Button>
          </Box>
        </Box>
      </Container>

      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 2,
        }}
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => setActive(index)}
            sx={{
              width: index === active ? 28 : 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: index === active ? 'white' : 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
