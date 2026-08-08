'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Application, HumanValidationAction, VendorProfile } from '@/types';
import {
  AppCard,
  ApplicationStatusChip,
  AppButton,
} from '@/components/common';
import ApplicationTimeline from './ApplicationTimeline';
import AssessmentSummary from './AssessmentSummary';
import HumanValidationPanel from './HumanValidationPanel';
import UploadedDocumentsList from './UploadedDocumentsList';
import VendorProfileEditor, { VendorProfileFormData } from '@/components/vendors/VendorProfileEditor';
import { formatDate, formatNeedMoreFilesMessage } from '@/utils/helpers';
import { APPLICATION_STATUS_LABELS } from '@/utils/constants';

interface ApplicationDetailViewProps {
  application: Application;
  mode: 'vendor' | 'staff' | 'admin';
  vendorProfile?: VendorProfile;
  onHumanValidation?: (action: HumanValidationAction, notes?: string) => Promise<void>;
  onUpdateVendorProfile?: (data: VendorProfileFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  showHumanValidation?: boolean;
}

export default function ApplicationDetailView({
  application,
  mode,
  vendorProfile,
  onHumanValidation,
  onUpdateVendorProfile,
  onDelete,
  showHumanValidation = false,
}: ApplicationDetailViewProps) {
  const isProcessing = ['processing', 'proposal_under_review', 'submitted', 'pending', 'pending_approval'].includes(
    application.status
  );
  const isAssessmentDone = [
    'assessment_completed',
    'need_clarification',
    'approved',
    'conditionally_approved',
    'rejected',
  ].includes(application.status);
  const needMoreFilesMessage = application.assessment?.needMoreFiles
    ? formatNeedMoreFilesMessage(application.assessment.needMoreFiles)
    : null;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const canEditVendor = (mode === 'admin' || mode === 'staff') && !!vendorProfile && !!onUpdateVendorProfile;
  const canDelete = !!onDelete;

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete();
      setDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" fontWeight={600}>
            {application.caseId}
          </Typography>
          <ApplicationStatusChip status={application.status} />
        </Box>
        {canDelete && (
          <AppButton variant="outlined" color="error" onClick={() => setDeleteOpen(true)}>
            Delete Submission
          </AppButton>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          {vendorProfile && (
            <AppCard title="Company Information" sx={{ mb: 3 }}>
              <VendorProfileEditor
                profile={vendorProfile}
                readOnly={!canEditVendor}
                onSave={onUpdateVendorProfile ?? (async () => {})}
              />
            </AppCard>
          )}

          <AppCard title="Submission Information" sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Vendor Group</Typography>
                <Typography variant="body2" fontWeight={500}>{application.vendorGroup || '—'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Supplying Entity</Typography>
                <Typography variant="body2" fontWeight={500}>{application.supplyingEntity || '—'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Vendor</Typography>
                <Typography variant="body2" fontWeight={500}>{application.vendorName}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Category</Typography>
                <Typography variant="body2" fontWeight={500}>{application.vendorCategory}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Submitted Date</Typography>
                <Typography variant="body2" fontWeight={500}>
                  {application.submittedAt ? formatDate(application.submittedAt) : '—'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">Recommendation</Typography>
                <Typography variant="body2" fontWeight={500}>{application.recommendation}</Typography>
              </Grid>
              {Object.entries(application.formData).map(([key, value]) => (
                <Grid key={key} size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {Array.isArray(value) ? value.join(', ') : String(value ?? '—')}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </AppCard>

          <AppCard title="Uploaded Documents" sx={{ mb: 3 }}>
            <UploadedDocumentsList
              uploadedDocuments={application.uploadedDocuments}
              documentFieldLabels={application.documentFieldLabels}
            />
          </AppCard>

          {needMoreFilesMessage && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Action Required
              </Typography>
              <Typography variant="body2">{needMoreFilesMessage}</Typography>
            </Alert>
          )}

          {isProcessing && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600}>Processing</Typography>
              <Typography variant="body2">Proposal Under Review — assessment results will be available shortly.</Typography>
            </Alert>
          )}

          {isAssessmentDone && application.assessment && (
            <Box sx={{ mb: 3 }}>
              <AssessmentSummary assessment={application.assessment} />
            </Box>
          )}

          {showHumanValidation && isAssessmentDone && onHumanValidation && (
            <AppCard title="Human Validation">
              <HumanValidationPanel onAction={onHumanValidation} />
            </AppCard>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <AppCard title="Current Status">
            <Typography variant="body1" fontWeight={600} gutterBottom>
              {APPLICATION_STATUS_LABELS[application.status]}
            </Typography>
            {application.assessment && (
              <Typography variant="h4" fontWeight={700} color="primary.main" sx={{ mt: 1 }}>
                {application.assessment.overallScore}
                <Typography component="span" variant="body2" color="text.secondary"> / 100</Typography>
              </Typography>
            )}
          </AppCard>

          <AppCard title="Timeline" sx={{ mt: 3 }}>
            <ApplicationTimeline events={application.timeline} />
          </AppCard>
        </Grid>
      </Grid>

      <Dialog open={deleteOpen} onClose={() => !deleting && setDeleteOpen(false)}>
        <DialogTitle>Delete Submission?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This will permanently delete application {application.caseId} and its assessment data.
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <AppButton onClick={() => setDeleteOpen(false)} disabled={deleting}>Cancel</AppButton>
          <AppButton variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </AppButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
