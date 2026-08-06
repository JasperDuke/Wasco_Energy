'use client';

import Button, { ButtonProps } from '@mui/material/Button';

export type AppButtonProps = ButtonProps;

export default function AppButton(props: AppButtonProps) {
  return <Button disableElevation {...props} />;
}
