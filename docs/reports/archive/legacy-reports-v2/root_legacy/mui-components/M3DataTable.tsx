import React from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Paper, alpha, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export interface M3DataTableProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  loading?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  checkboxSelection?: boolean;
  disableRowSelectionOnClick?: boolean;
  onRowClick?: (params: any) => void;
  onSelectionModelChange?: (selectionModel: any) => void;
  autoHeight?: boolean;
  height?: number | string;
}

/**
 * M3DataTable - Material 3 Expressive Data Table
 *
 * Features:
 * - Based on MUI X DataGrid
 * - Uses Material Theme Builder tokens
 * - Table background Paper uses surfaceContainer
 * - Header row uses surfaceContainerHigh
 * - Row borders use outlineVariant
 * - Selected rows use primary with alpha
 *
 * Local Styles Used:
 * - surfaceContainer (#221E26) - Table background
 * - surfaceContainerHigh (#2D2831) - Header background
 * - surfaceContainerHighest (#38333C) - Row hover
 * - primary (#DAB9FF) - Selected state, checkboxes
 * - onSurface (#E9E0EB) - Text color
 * - outlineVariant (#4B4452) - Row borders
 */

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "none",
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  color: theme.palette.text.primary,

  // Root container
  "& .MuiDataGrid-main": {
    borderRadius: 12,
  },

  // Column headers
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.surface.containerHigh,
    borderBottom: `1px solid ${theme.palette.outline.variant}`,
    borderRadius: "12px 12px 0 0",
    minHeight: "56px !important",
    maxHeight: "56px !important",
  },
  "& .MuiDataGrid-columnHeader": {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 600,
    fontSize: "0.875rem",
    color: theme.palette.text.primary,
    "&:focus": {
      outline: "none",
    },
    "&:focus-within": {
      outline: "none",
    },
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 600,
  },
  "& .MuiDataGrid-columnSeparator": {
    color: theme.palette.outline.variant,
  },

  // Rows
  "& .MuiDataGrid-row": {
    borderBottom: `1px solid ${theme.palette.outline.variant}`,
    cursor: "pointer",
    transition: "background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      backgroundColor: theme.palette.surface.containerHighest,
    },
    "&.Mui-selected": {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.18),
      },
    },
  },
  "& .MuiDataGrid-cell": {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: "0.875rem",
    color: theme.palette.text.primary,
    borderBottom: "none",
    "&:focus": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: -2,
    },
    "&:focus-within": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: -2,
    },
  },

  // Checkboxes
  "& .MuiCheckbox-root": {
    color: theme.palette.outline.main,
    "&.Mui-checked": {
      color: theme.palette.primary.main,
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
    },
  },

  // Footer
  "& .MuiDataGrid-footerContainer": {
    borderTop: `1px solid ${theme.palette.outline.variant}`,
    backgroundColor: theme.palette.surface.container,
    minHeight: "52px",
  },
  "& .MuiTablePagination-root": {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    color: theme.palette.text.primary,
  },
  "& .MuiTablePagination-selectLabel": {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  "& .MuiTablePagination-displayedRows": {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  "& .MuiTablePagination-select": {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },

  // Pagination buttons
  "& .MuiIconButton-root": {
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
    },
    "&.Mui-disabled": {
      color: theme.palette.text.disabled,
    },
  },

  // Overlay (loading, no rows)
  "& .MuiDataGrid-overlay": {
    backgroundColor: alpha(theme.palette.surface.container, 0.9),
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },

  // Scrollbar styling
  "& .MuiDataGrid-virtualScroller": {
    "&::-webkit-scrollbar": {
      width: 8,
      height: 8,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: theme.palette.surface.container,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.outline.main,
      borderRadius: 4,
      "&:hover": {
        backgroundColor: theme.palette.outline.variant,
      },
    },
  },
}));

const TableContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.surface.container,
  borderRadius: 16,
  border: `1px solid ${theme.palette.outline.variant}`,
  boxShadow: "none",
  overflow: "hidden",
}));

export const M3DataTable: React.FC<M3DataTableProps> = ({
  rows,
  columns,
  loading = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  checkboxSelection = false,
  disableRowSelectionOnClick = false,
  onRowClick,
  onSelectionModelChange,
  autoHeight = false,
  height = 500,
}) => {
  return (
    <TableContainer>
      <Box sx={{ width: "100%", height: autoHeight ? "auto" : height }}>
        <StyledDataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { pageSize, page: 0 },
            },
          }}
          pageSizeOptions={pageSizeOptions}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          onRowClick={onRowClick}
          onRowSelectionModelChange={onSelectionModelChange}
          autoHeight={autoHeight}
          disableColumnMenu={false}
          sx={{
            "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
              color: (theme) => theme.palette.outline.main,
            },
          }}
        />
      </Box>
    </TableContainer>
  );
};

export default M3DataTable;
