import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Container,
  Grid,
  Chip,
  CircularProgress,
  alpha,
} from "@mui/material";
import { Sparkles, User, Briefcase, GraduationCap, Award } from "lucide-react";

export interface ProfileEditorProps {
  onNext: () => void;
  onBack: () => void;
}

const skillsList = [
  "Crisis Intervention",
  "Case Management",
  "Client Support",
  "Peer Support",
  "Mental Health",
  "Community Outreach",
];

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ onNext, onBack }) => {
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSummary(
        "Dedicated and compassionate Community Support Worker with over 5 years of experience in providing client-centered care. Skilled in crisis intervention, case management, and developing support plans that empower individuals to achieve their goals.",
      );
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="lg">
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
            Review Your Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-extracted information from your uploaded documents. Review and enhance below.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - Main Info */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Personal Info */}
              <Card
                sx={{ bgcolor: "surface.container", border: 1, borderColor: "outline.variant" }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                        borderRadius: 2,
                      }}
                    >
                      <User size={20} color="#A78BFA" />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 700,
                      }}
                    >
                      Personal Information
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <TextField fullWidth label="Full Name" defaultValue="Nishant Dougall" />
                    <TextField fullWidth label="Email" defaultValue="nishant.dougall@email.com" />
                    <TextField fullWidth label="Phone" defaultValue="+61 4XX XXX XXX" />
                  </Box>
                </CardContent>
              </Card>

              {/* Professional Summary */}
              <Card
                sx={{ bgcolor: "surface.container", border: 1, borderColor: "outline.variant" }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                          borderRadius: 2,
                        }}
                      >
                        <Briefcase size={20} color="#A78BFA" />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: '"Roboto Flex", "Roboto", serif',
                          fontWeight: 700,
                        }}
                      >
                        Professional Summary
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={
                        isGenerating ? <CircularProgress size={14} /> : <Sparkles size={14} />
                      }
                      onClick={handleGenerateSummary}
                      disabled={isGenerating}
                      sx={{
                        borderColor: "primary.main",
                        color: "primary.main",
                        "&:hover": {
                          borderColor: "primary.dark",
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      {isGenerating ? "Generating..." : "Generate with AI"}
                    </Button>
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="AI will generate a professional summary based on your experience..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "background.default",
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Right Column - Experience & Skills */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Experience */}
              <Card
                sx={{ bgcolor: "surface.container", border: 1, borderColor: "outline.variant" }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (theme) => alpha(theme.palette.tertiary.main, 0.12),
                        borderRadius: 2,
                      }}
                    >
                      <Briefcase size={20} color="#F472B6" />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 700,
                      }}
                    >
                      Experience
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Card
                      sx={{
                        bgcolor: "background.default",
                        border: 1,
                        borderColor: "outline.variant",
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Community Support Worker
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Community Care Organization
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          2019 - Present
                        </Typography>
                      </CardContent>
                    </Card>
                    <Card
                      sx={{
                        bgcolor: "background.default",
                        border: 1,
                        borderColor: "outline.variant",
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Peer Worker
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mental Health Support Services
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          2017 - 2019
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </CardContent>
              </Card>

              {/* Education */}
              <Card
                sx={{ bgcolor: "surface.container", border: 1, borderColor: "outline.variant" }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
                        borderRadius: 2,
                      }}
                    >
                      <GraduationCap size={20} color="#86EFAC" />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 700,
                      }}
                    >
                      Education
                    </Typography>
                  </Box>

                  <Card
                    sx={{
                      bgcolor: "background.default",
                      border: 1,
                      borderColor: "outline.variant",
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Certificate IV in Mental Health Peer Work
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        TAFE Queensland
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        2017
                      </Typography>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card
                sx={{ bgcolor: "surface.container", border: 1, borderColor: "outline.variant" }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (theme) => alpha(theme.palette.warning.main, 0.12),
                        borderRadius: 2,
                      }}
                    >
                      <Award size={20} color="#FDE047" />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 700,
                      }}
                    >
                      Key Skills
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {skillsList.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        sx={{
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                          color: "primary.main",
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 6 }}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={onNext}
            sx={{ bgcolor: "primary.main", fontWeight: 600 }}
          >
            Save Profile & Continue
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfileEditor;
