'use client';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectProps } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';

interface SelectOption {
  value: string;
  label: string;
}

interface AppSelectProps extends Omit<SelectProps, 'label'> {
  label: string;
  options: SelectOption[];
  helperText?: string;
  error?: boolean;
  formControlSx?: object;
}

export default function AppSelect({
  label,
  options,
  helperText,
  error,
  formControlSx,
  ...props
}: AppSelectProps) {
  return (
    <FormControl fullWidth size="small" error={error} sx={formControlSx}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} {...props}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
