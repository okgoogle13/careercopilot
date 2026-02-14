import React from "react";
import { Box, Typography, Button, Card, CardContent, Container, alpha } from "@mui/material";
import { Upload, FileText, Mail, Award } from "lucide-react";

export interface UploadResumeProps {
  onNext: () => void;
  onBack: () => void;
}

const uploadSections = [
  {
    icon: FileText,
    title: "Resumes",
    description: "Upload your current resume(s) in PDF or Word format",
    color: "#A78BFA",
  },
  {
    icon: Mail,
    title: "Cover Letters",
    description: "Upload any existing cover letters for reference",
    color: "#F472B6",
  },
  {
    icon: Award,
    title: "Selection Criteria Responses",
    description: "Upload any previous selection criteria responses",
    color: "#86EFAC",
  },
];

export const UploadResume: React.FC<UploadResumeProps> = ({ onNext, onBack }) => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Roboto Flex", "Roboto", serif',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Create Your Master Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload your existing documents. We'll build your profile from them.
          </Typography>
        </Box>

        {/* Upload Sections */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 6 }}>
          {uploadSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card
                key={index}
                sx={{ bgcolor: "surface.container", border: 1, borderColor: "outline.variant" }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* Section Header */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (theme) => alpha(section.color, 0.12),
                        borderRadius: 2,
                      }}
                    >
                      <Icon size={20} color={section.color} />
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: '"Roboto Flex", "Roboto", serif',
                          fontWeight: 700,
                        }}
                      >
                        {section.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {section.description}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Upload Area */}
                  <Box
                    sx={{
                      border: 2,
                      borderStyle: "dashed",
                      borderColor: "outline.variant",
                      borderRadius: 2,
                      p: 6,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.02),
                      },
                    }}
                  >
                    <Upload
                      size={32}
                      color="#94A3B8"
                      style={{ marginBottom: "12px", marginLeft: "auto", marginRight: "auto" }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Drag and drop files here or click to browse
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "outline.main",
                        color: "text.secondary",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      Upload Files
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={onNext}
            sx={{ bgcolor: "primary.main", fontWeight: 600 }}
          >
            Continue to Profile Creation
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default UploadResume;
