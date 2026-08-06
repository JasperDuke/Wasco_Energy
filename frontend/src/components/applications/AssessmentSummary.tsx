'use client';

import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import { ApplicationAssessment } from '@/types';
import { AppCard } from '@/components/common';
import { formatNeedMoreFilesMessage } from '@/utils/helpers';
import Alert from '@mui/material/Alert';

interface AssessmentSummaryProps {
  assessment: ApplicationAssessment;
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2" fontWeight={600}>{score}%</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={score}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor: score >= 80 ? 'success.main' : score >= 60 ? 'warning.main' : 'error.main',
          },
        }}
      />
    </Box>
  );
}

export default function AssessmentSummary({ assessment }: AssessmentSummaryProps) {
  const riskColors = {
    Low: 'success.main',
    Medium: 'warning.main',
    High: 'error.main',
  };

  return (
    <AppCard title="Assessment Summary">
      {assessment.needMoreFiles && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Additional Documents Required
          </Typography>
          <Typography variant="body2">
            {formatNeedMoreFilesMessage(assessment.needMoreFiles)}
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h2" fontWeight={700} color="primary.main">
              {assessment.overallScore}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overall Score
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Risk Band</Typography>
              <Typography variant="h6" fontWeight={600} color={riskColors[assessment.riskBand]}>
                {assessment.riskBand}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Recommendation</Typography>
              <Typography variant="h6" fontWeight={600}>
                {assessment.recommendation}
              </Typography>
            </Box>
          </Box>
          <ScoreBar label="Financial Score" score={assessment.financialScore} />
          <ScoreBar label="Technical Score" score={assessment.technicalScore} />
          <ScoreBar label="Compliance Score" score={assessment.complianceScore} />
        </Grid>
      </Grid>

      {assessment.outstandingRequirement && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Outstanding Requirement
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {assessment.outstandingRequirement}
          </Typography>
        </>
      )}
    </AppCard>
  );
}
