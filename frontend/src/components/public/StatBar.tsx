'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';

interface Stat {
  value: string;
  label: string;
}

interface StatBarProps {
  stats: readonly Stat[];
}

export default function StatBar({ stats }: StatBarProps) {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.dark',
        color: 'white',
        py: { xs: 4, md: 5 },
        borderBottom: '4px solid',
        borderColor: 'primary.light',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight={700} sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
