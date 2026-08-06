'use client';

import TextField, { TextFieldProps } from '@mui/material/TextField';

export type AppTextFieldProps = TextFieldProps;

export default function AppTextField(props: AppTextFieldProps) {
  return <TextField fullWidth size="small" {...props} />;
}
