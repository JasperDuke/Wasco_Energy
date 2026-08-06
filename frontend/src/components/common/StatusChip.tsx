'use client';

import Chip from '@mui/material/Chip';
import { STATUS_COLORS } from '@/utils/constants';

interface StatusChipProps {
  status: string;
  label?: string;
}

export default function StatusChip({ status, label }: StatusChipProps) {
  const color = STATUS_COLORS[status] ?? 'default';
  const displayLabel = label ?? status.charAt(0).toUpperCase() + status.slice(1);

  return <Chip label={displayLabel} color={color} size="small" variant="outlined" />;
}
