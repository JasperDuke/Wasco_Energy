'use client';

import { DataGrid, GridColDef, GridRowParams, GridValidRowModel } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

interface AppDataGridProps {
  rows: GridValidRowModel[];
  columns: GridColDef[];
  loading?: boolean;
  onRowClick?: (params: GridRowParams) => void;
  pageSize?: number;
  sx?: SxProps<Theme>;
  getRowId?: (row: GridValidRowModel) => string;
}

export default function AppDataGrid({
  rows,
  columns,
  loading = false,
  onRowClick,
  pageSize = 10,
  sx,
  getRowId,
}: AppDataGridProps) {
  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[5, 10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize } } }}
        disableRowSelectionOnClick
        onRowClick={onRowClick}
        getRowId={getRowId ?? ((row) => row.id as string)}
        autoHeight
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'background.default',
            fontWeight: 600,
          },
          '& .MuiDataGrid-row': {
            cursor: onRowClick ? 'pointer' : 'default',
          },
          '& .MuiDataGrid-cell:focus': { outline: 'none' },
        }}
      />
    </Box>
  );
}
