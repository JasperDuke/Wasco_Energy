'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useForm } from 'react-hook-form';
import {
  AppTextField,
  AppSelect,
  AppButton,
  AppCard,
} from '@/components/common';
import { FormField, FieldType } from '@/types';
import { FIELD_TYPE_LABELS } from '@/utils/constants';
import { generateFieldKey } from '@/utils/helpers';

const FIELD_TYPES: FieldType[] = [
  'text', 'textarea', 'email', 'website', 'phone', 'number',
  'dropdown', 'radio', 'checkbox', 'date', 'file',
];

const OPTION_FIELD_TYPES: FieldType[] = ['dropdown', 'radio', 'checkbox'];

interface FieldEditorProps {
  field: FormField;
  index: number;
  total: number;
  onChange: (field: FormField) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function FieldEditor({
  field,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: FieldEditorProps) {
  const showOptions = OPTION_FIELD_TYPES.includes(field.type);
  const showFileConfig = field.type === 'file';

  return (
    <AppCard
      title={`Field ${index + 1}: ${field.label || 'Untitled'}`}
      action={
        <Box>
          <IconButton size="small" onClick={onMoveUp} disabled={index === 0}>
            <ArrowUpwardIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onMoveDown} disabled={index === total - 1}>
            <ArrowDownwardIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onDelete} color="error">
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      }
      sx={{ mb: 2 }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField
            label="Label"
            value={field.label}
            onChange={(e) => {
              const label = e.target.value;
              onChange({
                ...field,
                label,
                key: field.key || generateFieldKey(label),
              });
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField
            label="Key"
            value={field.key}
            onChange={(e) => onChange({ ...field, key: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppSelect
            label="Field Type"
            value={field.type}
            onChange={(e) =>
              onChange({ ...field, type: e.target.value as FieldType })
            }
            options={FIELD_TYPES.map((t) => ({
              value: t,
              label: FIELD_TYPE_LABELS[t] ?? t,
            }))}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <AppTextField
            label="Placeholder"
            value={field.placeholder ?? ''}
            onChange={(e) => onChange({ ...field, placeholder: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AppTextField
            label="Help Text"
            value={field.helpText ?? ''}
            onChange={(e) => onChange({ ...field, helpText: e.target.value })}
          />
        </Grid>
        {showOptions && (
          <Grid size={{ xs: 12 }}>
            <AppTextField
              label="Options (comma-separated)"
              value={(field.options ?? []).join(', ')}
              onChange={(e) =>
                onChange({
                  ...field,
                  options: e.target.value.split(',').map((o) => o.trim()).filter(Boolean),
                })
              }
              helperText="e.g. Option 1, Option 2, Option 3"
            />
          </Grid>
        )}
        {showFileConfig && (
          <>
            <Grid size={{ xs: 12 }}>
              <AppTextField
                label="Document Type"
                value={field.documentType ?? ''}
                onChange={(e) =>
                  onChange({
                    ...field,
                    documentType: e.target.value.trim() || undefined,
                  })
                }
                helperText="Sent to Atenxion as document_type (e.g. Annual Report). Defaults to field label."
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppTextField
                label="Accepted File Types"
                value={(field.acceptedFileTypes ?? []).join(', ')}
                onChange={(e) =>
                  onChange({
                    ...field,
                    acceptedFileTypes: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                  })
                }
                helperText="e.g. .pdf, .jpg, .png"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <AppTextField
                label="Max File Size (bytes)"
                type="number"
                value={field.maxFileSize ?? ''}
                onChange={(e) =>
                  onChange({
                    ...field,
                    maxFileSize: e.target.value ? parseInt(e.target.value, 10) : undefined,
                  })
                }
              />
            </Grid>
          </>
        )}
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={field.required}
                onChange={(e) => onChange({ ...field, required: e.target.checked })}
              />
            }
            label="Required field"
          />
        </Grid>
      </Grid>
    </AppCard>
  );
}

interface FormBuilderEditorProps {
  initialFields?: FormField[];
  initialName?: string;
  initialDescription?: string;
  onSave: (data: { name: string; description: string; fields: FormField[] }) => Promise<void>;
  saving?: boolean;
}

export default function FormBuilderEditor({
  initialFields = [],
  initialName = '',
  initialDescription = '',
  onSave,
  saving = false,
}: FormBuilderEditorProps) {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [error, setError] = useState('');

  const { register, handleSubmit } = useForm({
    defaultValues: { name: initialName, description: initialDescription },
  });

  useEffect(() => {
    setFields(initialFields);
  }, [initialFields]);

  const addField = () => {
    setFields([
      ...fields,
      {
        label: '',
        key: '',
        type: 'text',
        required: false,
        order: fields.length,
      },
    ]);
  };

  const updateField = (index: number, field: FormField) => {
    const updated = [...fields];
    updated[index] = { ...field, order: index };
    setFields(updated);
  };

  const deleteField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index).map((f, i) => ({ ...f, order: i })));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;
    const updated = [...fields];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setFields(updated.map((f, i) => ({ ...f, order: i })));
  };

  const onSubmit = async (data: { name: string; description: string }) => {
    if (fields.length === 0) {
      setError('Add at least one field');
      return;
    }

    const invalidField = fields.find((f) => !f.label || !f.key);
    if (invalidField) {
      setError('All fields must have a label and key');
      return;
    }

    setError('');
    await onSave({ ...data, fields });
  };

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <AppCard title="Form Details" sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AppTextField label="Form Name" {...register('name', { required: true })} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <AppTextField label="Description" multiline rows={2} {...register('description')} />
          </Grid>
        </Grid>
      </AppCard>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Form Fields ({fields.length})
        </Typography>
        <AppButton variant="outlined" onClick={addField}>
          Add Field
        </AppButton>
      </Box>

      {fields.map((field, index) => (
        <FieldEditor
          key={`field-${index}`}
          field={field}
          index={index}
          total={fields.length}
          onChange={(f) => updateField(index, f)}
          onDelete={() => deleteField(index)}
          onMoveUp={() => moveField(index, 'up')}
          onMoveDown={() => moveField(index, 'down')}
        />
      ))}

      {fields.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No fields added yet. Click &quot;Add Field&quot; to start building your form.
        </Typography>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <AppButton variant="contained" onClick={handleSubmit(onSubmit)} disabled={saving}>
          {saving ? 'Saving...' : 'Save Form'}
        </AppButton>
      </Box>
    </Box>
  );
}
