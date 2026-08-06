'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { TimelineEvent } from '@/types';
import { formatDate } from '@/utils/helpers';

interface ApplicationTimelineProps {
  events: TimelineEvent[];
}

export default function ApplicationTimeline({ events }: ApplicationTimelineProps) {
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <Box>
      <Stepper orientation="vertical" activeStep={sorted.length}>
        {sorted.map((event) => (
          <Step key={event.id} active completed>
            <StepLabel>
              <Typography variant="body2" fontWeight={600}>
                {event.label}
              </Typography>
            </StepLabel>
            <StepContent>
              {event.description && (
                <Typography variant="body2" color="text.secondary">
                  {event.description}
                </Typography>
              )}
              <Typography variant="caption" color="text.disabled">
                {formatDate(event.timestamp)}
                {event.actor ? ` · ${event.actor}` : ''}
              </Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
