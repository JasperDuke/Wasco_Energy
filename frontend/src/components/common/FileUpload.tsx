'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

interface FileUploadProps {
  label?: string;
  helperText?: string;
  accept?: string;
  disabled?: boolean;
}

export default function FileUpload({
  label = 'Upload File',
  helperText,
  accept,
  disabled = true,
}: FileUploadProps) {
  return (
    <Box
      sx={{
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        p: 4,
        textAlign: 'center',
        backgroundColor: 'background.default',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <CloudUploadOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
      <Typography variant="body1" color="text.secondary">
        {label}
      </Typography>
      {helperText && (
        <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 1 }}>
          {helperText}
        </Typography>
      )}
      {disabled && (
        <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 1 }}>
          File upload will be available in the next phase
        </Typography>
      )}
      <input type="file" hidden accept={accept} disabled={disabled} />
    </Box>
  );
}
