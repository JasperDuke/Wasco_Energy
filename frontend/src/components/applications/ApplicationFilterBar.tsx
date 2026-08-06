'use client';

import Box from '@mui/material/Box';
import { AppSelect, SearchBar } from '@/components/common';
import { ApplicationStatus } from '@/types';
import { APPLICATION_STATUS_LABELS } from '@/utils/constants';

interface ApplicationFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: ApplicationStatus | 'all';
  onStatusChange: (s: ApplicationStatus | 'all') => void;
  vendorFilter?: string;
  onVendorChange?: (v: string) => void;
  vendors?: { id: string; name: string }[];
}

export default function ApplicationFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  vendorFilter,
  onVendorChange,
  vendors,
}: ApplicationFilterBarProps) {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3, alignItems: 'center' }}>
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search by Case ID, vendor, category..."
      />
      <AppSelect
        label="Status"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as ApplicationStatus | 'all')}
        options={statusOptions}
        formControlSx={{ minWidth: 200 }}
      />
      {vendors && onVendorChange && (
        <AppSelect
          label="Vendor"
          value={vendorFilter ?? 'all'}
          onChange={(e) => onVendorChange(e.target.value as string)}
          options={[
            { value: 'all', label: 'All Vendors' },
            ...vendors.map((v) => ({ value: v.id, label: v.name })),
          ]}
          formControlSx={{ minWidth: 220 }}
        />
      )}
    </Box>
  );
}
