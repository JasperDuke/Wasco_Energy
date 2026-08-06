'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import Link from '@mui/material/Link';
import { UploadedFile } from '@/types';
import { AppButton } from '@/components/common';
import { formatDate, formatDocumentFieldLabel, formatFileSize, getFileUrl } from '@/utils/helpers';

interface UploadedDocumentsListProps {
  uploadedDocuments: Record<string, UploadedFile[]>;
  documentFieldLabels?: Record<string, string>;
}

export default function UploadedDocumentsList({
  uploadedDocuments,
  documentFieldLabels,
}: UploadedDocumentsListProps) {
  const groupedDocuments = Object.entries(uploadedDocuments).filter(([, files]) => files.length > 0);

  if (groupedDocuments.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No documents uploaded.
      </Typography>
    );
  }

  return (
    <Box>
      {groupedDocuments.map(([fieldKey, files], index) => (
        <Box key={fieldKey} sx={{ mb: index < groupedDocuments.length - 1 ? 2 : 0 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            {formatDocumentFieldLabel(fieldKey, documentFieldLabels)}
          </Typography>
          <List dense disablePadding>
            {files.map((doc) => {
              const fileUrl = getFileUrl(doc);
              const canView = fileUrl !== '#';

              return (
                <ListItem
                  key={doc.id}
                  sx={{
                    px: 1.5,
                    py: 1,
                    mb: 0.75,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <InsertDriveFileOutlinedIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={doc.originalName}
                    secondary={`${formatFileSize(doc.size)} · ${formatDate(doc.uploadedAt)}`}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  {canView && (
                    <Link
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="none"
                    >
                      <AppButton
                        variant="outlined"
                        size="small"
                        component="span"
                        endIcon={<OpenInNewOutlinedIcon fontSize="small" />}
                      >
                        View
                      </AppButton>
                    </Link>
                  )}
                </ListItem>
              );
            })}
          </List>
          {index < groupedDocuments.length - 1 && <Divider sx={{ mt: 2 }} />}
        </Box>
      ))}
    </Box>
  );
}
