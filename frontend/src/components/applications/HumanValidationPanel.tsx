'use client';

import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AppButton, AppDialog } from '@/components/common';
import { HumanValidationAction } from '@/types';

interface HumanValidationPanelProps {
  onAction: (action: HumanValidationAction, notes?: string) => Promise<void>;
  disabled?: boolean;
}

const ACTIONS: {
  action: HumanValidationAction;
  label: string;
  color: 'success' | 'warning' | 'error' | 'info';
  confirmTitle: string;
  confirmMessage: string;
}[] = [
  {
    action: 'approve',
    label: 'Approve',
    color: 'success',
    confirmTitle: 'Approve Application',
    confirmMessage: 'Are you sure you want to approve this vendor application?',
  },
  {
    action: 'conditionally_approve',
    label: 'Conditionally Approve',
    color: 'warning',
    confirmTitle: 'Conditionally Approve',
    confirmMessage: 'This vendor will be conditionally approved with outstanding requirements.',
  },
  {
    action: 'reject',
    label: 'Reject',
    color: 'error',
    confirmTitle: 'Reject Application',
    confirmMessage: 'Are you sure you want to reject this vendor application?',
  },
  {
    action: 'request_clarification',
    label: 'Request Clarification',
    color: 'info',
    confirmTitle: 'Request Clarification',
    confirmMessage: 'The vendor will be notified to provide additional documents.',
  },
];

export default function HumanValidationPanel({ onAction, disabled }: HumanValidationPanelProps) {
  const [pendingAction, setPendingAction] = useState<(typeof ACTIONS)[0] | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!pendingAction) return;
    setLoading(true);
    try {
      await onAction(pendingAction.action, notes || undefined);
      setPendingAction(null);
      setNotes('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppButton
        variant="contained"
        color="success"
        onClick={() => setPendingAction(ACTIONS[0])}
        disabled={disabled}
        sx={{ mr: 1, mb: 1 }}
      >
        Approve
      </AppButton>
      {ACTIONS.slice(1).map((item) => (
        <AppButton
          key={item.action}
          variant="outlined"
          color={item.color === 'info' ? 'primary' : item.color}
          onClick={() => setPendingAction(item)}
          disabled={disabled}
          sx={{ mr: 1, mb: 1 }}
        >
          {item.label}
        </AppButton>
      ))}

      <AppDialog
        open={!!pendingAction}
        onClose={() => { setPendingAction(null); setNotes(''); }}
        title={pendingAction?.confirmTitle ?? ''}
        actions={
          <>
            <AppButton onClick={() => { setPendingAction(null); setNotes(''); }} disabled={loading}>
              Cancel
            </AppButton>
            <AppButton
              variant="contained"
              color={pendingAction?.color === 'info' ? 'primary' : pendingAction?.color}
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Processing...' : pendingAction?.label}
            </AppButton>
          </>
        }
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {pendingAction?.confirmMessage}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          size="small"
        />
      </AppDialog>
    </>
  );
}
