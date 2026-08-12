'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { AppTextField, AppButton, BrandLogo } from '@/components/common';
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { getDashboardPath } from '@/utils/helpers';
import { PUBLIC_IMAGES } from '@/config/publicContent';
import { BRAND } from '@/config/data';

interface LoginInput {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>();

  const onSubmit = async (data: LoginInput) => {
    try {
      setLoading(true);
      setError('');
      const user = await authService.login(data);
      setUser(user);
      router.push(getDashboardPath(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      heroImage={PUBLIC_IMAGES.heroPipeline}
      heroTitle="Welcome Back to the Vendor Portal"
      heroSubtitle={`Sign in to manage your vendor profile, track qualification status, and collaborate with ${BRAND.fullName} procurement teams.`}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 24px rgba(21, 101, 192, 0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <BrandLogo size={36} />
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="primary.main" lineHeight={1.2}>
              {BRAND.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {BRAND.portalTagline}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <LoginOutlinedIcon color="primary" fontSize="small" />
          <Typography variant="h5" fontWeight={700}>
            Sign In
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your credentials to access your vendor dashboard.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <AppTextField
              label="Email"
              type="email"
              autoComplete="email"
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <AppTextField
              label="Password"
              type="password"
              autoComplete="current-password"
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <AppButton
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              size="large"
              sx={{ mt: 0.5, py: 1.25 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </AppButton>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: '#1565C0', fontWeight: 600 }}>
            Register as Vendor
          </Link>
        </Typography>
      </Paper>
    </AuthSplitLayout>
  );
}
