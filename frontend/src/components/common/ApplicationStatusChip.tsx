'use client';

import Chip from '@mui/material/Chip';
import { ApplicationStatus } from '@/types';
import { APPLICATION_STATUS_COLORS, APPLICATION_STATUS_LABELS } from '@/utils/constants';

interface ApplicationStatusChipProps {
  status: ApplicationStatus;
}

export default function ApplicationStatusChip({ status }: ApplicationStatusChipProps) {
  const colors = APPLICATION_STATUS_COLORS[status] ?? { bg: '#F5F5F5', color: '#616161' };
  const label = APPLICATION_STATUS_LABELS[status] ?? status;

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 500,
        border: 'none',
      }}
    />
  );
}
