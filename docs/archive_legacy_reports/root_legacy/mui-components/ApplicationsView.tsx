import React from "react";
import { Box, Typography, Button, Container, alpha } from "@mui/material";
import { Target, Plus } from "lucide-react";

export interface ApplicationsViewProps {
  onAddApplication?: () => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({ onAddApplication }) => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 6 }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Roboto Flex", "Roboto", serif',
                fontWeight: 700,
                mb: 1,
              }}
            >
              Applications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track and manage your job applications
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={onAddApplication}
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: 600,
            }}
          >
            Add Application
          </Button>
        </Box>

        {/* Placeholder Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 15,
            borderRadius: 3,
            border: 2,
            borderStyle: "dashed",
            borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
            bgcolor: (theme) => alpha(theme.palette.surface.container, 0.4),
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: "50%",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
              mb: 3,
            }}
          >
            <Target size={48} color="#A78BFA" />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Roboto Flex", "Roboto", serif',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Applications View
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Application tracker will be housed here
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default ApplicationsView;
