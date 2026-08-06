'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ImageFeatureCardProps {
  title: string;
  description: string;
  image: string;
  href?: string;
}

export default function ImageFeatureCard({ title, description, image, href }: ImageFeatureCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
        },
      }}
    >
      <Box
        sx={{
          height: 220,
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(13,71,161,0.75) 100%), url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
          {description}
        </Typography>
        {href && (
          <Button
            component={Link}
            href={href}
            endIcon={<ArrowForwardIcon />}
            sx={{ px: 0 }}
          >
            Learn More
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
