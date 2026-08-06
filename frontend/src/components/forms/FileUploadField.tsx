'use client';

import { useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { UploadedFile } from '@/types';
import { formatFileSize } from '@/utils/helpers';
import { generateId } from '@/utils/helpers';

interface FileUploadFieldProps {
  label: string;
  helperText?: string;
  accept?: string;
  maxFileSize?: number;
  multiple?: boolean;
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  disabled?: boolean;
  error?: boolean;
}

export default function FileUploadField({
  label,
  helperText,
  accept,
  maxFileSize = 10485760,
  multiple = true,
  value,
  onChange,
  disabled = false,
  error = false,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFile[] = [];

    Array.from(fileList).forEach((file) => {
      if (file.size > maxFileSize) return;
      newFiles.push({
        id: generateId('file'),
        originalName: file.name,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        file,
      });
    });

    onChange(multiple ? [...value, ...newFiles] : newFiles);
  };

  const removeFile = (id: string) => {
    onChange(value.filter((f) => f.id !== id));
  };

  return (
    <Box>
      <Typography variant="body2" fontWeight={500} gutterBottom color={error ? 'error' : 'text.primary'}>
        {label}
      </Typography>
      <Box
        onClick={() => !disabled && inputRef.current?.click()}
        sx={{
          border: '2px dashed',
          borderColor: error ? 'error.main' : 'divider',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          backgroundColor: 'background.default',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          '&:hover': disabled ? {} : { borderColor: 'primary.main', backgroundColor: 'action.hover' },
        }}
      >
        <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Click to upload or drag and drop
        </Typography>
        {helperText && (
          <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
            {helperText}
          </Typography>
        )}
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </Box>

      {value.length > 0 && (
        <List dense sx={{ mt: 1 }}>
          {value.map((file) => (
            <ListItem
              key={file.id}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                mb: 0.5,
                py: 0.5,
              }}
            >
              <InsertDriveFileOutlinedIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
              <ListItemText
                primary={file.originalName}
                secondary={formatFileSize(file.size)}
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
              {!disabled && (
                <ListItemSecondaryAction>
                  <IconButton edge="end" size="small" onClick={() => removeFile(file.id)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
