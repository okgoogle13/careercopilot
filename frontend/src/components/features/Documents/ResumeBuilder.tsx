import { ArrowLeft, Download, Palette, Save, ViewModule, Visibility } from '@mui/icons-material';
import { Box } from '@mui/material';
import { Button, Card } from '@mui/material';
import { useState } from 'react';

import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';

interface ResumeBuilderProps {
  template?: { id: string; name: string; type: 'resume' | 'cover-letter' };
  onBack: () => void;
  onComplete?: () => void;
  onNext?: () => void;
  profileName?: string;
}

interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'traditional' | 'creative' | 'ats-friendly';
  preview: string;
  features: string[];
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

export function ResumeBuilder({ template, onBack, onNext, profileName }: ResumeBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern-1');

  const resumeTemplates: ResumeTemplate[] = [
    {
      id: 'modern-1',
      name: 'Modern Professional',
      description: 'Clean, contemporary design with subtle colors',
      category: 'modern',
      preview: 'A sleek design with a sidebar for skills and contact info',
      features: ['ATS-friendly', 'Color accents', 'Skills sidebar', 'Modern typography'],
    },
    {
      id: 'traditional-1',
      name: 'Classic Executive',
      description: 'Traditional format perfect for corporate roles',
      category: 'traditional',
      preview: 'Conservative layout with emphasis on experience',
      features: ['Corporate-friendly', 'Chronological format', 'Clean sections', 'Professional'],
    },
    {
      id: 'creative-1',
      name: 'Creative Designer',
      description: 'Bold design for creative professionals',
      category: 'creative',
      preview: 'Eye-catching layout with visual elements',
      features: ['Visual design', 'Color scheme', 'Portfolio section', 'Creative layout'],
    },
    {
      id: 'ats-1',
      name: 'ATS Optimized',
      description: 'Designed to pass Applicant Tracking Systems',
      category: 'ats-friendly',
      preview: 'Simple, clean format optimized for ATS parsing',
      features: ['ATS-optimized', 'Standard format', 'Keyword friendly', 'Machine readable'],
    },
  ];

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: profileName || '',
      email: '',
      phone: '',
      location: '',
      summary: '',
    },
    experience: [
      {
        id: '1',
        title: '',
        company: '',
        duration: '',
        description: '',
      },
    ],
    education: [
      {
        id: '1',
        degree: '',
        school: '',
        year: '',
      },
    ],
    skills: [],
  });

  const [newSkill, setNewSkill] = useState('');

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          title: '',
          company: '',
          duration: '',
          description: '',
        },
      ],
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          degree: '',
          school: '',
          year: '',
        },
      ],
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const getCurrentTemplate = () =>
    resumeTemplates.find((t) => t.id === selectedTemplate) || resumeTemplates[0];

  const getCategoryColor = (category: string) => {
    const colors = {
      modern: 'bg-blue-100 text-blue-800 border-blue-200',
      traditional: 'bg-gray-100 text-gray-800 border-gray-200',
      creative: 'bg-purple-100 text-purple-800 border-purple-200',
      'ats-friendly': 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div sx={{
      flex: 1,
      p: 8
    }}>
      <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 8
    }}>
        <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4
    }}>
          <Button
            variant="text"
            onClick={onBack}
            sx={{
      '&:hover': {}
    }}
          >
            <ArrowLeft sx={{
      mr: 2
    }} />
            Back to Dashboard
          </Button>
          <h1 sx={{
      typography: "h4",
      fontWeight: 700,}}>Resume Builder</h1>
        </div>
        <div sx={{
      display: "flex",
      gap: 2
    }}>
          <Button variant="outlined" onClick={onNext}>
            <Visibility sx={{
      mr: 2
    }} />
            Preview
          </Button>
          <Button variant="outlined">
            <Download sx={{
      mr: 2
    }} />
            Export PDF
          </Button>
          <Button sx={{
      '&:hover': {}
    }} onClick={onNext}>
            <Save sx={{
      mr: 2
    }} />
            Save & Continue
          </Button>
        </div>
      </div>

      {/* Template Selection Section */}
      <Card sx={{
      mb: 8,
      p: 6
    }}>
        <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 4
    }}>
          <ViewModule sx={{
      color: "blue.600"
    }} />
          <h3 sx={{
      typography: "h6",
      fontWeight: 500
    }}>Choose Resume Template</h3>
        </div>

        <div sx={{
      [theme.breakpoints.up('sm')]: {},
      [theme.breakpoints.up('md')]: {},
      gap: 4,
      mb: 4
    }}>
          {resumeTemplates.map((template) => (
            <Card
              key={template.id}
              sx={{
      p: 4,
      cursor: "pointer",
      border: 2,
      '&:hover': {},}}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div sx={{}}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
                  <h4 sx={{
      fontWeight: 500,
      typography: "body1"
    }}>{template.name}</h4>
                  <Badge className={getCategoryColor(template.category)}>{template.category}</Badge>
                </div>
                <p sx={{
      typography: "body2",
      color: "gray.600"
    }}>{template.description}</p>
                <div sx={{
      bgcolor: "gray.100",
      borderRadius: "0.25rem",
      border: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      typography: "body2",
      color: "gray.500"
    }}>
                  Template Preview
                </div>
                <div sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 1
    }}>
                  {template.features.slice(0, 2).map((feature, idx) => (
                    <Badge key={idx} variant="outline" sx={{
      typography: "body2"
    }}>
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div sx={{
      bgcolor: "gray.50",
      p: 4,
      borderRadius: "0.5rem"
    }}>
          <div sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 3
    }}>
            <Palette sx={{
      color: "gray.600",
      mt: 0.5
    }} />
            <div>
              <h5 sx={{
      fontWeight: 500,
      typography: "body1"
    }}>Selected: {getCurrentTemplate().name}</h5>
              <p sx={{
      typography: "body2",
      color: "gray.600",
      mb: 2
    }}>{getCurrentTemplate().preview}</p>
              <div sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 1
    }}>
                {getCurrentTemplate().features.map((feature, idx) => (
                  <Badge key={idx} variant="outline" sx={{
      typography: "body2"
    }}>
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div sx={{
      [theme.breakpoints.up('md')]: {},
      gap: 8
    }}>
        <div sx={{}}>
          <Card sx={{
      p: 6
    }}>
            <h3 sx={{
      typography: "h6",
      fontWeight: 500,
      mb: 4
    }}>Personal Information</h3>
            <div sx={{}}>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, fullName: e.target.value },
                    }))
                  }
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value },
                    }))
                  }
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value },
                    }))
                  }
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={resumeData.personalInfo.location}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, location: e.target.value },
                    }))
                  }
                  placeholder="City, State"
                />
              </div>
              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={resumeData.personalInfo.summary}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, summary: e.target.value },
                    }))
                  }
                  placeholder="Brief professional summary..."
                  rows={4}
                />
              </div>
            </div>
          </Card>

          <Card sx={{
      p: 6
    }}>
            <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 4
    }}>
              <h3 sx={{
      typography: "h6",
      fontWeight: 500
    }}>Work Experience</h3>
              <Button onClick={addExperience} variant="outlined" size="small">
                Add Experience
              </Button>
            </div>
            <div sx={{}}>
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} sx={{
      p: 4,
      border: 1,
      borderRadius: "0.5rem",}}>
                  <div sx={{
      gap: 3
    }}>
                    <Input
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) =>
                        setResumeData((prev) => ({
                          ...prev,
                          experience: prev.experience.map((item, i) =>
                            i === index ? { ...item, title: e.target.value } : item
                          ),
                        }))
                      }
                    />
                    <Input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) =>
                        setResumeData((prev) => ({
                          ...prev,
                          experience: prev.experience.map((item, i) =>
                            i === index ? { ...item, company: e.target.value } : item
                          ),
                        }))
                      }
                    />
                  </div>
                  <Input
                    placeholder="Duration (e.g., Jan 2020 - Present)"
                    value={exp.duration}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        experience: prev.experience.map((item, i) =>
                          i === index ? { ...item, duration: e.target.value } : item
                        ),
                      }))
                    }
                  />
                  <Textarea
                    placeholder="Job description and achievements..."
                    value={exp.description}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        experience: prev.experience.map((item, i) =>
                          i === index ? { ...item, description: e.target.value } : item
                        ),
                      }))
                    }
                    rows={3}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div sx={{}}>
          <Card sx={{
      p: 6
    }}>
            <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 4
    }}>
              <h3 sx={{
      typography: "h6",
      fontWeight: 500
    }}>Education</h3>
              <Button onClick={addEducation} variant="outlined" size="small">
                Add Education
              </Button>
            </div>
            <div sx={{}}>
              {resumeData.education.map((edu, index) => (
                <div key={edu.id} sx={{
      p: 4,
      border: 1,
      borderRadius: "0.5rem",}}>
                  <Input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item, i) =>
                          i === index ? { ...item, degree: e.target.value } : item
                        ),
                      }))
                    }
                  />
                  <Input
                    placeholder="School/University"
                    value={edu.school}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item, i) =>
                          i === index ? { ...item, school: e.target.value } : item
                        ),
                      }))
                    }
                  />
                  <Input
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item, i) =>
                          i === index ? { ...item, year: e.target.value } : item
                        ),
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card sx={{
      p: 6
    }}>
            <h3 sx={{
      typography: "h6",
      fontWeight: 500,
      mb: 4
    }}>Skills</h3>
            <div sx={{}}>
              <div sx={{
      display: "flex",
      gap: 2
    }}>
                <Input
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill} variant="outlined">
                  Add
                </Button>
              </div>
              <div sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2
    }}>
                {resumeData.skills.map((skill, index) => (
                  <div
                    key={index}
                    sx={{
      px: 3,
      py: 1,
      borderRadius: "0.375rem",
      typography: "body1",
      display: "flex",
      alignItems: "center",
      gap: 2
    }}
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(index)}
                      sx={{
      '&:hover': {}
    }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card sx={{
      p: 6
    }}>
            <h3 sx={{
      typography: "h6",
      fontWeight: 500,
      mb: 4
    }}>Resume Preview</h3>
            <div sx={{
      bgcolor: "common.white",
      color: "common.black",
      p: 6,
      borderRadius: "0.5rem",
      typography: "body1"
    }}>
              <div sx={{
      mb: 4
    }}>
                <h2 sx={{
      typography: "h5",
      fontWeight: 700
    }}>
                  {resumeData.personalInfo.fullName || 'Your Name'}
                </h2>
                <p sx={{
      color: "gray.600"
    }}>
                  {resumeData.personalInfo.email} | {resumeData.personalInfo.phone} |{' '}
                  {resumeData.personalInfo.location}
                </p>
              </div>

              {resumeData.personalInfo.summary && (
                <div sx={{
      mb: 4
    }}>
                  <h3 sx={{
      fontWeight: 700,
      mb: 2
    }}>Professional Summary</h3>
                  <p sx={{
      color: "gray.700"
    }}>{resumeData.personalInfo.summary}</p>
                </div>
              )}

              {resumeData.experience.some((exp) => exp.title || exp.company) && (
                <div sx={{
      mb: 4
    }}>
                  <h3 sx={{
      fontWeight: 700,
      mb: 2
    }}>Work Experience</h3>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} sx={{
      mb: 3
    }}>
                      {(exp.title || exp.company) && (
                        <div>
                          <div sx={{
      display: "flex",
      justifyContent: "space-between"
    }}>
                            <span sx={{
      fontWeight: 500
    }}>{exp.title}</span>
                            <span sx={{
      color: "gray.600"
    }}>{exp.duration}</span>
                          </div>
                          <div sx={{
      color: "gray.600",
      mb: 1
    }}>{exp.company}</div>
                          {exp.description && (
                            <p sx={{
      color: "gray.700",
      typography: "body1"
    }}>{exp.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {resumeData.skills.length > 0 && (
                <div sx={{
      mb: 4
    }}>
                  <h3 sx={{
      fontWeight: 700,
      mb: 2
    }}>Skills</h3>
                  <p sx={{
      color: "gray.700"
    }}>{resumeData.skills.join(', ')}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
