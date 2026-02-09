import React from "react";
import { Box, Typography, Button, Container, alpha } from "@mui/material";
import { Briefcase, Search } from "lucide-react";

export interface OpportunitiesViewProps {
  onAnalyzeJob?: () => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({ onAnalyzeJob }) => {
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
              Opportunities
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Discover and analyze job opportunities that match your profile
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Search size={16} />}
            onClick={onAnalyzeJob}
            sx={{
              bgcolor: "tertiary.main",
              color: "tertiary.contrastText",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "tertiary.dark",
              },
            }}
          >
            Analyze Job
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
            borderColor: (theme) => alpha(theme.palette.tertiary.main, 0.3),
            bgcolor: (theme) => alpha(theme.palette.surface.container, 0.4),
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: "50%",
              bgcolor: (theme) => alpha(theme.palette.tertiary.main, 0.12),
              mb: 3,
            }}
          >
            <Briefcase size={48} color="#F472B6" />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Roboto Flex", "Roboto", serif',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Opportunities View
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Job analysis and opportunity discovery will be housed here
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default OpportunitiesView;
