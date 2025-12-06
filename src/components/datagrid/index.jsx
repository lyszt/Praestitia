import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

export default function DataTable({
  rows,
  columns,
  paginationModel,
  emptyText
}) {
  return (
    <Paper sx={{
      height: 400,
      width: "100%",
      position: "relative",
      zIndex: 1,
      backgroundColor: 'var(--surface-2)',
      '& .MuiDataGrid-root': {
        color: 'var(--praestitia-text)',
        border: 'none'
      }
    }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{
          border: 0,
          color: '#F8FAFC',
          '& .MuiDataGrid-cell': {
            borderColor: 'var(--surface-3)',
            color: '#F8FAFC !important'
          },
          '& .MuiDataGrid-cellContent': {
            color: '#F8FAFC !important'
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'var(--surface-1)',
            borderColor: 'var(--surface-3)',
            color: '#F8FAFC'
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: '#F8FAFC !important',
            fontWeight: 'bold'
          },
          '& .MuiDataGrid-row': {
            backgroundColor: 'var(--surface-2)',
            '&:hover': {
              backgroundColor: 'var(--surface-3)'
            },
            '&.Mui-selected': {
              backgroundColor: '#065f46',
              '&:hover': {
                backgroundColor: '#047857'
              }
            }
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: 'var(--surface-1)',
            borderColor: 'var(--surface-3)',
            color: '#F8FAFC'
          },
          '& .MuiTablePagination-root': {
            color: '#F8FAFC !important'
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            color: '#F8FAFC !important'
          },
          '& .MuiTablePagination-select': {
            color: '#F8FAFC !important'
          },
          '& .MuiTablePagination-actions': {
            color: '#F8FAFC !important'
          },
          '& .MuiCheckbox-root': {
            color: 'var(--praestitia-primary)',
            '&.Mui-checked': {
              color: 'var(--praestitia-primary)'
            }
          },
          '& .MuiDataGrid-iconSeparator': {
            color: '#94A3B8'
          },
          '& .MuiDataGrid-sortIcon': {
            color: '#F8FAFC !important'
          },
          '& .MuiDataGrid-menuIconButton': {
            color: '#F8FAFC !important'
          },
          '& .MuiDataGrid-overlay': {
            backgroundColor: 'var(--surface-2)',
            color: '#F8FAFC !important'
          },
          '& .MuiIconButton-root': {
            color: '#F8FAFC !important'
          },
          '& .MuiSvgIcon-root': {
            color: '#F8FAFC !important'
          },
          '& .MuiDataGrid-selectedRowCount': {
            color: '#F8FAFC !important'
          }
        }}
        localeText={{
          noRowsLabel: emptyText
        }}
      />
    </Paper>
  );
}
