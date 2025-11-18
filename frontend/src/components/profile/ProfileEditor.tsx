import {
  ArrowLeft as ArrowLeftIcon,
  EmojiEvents as EmojiEventsIcon,
  Work as WorkIcon,
  CameraAlt as CameraAltIcon,
  CheckCircle as CheckCircleIcon,
  Code as CodeIcon,
  Visibility as VisibilityIcon,
  GitHub as GitHubIcon,
  Public as PublicIcon,
  LinkedIn as LinkedInIcon,
  LocationOn as LocationOnIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  EmojiObjects as EmojiObjectsIcon,
  Star as StarIcon,
  GpsFixed as GpsFixedIcon,
  X as TwitterIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import { Button, Card, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Progress } from '../../ui/progress';
import { Separator } from '../../ui/separator';
import { Slider } from '../../ui/slider';
import { Switch } from '../../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { AIProcessingLoading } from '../common/StandardizedLoadingStates';
import { AnimatedButton, AnimatedProgress } from '../demo/AnimatedComponents';

interface SocialLink {
  platform: 'linkedin' | 'github' | 'twitter' | 'website' | 'portfolio';
  url: string;
  verified?: boolean;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  current: boolean;
  achievements?: string[];
  skills?: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  honors?: string[];
  relevant_coursework?: string[];
}

interface ProfileSettings {
  privacy: 'public' | 'private' | 'connections';
  showSalaryExpectation: boolean;
  showLocation: boolean;
  openToOpportunities: boolean;
  preferredJobTypes: string[];
  workArrangement: 'remote' | 'hybrid' | 'onsite' | 'any';
}

interface ProfileEditorProps {
  onNext: () => void;
  onBack: () => void;
  initialData?: any;
}

export function ProfileEditor({ onNext, onBack, initialData }: ProfileEditorProps) {
  // Basic Profile State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Nishant Dougall',
    email: 'nishant.dougall@email.com',
    phone: '+61 4XX XXX XXX',
    location: 'Vancouver, BC',
    title: 'Community Support Worker',
    avatarUrl: '',
    tagline: 'Empowering communities through compassionate support',
  });

  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Enhanced Skills with levels and categories
  const [skills, setSkills] = useState<
    Array<{
      keyword: string;
      status: 'matched' | 'missing' | 'suggested';
      level: number; // 1-10
      category: 'technical' | 'soft' | 'industry' | 'language';
      yearsOfExperience?: number;
      certifications?: string[];
    }>
  >([
    {
      keyword: 'Crisis Intervention',
      status: 'matched',
      level: 9,
      category: 'industry',
      yearsOfExperience: 5,
    },
    {
      keyword: 'Case Management',
      status: 'matched',
      level: 8,
      category: 'industry',
      yearsOfExperience: 4,
    },
    {
      keyword: 'Active Listening',
      status: 'matched',
      level: 9,
      category: 'soft',
      yearsOfExperience: 6,
    },
    { keyword: 'Mental Health First Aid', status: 'suggested', level: 7, category: 'industry' },
  ]);

  // Social Links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: 'linkedin', url: 'https://linkedin.com/in/nishant-dougall', verified: true },
    { platform: 'github', url: '', verified: false },
  ]);

  // Experience & Education
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      title: 'Community Support Worker',
      company: 'Community Care Organization',
      location: 'Vancouver, BC',
      startDate: '2019-03',
      endDate: '',
      current: true,
      description:
        'Providing comprehensive support to individuals with diverse needs in community settings.',
      achievements: [
        'Supported 25+ clients with mental health and addiction challenges',
        'Reduced client crisis incidents by 40% through proactive intervention',
        'Developed individualized care plans improving client satisfaction by 30%',
      ],
      skills: ['Crisis Intervention', 'Case Management', 'Client Support'],
    },
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      id: '1',
      degree: 'Certificate IV in Mental Health Peer Work',
      institution: 'TAFE Queensland',
      location: 'Brisbane, QLD',
      startDate: '2016-02',
      endDate: '2017-06',
      honors: ["Dean's List", 'Outstanding Student Award'],
    },
  ]);

  // Profile Settings
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    privacy: 'public',
    showSalaryExpectation: false,
    showLocation: true,
    openToOpportunities: true,
    preferredJobTypes: ['Full-time', 'Contract'],
    workArrangement: 'hybrid',
  });

  // UI State
  const [activeTab, setActiveTab] = useState('basic');
  const [profileStrength, setProfileStrength] = useState(75);
  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'technical' | 'soft' | 'industry' | 'language'
  >('technical');
  const [editingExperience, setEditingExperience] = useState<string | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Utility Functions
  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSummary(
        'Dedicated and compassionate Community Support Worker with over 5 years of experience in providing client-centered care. Skilled in crisis intervention, case management, and developing support plans that empower individuals to achieve their goals.'
      );
      setIsGenerating(false);
    }, 2000);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([
        ...skills,
        {
          keyword: newSkill.trim(),
          status: 'matched',
          level: 5,
          category: selectedCategory,
        },
      ]);
      setNewSkill('');
    }
  };

  const removeSkill = (keyword: string) => {
    setSkills(skills.filter((skill) => skill.keyword !== keyword));
  };

  const updateSkillLevel = (keyword: string, level: number) => {
    setSkills(skills.map((skill) => (skill.keyword === keyword ? { ...skill, level } : skill)));
  };

  const getSocialIcon = (platform: string) => {
    const icons = {
      linkedin: LinkedInIcon,
      github: GitHubIcon,
      twitter: TwitterIcon,
      website: PublicIcon,
      portfolio: CodeIcon,
    };
    return icons[platform as keyof typeof icons] || PublicIcon;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technical: 'bg-blue-100 text-blue-800 border-blue-200',
      soft: 'bg-green-100 text-green-800 border-green-200',
      industry: 'bg-purple-100 text-purple-800 border-purple-200',
      language: 'bg-amber-100 text-amber-800 border-amber-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const calculateProfileStrength = () => {
    let strength = 0;
    if (personalInfo.fullName) strength += 10;
    if (personalInfo.email) strength += 10;
    if (personalInfo.location) strength += 5;
    if (personalInfo.avatarUrl) strength += 10;
    if (summary) strength += 15;
    if (skills.length >= 5) strength += 15;
    if (experiences.length >= 1) strength += 15;
    if (education.length >= 1) strength += 10;
    if (socialLinks.some((link) => link.url)) strength += 10;
    return Math.min(100, strength);
  };

  return (
    <TooltipProvider>
      <div sx={{
      minHeight: "100vh",
      p: 4
    }}>
        <div sx={{}}>
          {/* Enhanced Header */}
          <div sx={{
      textAlign: "center",
      mb: 8
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      mb: 6
    }}>
              <div sx={{}}>
                <Avatar sx={{
      border: 4,
      boxShadow: 4
    }}>
                  <AvatarImage src={personalInfo.avatarUrl} />
                  <AvatarFallback sx={{
      typography: "h6",
      fontWeight: 600,
      color: "common.white"
    }}>
                    {personalInfo.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
      borderRadius: "var(--sys-shape-radius-full)",
      bgcolor: "common.white",
      boxShadow: 1
    }}
                >
                  <CameraAltIcon sx={{}} />
                </Button>
              </div>
              <div sx={{
      textAlign: "left"
    }}>
                <h1 sx={{
      typography: "h3",
      fontWeight: 700,}}>{personalInfo.fullName}</h1>
                <p sx={{
      typography: "h6",}}>{personalInfo.title}</p>
                <p sx={{
      typography: "body1",
      display: "flex",
      alignItems: "center",
      gap: 1
    }}>
                  <LocationOnIcon sx={{}} />
                  {personalInfo.location}
                </p>
              </div>
            </div>

            {/* Profile Strength Indicator */}
            <Card sx={{
      p: 4,
      mb: 6,
      borderColor: "blue.200"
    }}>
              <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 2
    }}>
                <span sx={{
      typography: "body1",
      fontWeight: 500
    }}>Profile Strength</span>
                <Badge variant={calculateProfileStrength() >= 80 ? 'default' : 'secondary'}>
                  {calculateProfileStrength()}% Complete
                </Badge>
              </div>
              <AnimatedProgress value={calculateProfileStrength()} max={100} />
              <p sx={{
      typography: "body2",
      mt: 2
    }}>
                {calculateProfileStrength() >= 90
                  ? 'Excellent! Your profile is highly optimized.'
                  : calculateProfileStrength() >= 70
                    ? 'Good progress! Add more details to stand out.'
                    : 'Keep building! A strong profile increases your opportunities.'}
              </p>
            </Card>
          </div>

          {/* Enhanced Navigation */}
          <Tabs
            value={activeTab}
            onChange={(_e, newValue) => setActiveTab(newValue as string)}
            sx={{
      width: "100%"
    }}
          >
            <TabsList sx={{
      width: "100%",
      mb: 8
    }}>
              <TabsTrigger value="basic" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <PersonIcon sx={{}} />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="experience" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <WorkIcon sx={{}} />
                Experience
              </TabsTrigger>
              <TabsTrigger value="skills" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <EmojiEventsIcon sx={{}} />
                Skills
              </TabsTrigger>
              <TabsTrigger value="social" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <PublicIcon sx={{}} />
                Social & Links
              </TabsTrigger>
              <TabsTrigger value="settings" sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                <SettingsIcon sx={{}} />
                Privacy
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" currentValue={activeTab} sx={{}}>
              <>
                <div sx={{
      [theme.breakpoints.up('md')]: {},
      gap: 6
    }}>
                  {/* Personal Information */}
                  <Card sx={{
      p: 6
    }}>
                    <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 6
    }}>
                      <div sx={{
      p: 2,
      bgcolor: "blue.100",
      borderRadius: "var(--sys-shape-radius-md)"
    }}>
                        <PersonIcon sx={{
      color: "blue.600"
    }} />
                      </div>
                      <h3 sx={{
      fontWeight: 600,
      typography: "h6"
    }}>Personal Details</h3>
                    </div>

                    <div sx={{}}>
                      <div sx={{
      [theme.breakpoints.up('sm')]: {},
      gap: 4
    }}>
                        <div>
                          <label sx={{
      typography: "body1",
      fontWeight: 500,
      mb: 2,}}>Full Name *</label>
                          <Input
                            value={personalInfo.fullName}
                            onChange={(e) =>
                              setPersonalInfo({ ...personalInfo, fullName: e.target.value })
                            }
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <label sx={{
      typography: "body1",
      fontWeight: 500,
      mb: 2,}}>
                            Professional Title
                          </label>
                          <Input
                            value={personalInfo.title}
                            onChange={(e) =>
                              setPersonalInfo({ ...personalInfo, title: e.target.value })
                            }
                            placeholder="e.g., Senior Developer"
                          />
                        </div>
                      </div>

                      <div>
                        <label sx={{
      typography: "body1",
      fontWeight: 500,
      mb: 2,}}>
                          Professional Tagline
                        </label>
                        <Input
                          value={personalInfo.tagline}
                          onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, tagline: e.target.value })
                          }
                          placeholder="A brief, compelling description"
                        />
                      </div>

                      <div sx={{
      [theme.breakpoints.up('sm')]: {},
      gap: 4
    }}>
                        <div>
                          <label sx={{
      typography: "body1",
      fontWeight: 500,
      mb: 2,}}>Email *</label>
                          <Input
                            type="email"
                            value={personalInfo.email}
                            onChange={(e) =>
                              setPersonalInfo({ ...personalInfo, email: e.target.value })
                            }
                            placeholder="professional@email.com"
                          />
                        </div>
                        <div>
                          <label sx={{
      typography: "body1",
      fontWeight: 500,
      mb: 2,}}>Phone</label>
                          <Input
                            value={personalInfo.phone}
                            onChange={(e) =>
                              setPersonalInfo({ ...personalInfo, phone: e.target.value })
                            }
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>

                      <div>
                        <label sx={{
      typography: "body1",
      fontWeight: 500,
      mb: 2,}}>Location</label>
                        <Input
                          value={personalInfo.location}
                          onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, location: e.target.value })
                          }
                          placeholder="City, State/Province, Country"
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Professional Summary */}
                  <Card sx={{
      p: 6
    }}>
                    <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 6
    }}>
                      <div sx={{
      p: 2,
      bgcolor: "green.100",
      borderRadius: "var(--sys-shape-radius-md)"
    }}>
                        <WorkIcon sx={{
      color: "green.600"
    }} />
                      </div>
                      <h3 sx={{
      fontWeight: 600,
      typography: "h6"
    }}>Professional Summary</h3>
                    </div>

                    <div sx={{}}>
                      <div sx={{
      display: "flex",
      gap: 2
    }}>
                        {isGenerating ? (
                          <AIProcessingLoading message="Generating AI summary..." />
                        ) : (
                          <AnimatedButton
                            variant="outlined"
                            animation="shimmer"
                            sx={{
      flex: 1
    }}
                            onClick={handleGenerateSummary}
                          >
                            <EmojiObjectsIcon sx={{
      mr: 2,}} />
                            AI Generate
                          </AnimatedButton>
                        )}
                        <Tooltip title="Get personalized tips for your summary">
                          <Button variant="outlined" size="small">
                            <GpsFixedIcon sx={{}} />
                          </Button>
                        </Tooltip>
                      </div>

                      <Textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Write a compelling professional summary that highlights your key achievements, skills, and career objectives..."
                        sx={{
      h: "150px",}}
                      />

                      <div sx={{
      typography: "body2",}}>
                        <span className={summary.length > 300 ? 'text-amber-600' : ''}>
                          {summary.length}/300 characters
                        </span>
                        {summary.length > 0 && (
                          <div sx={{
      mt: 1,
      display: "flex",
      gap: 4
    }}>
                            <span>Readability: Good</span>
                            <span>
                              Keywords:{' '}
                              {
                                summary
                                  .split(' ')
                                  .filter((word) =>
                                    ['experience', 'skilled', 'professional', 'expertise'].some(
                                      (keyword) =>
                                        word.toLowerCase().includes(keyword.toLowerCase())
                                    )
                                  ).length
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" currentValue={activeTab} sx={{}}>
              <>
                <Card sx={{
      p: 6
    }}>
                  <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 6
    }}>
                    <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
                      <div sx={{
      p: 2,
      bgcolor: "purple.100",
      borderRadius: "var(--sys-shape-radius-md)"
    }}>
                        <EmojiEventsIcon sx={{
      color: "purple.600"
    }} />
                      </div>
                      <h3 sx={{
      fontWeight: 600,
      typography: "h6"
    }}>Skills & Expertise</h3>
                    </div>
                    <Button variant="outlined" size="small">
                      <AddIcon sx={{
      mr: 2
    }} />
                      Import from Resume
                    </Button>
                  </div>

                  {/* Add New Skill */}
                  <div sx={{
      display: "flex",
      gap: 2,
      mb: 6
    }}>
                    <Input
                      placeholder="Add a skill (e.g., JavaScript, Project Management)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      sx={{
      flex: 1
    }}
                    />
                    <FormControl sx={{ width: 120 }}>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={selectedCategory}
                        label="Category"
                        onChange={(e) =>
                          setSelectedCategory(
                            e.target.value as 'technical' | 'soft' | 'industry' | 'language'
                          )
                        }
                      >
                        <MenuItem value="technical">Technical</MenuItem>
                        <MenuItem value="soft">Soft Skills</MenuItem>
                        <MenuItem value="industry">Industry</MenuItem>
                        <MenuItem value="language">Language</MenuItem>
                      </Select>
                    </FormControl>
                    <Button onClick={addSkill}>
                      <AddIcon sx={{}} />
                    </Button>
                  </div>

                  {/* Skills Grid */}
                  <div sx={{}}>
                    {['technical', 'soft', 'industry', 'language'].map((category) => {
                      const categorySkills = skills.filter((skill) => skill.category === category);
                      if (categorySkills.length === 0) return null;

                      return (
                        <div key={category}>
                          <h4 sx={{
      fontWeight: 500,
      typography: "body1",
      textTransform: "uppercase",
      mb: 3
    }}>
                            {category} Skills ({categorySkills.length})
                          </h4>
                          <div sx={{
      gap: 4
    }}>
                            {categorySkills.map((skill) => (
                              <Card key={skill.keyword} sx={{
      p: 4,
      border: 1,
      borderColor: "gray.200"
    }}>
                                <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mb: 3
    }}>
                                  <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
                                    <Badge className={getCategoryColor(skill.category)}>
                                      {skill.keyword}
                                    </Badge>
                                    {skill.yearsOfExperience && (
                                      <span sx={{
      typography: "body2",}}>
                                        {skill.yearsOfExperience}+ years
                                      </span>
                                    )}
                                  </div>
                                  <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                                    <span sx={{
      typography: "body2",}}>
                                      Level {skill.level}/10
                                    </span>
                                    <Button
                                      variant="text"
                                      size="small"
                                      sx={{}}
                                      onClick={() => removeSkill(skill.keyword)}
                                    >
                                      <CloseIcon sx={{}} />
                                    </Button>
                                  </div>
                                </div>

                                <div sx={{}}>
                                  <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                                    <span sx={{
      typography: "body2",}}>
                                      Proficiency:
                                    </span>
                                    <Slider
                                      value={[skill.level]}
                                      onChange={(_event, value) =>
                                        updateSkillLevel(
                                          skill.keyword,
                                          Array.isArray(value) ? value[0] : value
                                        )
                                      }
                                      max={10}
                                      step={1}
                                      sx={{
      flex: 1
    }}
                                    />
                                  </div>
                                  <Progress value={skill.level * 10} sx={{}} />
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Skill Suggestions */}
                  <Card sx={{
      p: 4,
      bgcolor: "blue.50",
      borderColor: "blue.200"
    }}>
                    <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      mb: 3
    }}>
                      <EmojiObjectsIcon sx={{
      color: "blue.600"
    }} />
                      <h4 sx={{
      fontWeight: 500,}}>AI Skill Suggestions</h4>
                    </div>
                    <div sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2
    }}>
                      {[
                        'Team Leadership',
                        'Data Analysis',
                        'Customer Service',
                        'Problem Solving',
                      ].map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outlined"
                          size="small"
                          sx={{
      typography: "body2",
      borderColor: "blue.300",
      '&:hover': { bgcolor: "blue.100" }
    }}
                          onClick={() => setNewSkill(suggestion)}
                        >
                          <AddIcon sx={{
      mr: 1
    }} />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </Card>
                </Card>
              </>
            </TabsContent>

            {/* Social & Links Tab */}
            <TabsContent value="social" currentValue={activeTab} sx={{}}>
              <>
                <Card sx={{
      p: 6
    }}>
                  <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 6
    }}>
                    <div sx={{
      p: 2,
      bgcolor: "indigo.100",
      borderRadius: "var(--sys-shape-radius-md)"
    }}>
                      <PublicIcon sx={{
      color: "indigo.600"
    }} />
                    </div>
                    <h3 sx={{
      fontWeight: 600,
      typography: "h6"
    }}>Social Links & Online Presence</h3>
                  </div>

                  <div sx={{}}>
                    {socialLinks.map((link, index) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <div key={index} sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      p: 3,
      border: 1,
      borderRadius: "var(--sys-shape-radius-md)"
    }}>
                          <Icon sx={{}} />
                          <div sx={{
      flex: 1
    }}>
                            <Input
                              value={link.url}
                              onChange={(e) => {
                                const newLinks = [...socialLinks];
                                newLinks[index].url = e.target.value;
                                setSocialLinks(newLinks);
                              }}
                              placeholder={`Your ${link.platform} profile URL`}
                            />
                          </div>
                          {link.verified && (
                            <Tooltip title="Verified profile">
                              <span>
                                <CheckCircleIcon sx={{
      color: "green.500"
    }} />
                              </span>
                            </Tooltip>
                          )}
                          <Button variant="text" size="small" sx={{
      color: "red.500"
    }}>
                            <CloseIcon sx={{}} />
                          </Button>
                        </div>
                      );
                    })}

                    <Button
                      variant="outlined"
                      sx={{
      width: "100%"
    }}
                      onClick={() =>
                        setSocialLinks([
                          ...socialLinks,
                          { platform: 'website', url: '', verified: false },
                        ])
                      }
                    >
                      <AddIcon sx={{
      mr: 2
    }} />
                      Add Social Link
                    </Button>
                  </div>
                </Card>
              </>
            </TabsContent>

            {/* Privacy Settings Tab */}
            <TabsContent value="settings" currentValue={activeTab} sx={{}}>
              <>
                <Card sx={{
      p: 6
    }}>
                  <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      mb: 6
    }}>
                    <div sx={{
      p: 2,
      bgcolor: "red.100",
      borderRadius: "var(--sys-shape-radius-md)"
    }}>
                      <SettingsIcon sx={{
      color: "red.600"
    }} />
                    </div>
                    <h3 sx={{
      fontWeight: 600,
      typography: "h6"
    }}>Privacy & Preferences</h3>
                  </div>

                  <div sx={{}}>
                    {/* Profile Visibility */}
                    <div sx={{}}>
                      <label sx={{
      typography: "body1",
      fontWeight: 500
    }}>Profile Visibility</label>
                      <Select
                        value={profileSettings.privacy}
                        onChange={(e) =>
                          setProfileSettings({
                            ...profileSettings,
                            privacy: e.target.value as 'public' | 'private' | 'connections',
                          })
                        }
                        fullWidth
                      >
                        <MenuItem value="public">Public - Visible to everyone</MenuItem>
                        <MenuItem value="connections">Connections Only</MenuItem>
                        <MenuItem value="private">Private - Only me</MenuItem>
                      </Select>
                    </div>

                    {/* Work Preferences */}
                    <Separator />
                    <div sx={{}}>
                      <h4 sx={{
      fontWeight: 500
    }}>Work Preferences</h4>

                      <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
                        <div>
                          <p sx={{
      fontWeight: 500,
      typography: "body1"
    }}>Open to Opportunities</p>
                          <p sx={{
      typography: "body2",}}>
                            Let recruiters know you're available
                          </p>
                        </div>
                        <Switch
                          checked={profileSettings.openToOpportunities}
                          onCheckedChange={(checked) =>
                            setProfileSettings({ ...profileSettings, openToOpportunities: checked })
                          }
                        />
                      </div>

                      <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
                        <div>
                          <p sx={{
      fontWeight: 500,
      typography: "body1"
    }}>Show Location</p>
                          <p sx={{
      typography: "body2",}}>
                            Display your location publicly
                          </p>
                        </div>
                        <Switch
                          checked={profileSettings.showLocation}
                          onCheckedChange={(checked) =>
                            setProfileSettings({ ...profileSettings, showLocation: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            </TabsContent>
          </Tabs>

          {/* Enhanced Actions */}
          <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mt: 8,
      pt: 6,
      borderTop: 1
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 4
    }}>
              <Button variant="outlined" onClick={onBack} size="large">
                <ArrowLeftIcon sx={{
      mr: 2
    }} />
                Back
              </Button>
              <div sx={{
      typography: "body1",}}>
                <CheckCircleIcon sx={{
      mr: 1,
      color: "green.500"
    }} />
                Auto-saved 2 minutes ago
              </div>
            </div>

            <div sx={{
      display: "flex",
      gap: 2
    }}>
              <Button variant="outlined" size="large">
                <VisibilityIcon sx={{
      mr: 2
    }} />
                Preview
              </Button>
              <Button
                onClick={onNext}
                size="large"
                sx={{
      '&:hover': {},
      '&:hover': {}
    }}
              >
                <StarIcon sx={{
      mr: 2
    }} />
                Save Profile & Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
