import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  ButtonGroup,
  Divider,
} from "@mui/material";
import {
  ArrowLeft,
  Download,
  Share2,
  Edit3,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
} from "lucide-react";

export interface DocumentPreviewProps {
  onBack: () => void;
  onEdit: () => void;
  documentType?: "resume" | "cover-letter";
  templateName?: string;
}

const mockDocument = {
  title: "Nishant Dougall - Community Support Worker Resume",
  type: "resume" as const,
  lastModified: "2 hours ago",
  pages: 1,
  templateName: "Modern Minimal",
};

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  onBack,
  onEdit,
  documentType = "resume",
  templateName = "Modern Minimal",
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Button
                variant="text"
                startIcon={<ArrowLeft size={16} />}
                onClick={onBack}
                sx={{ color: "text.secondary", mb: 2 }}
              >
                Back to Templates
              </Button>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Roboto Flex", "Roboto", serif',
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                Document Preview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mockDocument.title} • Template: {templateName}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button variant="outlined" startIcon={<Edit3 size={16} />} onClick={onEdit}>
                Edit
              </Button>
              <Button variant="outlined" startIcon={<Share2 size={16} />}>
                Share
              </Button>
              <Button variant="outlined" startIcon={<Printer size={16} />}>
                Print
              </Button>
              <Button
                variant="contained"
                startIcon={<Download size={16} />}
                sx={{ bgcolor: "primary.main" }}
              >
                Download PDF
              </Button>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} lg={3}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Document Info */}
              <Card
                sx={{ bgcolor: "surface.container", border: 1, borderColor: "outline.variant" }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                    Document Info
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Type:
                      </Typography>
                      <Chip
                        label={documentType.replace("-", " ")}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Template:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {templateName}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Pages:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {mockDocument.pages}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Modified:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {mockDocument.lastModified}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Zoom Controls */}
              <Card
                sx={{ bgcolor: "surface.container", border: 1, borderColor: "outline.variant" }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                    Zoom Controls
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <ButtonGroup variant="outlined" size="small">
                        <IconButton size="small" onClick={handleZoomOut} disabled={zoomLevel <= 50}>
                          <ZoomOut size={16} />
                        </IconButton>
                        <Button size="small" onClick={handleResetZoom}>
                          {zoomLevel}%
                        </Button>
                        <IconButton size="small" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
                          <ZoomIn size={16} />
                        </IconButton>
                      </ButtonGroup>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<RotateCcw size={14} />}
                      onClick={handleResetZoom}
                    >
                      Reset Zoom
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Preview Area */}
          <Grid item xs={12} lg={9}>
            <Card
              sx={{
                bgcolor: "surface.container",
                border: 1,
                borderColor: "outline.variant",
                minHeight: 800,
              }}
            >
              <CardContent
                sx={{
                  p: 4,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  bgcolor: "#E5E7EB",
                  minHeight: 800,
                }}
              >
                {/* Document Preview */}
                <Box
                  sx={{
                    width: `${zoomLevel}%`,
                    maxWidth: 850,
                    aspectRatio: "8.5 / 11",
                    bgcolor: "white",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    borderRadius: 1,
                    p: 6,
                    transition: "all 0.3s",
                  }}
                >
                  {/* Mock Resume Content */}
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 700,
                        color: "#1F2937",
                        mb: 1,
                      }}
                    >
                      Nishant Dougall
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6B7280", mb: 3 }}>
                      Community Support Worker
                    </Typography>

                    <Divider sx={{ mb: 3, borderColor: "#D1D5DB" }} />

                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 700,
                        color: "#1F2937",
                        mb: 2,
                      }}
                    >
                      Professional Summary
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#4B5563", mb: 3, lineHeight: 1.7 }}>
                      Dedicated community support worker with 5+ years of experience providing
                      person-centered care and support to individuals with disabilities and mental
                      health challenges.
                    </Typography>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 700,
                        color: "#1F2937",
                        mb: 2,
                      }}
                    >
                      Work Experience
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                        Senior Support Worker • Community Care Australia
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#6B7280", display: "block", mb: 1 }}
                      >
                        January 2020 - Present
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#4B5563", lineHeight: 1.7 }}>
                        • Provided personalized support to 15+ clients with varying support needs
                        <br />• Developed and implemented individual support plans
                        <br />• Collaborated with healthcare professionals and families
                      </Typography>
                    </Box>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 700,
                        color: "#1F2937",
                        mb: 2,
                      }}
                    >
                      Education
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1F2937" }}>
                      Certificate IV in Disability
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6B7280" }}>
                      TAFE Queensland • 2019
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DocumentPreview;
