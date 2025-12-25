import React, { useState } from "react";
import { Box, Container, Typography, Grid, Button, Paper, Divider } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import {
  M3Select,
  M3DatePicker,
  M3SearchInput,
  M3DataTable,
  M3Breadcrumbs,
  M3Toast,
  M3PlantCareCard,
  useM3Toast,
} from "./index";
import type { M3SelectOption, M3BreadcrumbItem, PlantTask } from "./index";

/**
 * M3ComponentsShowcase - Demonstrates all 7 M3 Components
 *
 * Components showcased:
 * 1. M3Select - Select with Search
 * 2. M3DatePicker - Date Picker
 * 3. M3SearchInput - Search Input
 * 4. M3DataTable - Data Table
 * 5. M3Breadcrumbs - Breadcrumbs
 * 6. M3Toast - Toast Notifications
 * 7. M3PlantCareCard - Plant Care Card
 */

// Sample data for components
const selectOptions: M3SelectOption[] = [
  { label: "Community Support Worker", value: "csw" },
  { label: "Peer Worker", value: "peer" },
  { label: "Mental Health Advocate", value: "mha" },
  { label: "Social Worker", value: "sw" },
  { label: "Youth Worker", value: "yw" },
  { label: "Disability Support Worker", value: "dsw" },
];

const breadcrumbItems: M3BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profiles", href: "/profiles" },
  { label: "Profile Editor" },
];

const tableColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "role", headerName: "Role", width: 200 },
  { field: "atsScore", headerName: "ATS Score", width: 130, type: "number" },
  { field: "applications", headerName: "Applications", width: 130, type: "number" },
];

const tableRows = [
  {
    id: 1,
    name: "Nishant Dougall",
    role: "Community Support Worker",
    atsScore: 87,
    applications: 8,
  },
  { id: 2, name: "Sarah Martinez", role: "Peer Worker", atsScore: 92, applications: 5 },
  { id: 3, name: "James Chen", role: "Mental Health Advocate", atsScore: 78, applications: 12 },
  { id: 4, name: "Emily Wilson", role: "Social Worker", atsScore: 95, applications: 6 },
  { id: 5, name: "Michael Brown", role: "Youth Worker", atsScore: 83, applications: 9 },
];

export const M3ComponentsShowcase: React.FC = () => {
  // State for components
  const [selectedRole, setSelectedRole] = useState<M3SelectOption | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [searchValue, setSearchValue] = useState("");
  const [plantTasks, setPlantTasks] = useState<PlantTask[]>([
    { id: "1", taskName: "Water", plantName: "hoya australis", checked: false },
    { id: "2", taskName: "Fertilize", plantName: "monstera deliciosa", checked: true },
    { id: "3", taskName: "Prune", plantName: "pothos golden", checked: false },
  ]);

  const { toastState, closeToast, showSuccess, showError, showWarning, showInfo } = useM3Toast();

  const handleTaskChange = (taskId: string, checked: boolean) => {
    setPlantTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, checked } : task)));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 6 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Roboto Flex", "Roboto", sans-serif',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Material 3 Expressive Components
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}
          >
            7 production-ready components using Material Theme Builder tokens
          </Typography>
        </Box>

        {/* Component 5: Breadcrumbs */}
        <Paper
          sx={{
            bgcolor: "surface.container",
            borderRadius: 4,
            border: 1,
            borderColor: "outline.variant",
            p: 3,
            mb: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Roboto Flex", "Roboto", sans-serif',
              fontWeight: 600,
              mb: 3,
            }}
          >
            5. Breadcrumbs
          </Typography>
          <M3Breadcrumbs items={breadcrumbItems} />
        </Paper>

        <Grid container spacing={4}>
          {/* Component 1: Select with Search */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                bgcolor: "surface.container",
                borderRadius: 4,
                border: 1,
                borderColor: "outline.variant",
                p: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Roboto Flex", "Roboto", sans-serif',
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                1. Select with Search
              </Typography>
              <M3Select
                options={selectOptions}
                value={selectedRole}
                onChange={setSelectedRole}
                label="Select Role"
                placeholder="Search roles..."
              />
              {selectedRole && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Selected: {selectedRole.label}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Component 2: DatePicker */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                bgcolor: "surface.container",
                borderRadius: 4,
                border: 1,
                borderColor: "outline.variant",
                p: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Roboto Flex", "Roboto", sans-serif',
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                2. Date Picker
              </Typography>
              <M3DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                label="Select Date"
                placeholder="Choose a date"
              />
              {selectedDate && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Selected: {selectedDate.toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Component 3: SearchInput */}
          <Grid item xs={12}>
            <Paper
              sx={{
                bgcolor: "surface.container",
                borderRadius: 4,
                border: 1,
                borderColor: "outline.variant",
                p: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Roboto Flex", "Roboto", sans-serif',
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                3. Search Input
              </Typography>
              <M3SearchInput
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Search profiles, jobs, or documents..."
                onSearch={(value) => showInfo(`Searching for: ${value}`)}
              />
            </Paper>
          </Grid>

          {/* Component 4: Data Table */}
          <Grid item xs={12}>
            <Paper
              sx={{
                bgcolor: "surface.container",
                borderRadius: 4,
                border: 1,
                borderColor: "outline.variant",
                p: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Roboto Flex", "Roboto", sans-serif',
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                4. Data Table
              </Typography>
              <M3DataTable rows={tableRows} columns={tableColumns} checkboxSelection autoHeight />
            </Paper>
          </Grid>

          {/* Component 6: Toast Notifications */}
          <Grid item xs={12}>
            <Paper
              sx={{
                bgcolor: "surface.container",
                borderRadius: 4,
                border: 1,
                borderColor: "outline.variant",
                p: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Roboto Flex", "Roboto", sans-serif',
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                6. Toast Notifications
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  onClick={() => showSuccess("Operation completed successfully!", "Success")}
                  sx={{
                    bgcolor: "success.main",
                    color: "success.contrastText",
                    fontWeight: 600,
                  }}
                >
                  Show Success
                </Button>
                <Button
                  variant="contained"
                  onClick={() => showError("An error occurred while processing.", "Error")}
                  sx={{
                    bgcolor: "error.main",
                    color: "error.contrastText",
                    fontWeight: 600,
                  }}
                >
                  Show Error
                </Button>
                <Button
                  variant="contained"
                  onClick={() => showWarning("Please check your input fields.", "Warning")}
                  sx={{
                    bgcolor: "warning.main",
                    color: "warning.contrastText",
                    fontWeight: 600,
                  }}
                >
                  Show Warning
                </Button>
                <Button
                  variant="contained"
                  onClick={() => showInfo("Your profile has been updated.", "Info")}
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    fontWeight: 600,
                  }}
                >
                  Show Info
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Component 7: Plant Care Cards */}
          <Grid item xs={12}>
            <Paper
              sx={{
                bgcolor: "surface.container",
                borderRadius: 4,
                border: 1,
                borderColor: "outline.variant",
                p: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: '"Roboto Flex", "Roboto", sans-serif',
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                7. Plant Care Cards
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <M3PlantCareCard
                    title="Living Room"
                    tasks={plantTasks}
                    onTaskChange={handleTaskChange}
                    illustration="plant1"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <M3PlantCareCard
                    title="Bedroom"
                    tasks={[
                      { id: "4", taskName: "Water", plantName: "snake plant", checked: true },
                      { id: "5", taskName: "Rotate", plantName: "peace lily", checked: false },
                    ]}
                    onTaskChange={handleTaskChange}
                    illustration="plant2"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <M3PlantCareCard
                    title="Office"
                    tasks={[
                      { id: "6", taskName: "Mist", plantName: "fern", checked: false },
                      { id: "7", taskName: "Water", plantName: "spider plant", checked: true },
                    ]}
                    onTaskChange={handleTaskChange}
                    illustration="plant3"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* Design Tokens Reference */}
        <Paper
          sx={{
            bgcolor: "surface.container",
            borderRadius: 4,
            border: 1,
            borderColor: "outline.variant",
            p: 3,
            mt: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Roboto Flex", "Roboto", sans-serif',
              fontWeight: 600,
              mb: 3,
            }}
          >
            Material Theme Builder Tokens
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Colors
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: 40, height: 40, bgcolor: "primary.main", borderRadius: 2 }} />
                  <Typography variant="body2">primary: #DAB9FF</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: 40, height: 40, bgcolor: "secondary.main", borderRadius: 2 }} />
                  <Typography variant="body2">secondary: #D7BBF5</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: 40, height: 40, bgcolor: "tertiary.main", borderRadius: 2 }} />
                  <Typography variant="body2">tertiary: #FFAFD3</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "surface.container",
                      borderRadius: 2,
                      border: 1,
                      borderColor: "outline.variant",
                    }}
                  />
                  <Typography variant="body2">surfaceContainer: #221E26</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Typography
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2">Headings: Roboto Flex (expressive)</Typography>
                <Typography variant="body2">Body: Roboto (clean sans-serif)</Typography>
                <Typography variant="body2">Border Radius: 12px, 16px</Typography>
                <Typography variant="body2">Shadows: None (M3 spec)</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Toast Component */}
      <M3Toast
        open={toastState.open}
        onClose={closeToast}
        severity={toastState.severity}
        title={toastState.title}
        message={toastState.message}
      />
    </Box>
  );
};

export default M3ComponentsShowcase;
