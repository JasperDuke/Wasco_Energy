'use client';

import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import { AppTextField, AppSelect } from '@/components/common';
import FileUploadField from './FileUploadField';
import { FormField, UploadedFile } from '@/types';

interface DynamicFormRendererProps<T extends FieldValues> {
  fields: FormField[];
  control: Control<T>;
  disabled?: boolean;
  fileValues?: Record<string, UploadedFile[]>;
  onFileChange?: (key: string, files: UploadedFile[]) => void;
}

export default function DynamicFormRenderer<T extends FieldValues>({
  fields,
  control,
  disabled = false,
  fileValues = {},
  onFileChange,
}: DynamicFormRendererProps<T>) {
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  const renderField = (field: FormField) => {
    const name = field.key as Path<T>;
    const rules = {
      required: field.required ? `${field.label} is required` : false,
      validate:
        field.type === 'checkbox' && field.required
          ? (value: unknown) =>
              (Array.isArray(value) && value.length > 0) || `${field.label} is required`
          : undefined,
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Controller
            key={field.key}
            name={name}
            control={control}
            rules={rules}
            render={({ field: f, fieldState }) => (
              <AppTextField
                {...f}
                label={field.label}
                placeholder={field.placeholder}
                helperText={fieldState.error?.message ?? field.helpText}
                error={!!fieldState.error}
                multiline
                rows={4}
                disabled={disabled}
                required={field.required}
              />
            )}
          />
        );

      case 'dropdown':
        return (
          <Controller
            key={field.key}
            name={name}
            control={control}
            rules={rules}
            render={({ field: f, fieldState }) => (
              <AppSelect
                label={field.label}
                value={f.value ?? ''}
                onChange={f.onChange}
                options={(field.options ?? []).map((o) => ({ value: o, label: o }))}
                helperText={fieldState.error?.message ?? field.helpText}
                error={!!fieldState.error}
              />
            )}
          />
        );

      case 'radio':
        return (
          <Controller
            key={field.key}
            name={name}
            control={control}
            rules={rules}
            render={({ field: f, fieldState }) => (
              <FormControl error={!!fieldState.error} disabled={disabled}>
                <FormLabel>{field.label}</FormLabel>
                <RadioGroup value={f.value ?? ''} onChange={f.onChange}>
                  {(field.options ?? []).map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
                <FormHelperText>
                  {fieldState.error?.message ?? field.helpText}
                </FormHelperText>
              </FormControl>
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            key={field.key}
            name={name}
            control={control}
            rules={rules}
            render={({ field: f, fieldState }) => (
              <FormControl error={!!fieldState.error} disabled={disabled}>
                <FormLabel>{field.label}</FormLabel>
                <FormGroup>
                  {(field.options ?? []).map((option) => {
                    const values: string[] = f.value ?? [];
                    return (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            checked={values.includes(option)}
                            onChange={(e) => {
                              const newValues = e.target.checked
                                ? [...values, option]
                                : values.filter((v) => v !== option);
                              f.onChange(newValues);
                            }}
                          />
                        }
                        label={option}
                      />
                    );
                  })}
                </FormGroup>
                <FormHelperText>
                  {fieldState.error?.message ?? field.helpText}
                </FormHelperText>
              </FormControl>
            )}
          />
        );

      case 'file':
        return (
          <Controller
            key={field.key}
            name={name}
            control={control}
            rules={{
              ...rules,
              validate: field.required
                ? () =>
                    (fileValues[field.key]?.length ?? 0) > 0 ||
                    `${field.label} is required`
                : undefined,
            }}
            render={({ fieldState }) => (
              <FileUploadField
                label={field.label}
                helperText={fieldState.error?.message ?? field.helpText}
                accept={(field.acceptedFileTypes ?? []).join(',')}
                maxFileSize={field.maxFileSize}
                value={fileValues[field.key] ?? []}
                onChange={(files) => onFileChange?.(field.key, files)}
                disabled={disabled}
                error={!!fieldState.error}
              />
            )}
          />
        );

      default:
        return (
          <Controller
            key={field.key}
            name={name}
            control={control}
            rules={rules}
            render={({ field: f, fieldState }) => (
              <AppTextField
                {...f}
                label={field.label}
                placeholder={field.placeholder}
                type={
                  field.type === 'email'
                    ? 'email'
                    : field.type === 'number'
                      ? 'number'
                      : field.type === 'date'
                        ? 'date'
                        : field.type === 'phone'
                          ? 'tel'
                          : field.type === 'website'
                            ? 'url'
                            : 'text'
                }
                helperText={fieldState.error?.message ?? field.helpText}
                error={!!fieldState.error}
                disabled={disabled}
                required={field.required}
                InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
              />
            )}
          />
        );
    }
  };

  return (
    <Grid container spacing={2}>
      {sortedFields.map((field) => (
        <Grid key={field.key} size={{ xs: 12, sm: field.type === 'file' || field.type === 'textarea' ? 12 : 6 }}>
          {renderField(field)}
        </Grid>
      ))}
    </Grid>
  );
}
