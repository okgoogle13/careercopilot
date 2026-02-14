import React from "react";
import { Box, Typography, Button, Container, alpha } from "@mui/material";
import { FileText, Plus } from "lucide-react";

export interface DocumentsViewProps {
  onCreateDocument?: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ onCreateDocument }) => {
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
              Documents
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your resumes, cover letters, and other career documents
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={onCreateDocument}
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              fontWeight: 600,
            }}
          >
            New Document
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
            <FileText size={48} color="#A78BFA" />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Roboto Flex", "Roboto", serif',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Documents View
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Document creation flow will be housed here
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default DocumentsView;
