'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import FormBuilderEditor from '@/components/forms/FormBuilderEditor';
import DynamicFormRenderer from '@/components/forms/DynamicFormRenderer';
import { AppButton, LoadingSpinner, EmptyState, AppCard } from '@/components/common';
import { adminNavItems } from '@/config/navigation';
import { formService } from '@/services/formService';
import { DynamicForm } from '@/types';
import { useForm } from 'react-hook-form';

export default function FormBuilderPage() {
  const [forms, setForms] = useState<DynamicForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<DynamicForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tab, setTab] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const { control } = useForm();

  const fetchForms = async () => {
    try {
      setLoading(true);
      const data = await formService.getAll();
      setForms(data);
      if (data.length > 0 && !selectedForm) {
        setSelectedForm(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (data: {
    name: string;
    description: string;
    fields: DynamicForm['fields'];
  }) => {
    try {
      setSaving(true);
      setError('');
      if (selectedForm && !isCreating) {
        await formService.update(selectedForm.id, data);
        setSuccess('Form updated successfully');
      } else {
        await formService.create(data);
        setSuccess('Form created successfully');
        setIsCreating(false);
      }
      await fetchForms();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard allowedRoles={['admin']}>
      <DashboardLayout
        navItems={adminNavItems}
        title="Admin Portal"
        pageTitle="Form Builder"
        pageSubtitle="Create and manage dynamic vendor onboarding forms"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Form Builder' },
        ]}
        action={
          <AppButton
            variant="contained"
            onClick={() => {
              setIsCreating(true);
              setSelectedForm(null);
              setTab(0);
            }}
          >
            Create New Form
          </AppButton>
        }
      >
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {!isCreating && forms.length > 0 && (
              <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {forms.map((form) => (
                  <Chip
                    key={form.id}
                    label={`${form.name} (v${form.version})`}
                    color={selectedForm?.id === form.id ? 'primary' : 'default'}
                    variant={selectedForm?.id === form.id ? 'filled' : 'outlined'}
                    onClick={() => {
                      setSelectedForm(form);
                      setIsCreating(false);
                    }}
                  />
                ))}
              </Box>
            )}

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
              <Tab label="Editor" />
              <Tab label="Preview" disabled={!selectedForm && !isCreating} />
            </Tabs>

            {tab === 0 && (
              <FormBuilderEditor
                key={isCreating ? 'new' : selectedForm?.id}
                initialName={isCreating ? '' : selectedForm?.name}
                initialDescription={isCreating ? '' : selectedForm?.description}
                initialFields={isCreating ? [] : selectedForm?.fields}
                onSave={handleSave}
                saving={saving}
              />
            )}

            {tab === 1 && selectedForm && (
              <AppCard title={`Preview: ${selectedForm.name}`}>
                <DynamicFormRenderer
                  fields={selectedForm.fields}
                  control={control}
                  disabled
                />
              </AppCard>
            )}

            {!isCreating && forms.length === 0 && (
              <EmptyState
                title="No Forms Created"
                description="Create your first vendor onboarding form to get started."
                action={
                  <AppButton variant="contained" onClick={() => setIsCreating(true)}>
                    Create Form
                  </AppButton>
                }
              />
            )}
          </>
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
