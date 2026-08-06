'use client';

import AppDialog from './AppDialog';
import Typography from '@mui/material/Typography';
import { AppButton } from '@/components/common';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmColor?: 'primary' | 'error' | 'warning' | 'success';
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmColor = 'primary',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <>
          <AppButton onClick={onClose} disabled={loading}>Cancel</AppButton>
          <AppButton
            variant="contained"
            color={confirmColor}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmLabel}
          </AppButton>
        </>
      }
    >
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </AppDialog>
  );
}
