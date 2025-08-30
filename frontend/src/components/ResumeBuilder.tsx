import { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/Card';
import { Label } from './ui/label';
import { ArrowLeft, Save, Eye, Download } from 'lucide-react';

interface ResumeBuilderProps {
  onBack: () => void;
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

export function ResumeBuilder({ onBack, profileName }: ResumeBuilderProps) {
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
    setResumeData(prev => ({
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
    setResumeData(prev => ({
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
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Resume Builder</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Resume
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={resumeData.personalInfo.fullName}
                  onChange={e =>
                    setResumeData(prev => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        fullName: e.target.value,
                      },
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
                  onChange={e =>
                    setResumeData(prev => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        email: e.target.value,
                      },
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
                  onChange={e =>
                    setResumeData(prev => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        phone: e.target.value,
                      },
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
                  onChange={e =>
                    setResumeData(prev => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        location: e.target.value,
                      },
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
                  onChange={e =>
                    setResumeData(prev => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        summary: e.target.value,
                      },
                    }))
                  }
                  placeholder="Brief professional summary..."
                  rows={4}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Button onClick={addExperience} variant="outline" size="sm">
                Add Experience
              </Button>
            </div>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div
                  key={exp.id}
                  className="p-4 border border-border rounded-lg space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={e =>
                        setResumeData(prev => ({
                          ...prev,
                          experience: prev.experience.map((item, i) =>
                            i === index
                              ? { ...item, title: e.target.value }
                              : item
                          ),
                        }))
                      }
                    />
                    <Input
                      placeholder="Company"
                      value={exp.company}
                      onChange={e =>
                        setResumeData(prev => ({
                          ...prev,
                          experience: prev.experience.map((item, i) =>
                            i === index
                              ? { ...item, company: e.target.value }
                              : item
                          ),
                        }))
                      }
                    />
                  </div>
                  <Input
                    placeholder="Duration (e.g., Jan 2020 - Present)"
                    value={exp.duration}
                    onChange={e =>
                      setResumeData(prev => ({
                        ...prev,
                        experience: prev.experience.map((item, i) =>
                          i === index
                            ? { ...item, duration: e.target.value }
                            : item
                        ),
                      }))
                    }
                  />
                  <Textarea
                    placeholder="Job description and achievements..."
                    value={exp.description}
                    onChange={e =>
                      setResumeData(prev => ({
                        ...prev,
                        experience: prev.experience.map((item, i) =>
                          i === index
                            ? { ...item, description: e.target.value }
                            : item
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

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Button onClick={addEducation} variant="outline" size="sm">
                Add Education
              </Button>
            </div>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div
                  key={edu.id}
                  className="p-4 border border-border rounded-lg space-y-3"
                >
                  <Input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={e =>
                      setResumeData(prev => ({
                        ...prev,
                        education: prev.education.map((item, i) =>
                          i === index
                            ? { ...item, degree: e.target.value }
                            : item
                        ),
                      }))
                    }
                  />
                  <Input
                    placeholder="School/University"
                    value={edu.school}
                    onChange={e =>
                      setResumeData(prev => ({
                        ...prev,
                        education: prev.education.map((item, i) =>
                          i === index
                            ? { ...item, school: e.target.value }
                            : item
                        ),
                      }))
                    }
                  />
                  <Input
                    placeholder="Year"
                    value={edu.year}
                    onChange={e =>
                      setResumeData(prev => ({
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

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Skills</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(index)}
                      className="text-primary hover:text-primary/70"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Resume Preview</h3>
            <div className="bg-white text-black p-6 rounded-lg min-h-96 text-sm">
              <div className="mb-4">
                <h2 className="text-xl font-bold">
                  {resumeData.personalInfo.fullName || 'Your Name'}
                </h2>
                <p className="text-gray-600">
                  {resumeData.personalInfo.email} |{' '}
                  {resumeData.personalInfo.phone} |{' '}
                  {resumeData.personalInfo.location}
                </p>
              </div>

              {resumeData.personalInfo.summary && (
                <div className="mb-4">
                  <h3 className="font-bold mb-2">Professional Summary</h3>
                  <p className="text-gray-700">
                    {resumeData.personalInfo.summary}
                  </p>
                </div>
              )}

              {resumeData.experience.some(exp => exp.title || exp.company) && (
                <div className="mb-4">
                  <h3 className="font-bold mb-2">Work Experience</h3>
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="mb-3">
                      {(exp.title || exp.company) && (
                        <div>
                          <div className="flex justify-between">
                            <span className="font-medium">{exp.title}</span>
                            <span className="text-gray-600">
                              {exp.duration}
                            </span>
                          </div>
                          <div className="text-gray-600 mb-1">
                            {exp.company}
                          </div>
                          {exp.description && (
                            <p className="text-gray-700 text-sm">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {resumeData.skills.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold mb-2">Skills</h3>
                  <p className="text-gray-700">
                    {resumeData.skills.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
