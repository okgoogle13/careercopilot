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
  IconButton,
  Divider,
} from "@mui/material";
import { ArrowLeft, Save, Eye, Download, Plus, X } from "lucide-react";

export interface ResumeBuilderProps {
  onBack: () => void;
  onNext?: () => void;
  profileName?: string;
}

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    year: string;
  }>;
  skills: string[];
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ onBack, onNext, profileName }) => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: profileName || "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    experience: [{ id: "1", title: "", company: "", duration: "", description: "" }],
    education: [{ id: "1", degree: "", school: "", year: "" }],
    skills: [],
  });

  const [newSkill, setNewSkill] = useState("");

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now().toString(), title: "", company: "", duration: "", description: "" },
      ],
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now().toString(), degree: "", school: "", year: "" },
      ],
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 6,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Button
              variant="text"
              startIcon={<ArrowLeft size={16} />}
              onClick={onBack}
              sx={{ color: "text.secondary" }}
            >
              Back to Dashboard
            </Button>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Roboto Flex", "Roboto", serif',
                fontWeight: 700,
              }}
            >
              Resume Builder
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" startIcon={<Eye size={16} />} onClick={onNext}>
              Preview
            </Button>
            <Button variant="outlined" startIcon={<Download size={16} />}>
              Export PDF
            </Button>
            <Button
              variant="contained"
              startIcon={<Save size={16} />}
              onClick={onNext}
              sx={{ bgcolor: "primary.main" }}
            >
              Save & Continue
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Personal Info */}
              <Card
                sx={{ bgcolor: "surface.container", border: 1, borderColor: "outline.variant" }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Roboto Flex", "Roboto", serif',
                      fontWeight: 700,
                      mb: 3,
                    }}
                  >
                    Personal Information
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={resumeData.personalInfo.fullName}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={resumeData.personalInfo.email}
                    />
                    <TextField fullWidth label="Phone" value={resumeData.personalInfo.phone} />
                    <TextField
                      fullWidth
                      label="Location"
                      value={resumeData.personalInfo.location}
                    />
                    <TextField
                      fullWidth
                      label="Professional Summary"
                      multiline
                      rows={4}
                      value={resumeData.personalInfo.summary}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card
                sx={{ bgcolor: "surface.container", border: 1, borderColor: "outline.variant" }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Roboto Flex", "Roboto", serif',
                      fontWeight: 700,
                      mb: 3,
                    }}
                  >
                    Skills
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      placeholder="Add a skill"
                      size="small"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button variant="contained" onClick={addSkill} sx={{ bgcolor: "primary.main" }}>
                      <Plus size={16} />
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {resumeData.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => removeSkill(index)}
                        deleteIcon={<X size={14} />}
                        sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={6}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Experience */}
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
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 700,
                      }}
                    >
                      Work Experience
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Plus size={14} />}
                      onClick={addExperience}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {resumeData.experience.map((exp, index) => (
                      <Box key={exp.id}>
                        {index > 0 && <Divider sx={{ mb: 3 }} />}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <TextField fullWidth label="Job Title" size="small" value={exp.title} />
                          <TextField fullWidth label="Company" size="small" value={exp.company} />
                          <TextField
                            fullWidth
                            label="Duration"
                            size="small"
                            placeholder="e.g. Jan 2020 - Present"
                            value={exp.duration}
                          />
                          <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={3}
                            size="small"
                            value={exp.description}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Education */}
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
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Roboto Flex", "Roboto", serif',
                        fontWeight: 700,
                      }}
                    >
                      Education
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Plus size={14} />}
                      onClick={addEducation}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {resumeData.education.map((edu, index) => (
                      <Box key={edu.id}>
                        {index > 0 && <Divider sx={{ mb: 3 }} />}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <TextField fullWidth label="Degree" size="small" value={edu.degree} />
                          <TextField
                            fullWidth
                            label="School/Institution"
                            size="small"
                            value={edu.school}
                          />
                          <TextField
                            fullWidth
                            label="Year"
                            size="small"
                            placeholder="e.g. 2020"
                            value={edu.year}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ResumeBuilder;
