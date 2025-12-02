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
import { Box, Typography } from '@mui/material';
import { Button, Card, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
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
      technical: {
        backgroundColor: 'var(--sys-color-tertiary-container)',
        color: 'var(--sys-color-on-tertiary-container)',
        borderColor: 'var(--sys-color-tertiary-container)',
      },
      soft: {
        backgroundColor: 'var(--sys-color-secondary-container)',
        color: 'var(--sys-color-on-secondary-container)',
        borderColor: 'var(--sys-color-secondary-container)',
      },
      industry: {
        backgroundColor: 'var(--sys-color-primary-container)',
        color: 'var(--sys-color-on-primary-container)',
        borderColor: 'var(--sys-color-primary-container)',
      },
      language: {
        backgroundColor: 'var(--sys-color-tertiary-container)',
        color: 'var(--sys-color-on-tertiary-container)',
        borderColor: 'var(--sys-color-tertiary-container)',
      },
    };
    return colors[category as keyof typeof colors] || {
      backgroundColor: 'var(--sys-color-surface-variant)',
      color: 'var(--sys-color-on-surface-variant)',
      borderColor: 'var(--sys-color-outline)',
    };
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
      <Box sx={{ minHeight: '100vh', p: 'var(--sys-space-4)', backgroundColor: 'var(--sys-color-surface)' }}>
        <Box>
          {/* Enhanced Header */}
          <Box sx={{ textAlign: 'center', mb: 'var(--sys-space-8)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sys-space-4)', mb: 'var(--sys-space-6)' }}>
              <Box>
                <Avatar sx={{ border: '4px solid var(--sys-color-surface)', boxShadow: 'var(--sys-elevation-level2)', width: 'var(--sys-icon-size-xlarge)', height: 'var(--sys-icon-size-xlarge)' }}>
                  <AvatarImage src={personalInfo.avatarUrl} />
                  <AvatarFallback sx={{ typography: 'var(--sys-type-headline-small)', fontWeight: 'var(--sys-type-weight-medium)', color: 'var(--sys-color-on-primary-container)', backgroundColor: 'var(--sys-color-primary-container)' }}>
                    {personalInfo.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ borderRadius: 'var(--sys-shape-corner-full)', backgroundColor: 'var(--sys-color-surface)', boxShadow: 'var(--sys-elevation-level1)', position: 'relative', top: '-24px', left: '24px', minWidth: 'auto', padding: 'var(--sys-space-1)', '&:hover': { backgroundColor: 'var(--sys-color-surface-container-hover)'} }}
                >
                  <CameraAltIcon sx={{ fontSize: 'var(--sys-icon-size-medium)' }} />
                </Button>
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="h1" sx={{ fontFamily: 'var(--sys-type-font-family-brand)', fontSize: 'var(--sys-type-size-display-small)', fontWeight: 'var(--sys-type-weight-bold)', color: 'var(--sys-color-on-surface)' }}>{personalInfo.fullName}</Typography>
                <Typography variant="h2" sx={{ fontFamily: 'var(--sys-type-font-family-brand)', fontSize: 'var(--sys-type-size-headline-small)', color: 'var(--sys-color-on-surface-variant)' }}>{personalInfo.title}</Typography>
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-1)', color: 'var(--sys-color-on-surface-variant)' }}>
                  <LocationOnIcon sx={{ fontSize: 'var(--sys-icon-size-small)' }} />
                  {personalInfo.location}
                </Typography>
              </Box>
            </Box>

            {/* Profile Strength Indicator */}
            <Card sx={{ p: 'var(--sys-space-4)', mb: 'var(--sys-space-6)', border: '1px solid var(--sys-color-outline-variant)', borderRadius: 'var(--sys-shape-corner-medium)', boxShadow: 'var(--sys-elevation-level1)', backgroundColor: 'var(--sys-color-surface-container-low)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 'var(--sys-space-2)' }}>
                <Typography sx={{ fontWeight: 'var(--sys-type-weight-medium)', color: 'var(--sys-color-on-surface)' }}>Profile Strength</Typography>
                <Badge variant={calculateProfileStrength() >= 80 ? 'default' : 'secondary'} sx={{ backgroundColor: 'var(--sys-color-primary)', color: 'var(--sys-color-on-primary)'}}>
                  {calculateProfileStrength()}% Complete
                </Badge>
              </Box>
              <AnimatedProgress value={calculateProfileStrength()} max={100} />
              <Typography sx={{ color: 'var(--sys-color-on-surface-variant)', mt: 'var(--sys-space-2)' }}>
                {calculateProfileStrength() >= 90
                  ? 'Excellent! Your profile is highly optimized.'
                  : calculateProfileStrength() >= 70
                    ? 'Good progress! Add more details to stand out.'
                    : 'Keep building! A strong profile increases your opportunities.'}
              </Typography>
            </Card>
          </Box>

          {/* Enhanced Navigation */}
          <Tabs
            value={activeTab}
            onChange={(_e, newValue) => setActiveTab(newValue as string)}
            sx={{ width: '100%' }}
          >
            <TabsList sx={{ width: '100%', mb: 'var(--sys-space-8)', borderBottom: '1px solid var(--sys-color-outline-variant)', justifyContent: 'space-around' }}>
              <TabsTrigger value="basic" sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-2)', p: 'var(--sys-space-3)', color: 'var(--sys-color-on-surface-variant)', '&[data-state="active"]': { color: 'var(--sys-color-primary)', borderBottom: '2px solid var(--sys-color-primary)'} }}>
                <PersonIcon sx={{ fontSize: 'var(--sys-icon-size-medium)' }} />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="experience" sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-2)', p: 'var(--sys-space-3)', color: 'var(--sys-color-on-surface-variant)', '&[data-state="active"]': { color: 'var(--sys-color-primary)', borderBottom: '2px solid var(--sys-color-primary)'} }}>
                <WorkIcon sx={{ fontSize: 'var(--sys-icon-size-medium)' }} />
                Experience
              </TabsTrigger>
              <TabsTrigger value="skills" sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-2)', p: 'var(--sys-space-3)', color: 'var(--sys-color-on-surface-variant)', '&[data-state="active"]': { color: 'var(--sys-color-primary)', borderBottom: '2px solid var(--sys-color-primary)'} }}>
                <EmojiEventsIcon sx={{ fontSize: 'var(--sys-icon-size-medium)' }} />
                Skills
              </TabsTrigger>
              <TabsTrigger value="social" sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-2)', p: 'var(--sys-space-3)', color: 'var(--sys-color-on-surface-variant)', '&[data-state="active"]': { color: 'var(--sys-color-primary)', borderBottom: '2px solid var(--sys-color-primary)'} }}>
                <PublicIcon sx={{ fontSize: 'var(--sys-icon-size-medium)' }} />
                Social & Links
              </TabsTrigger>
              <TabsTrigger value="settings" sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-2)', p: 'var(--sys-space-3)', color: 'var(--sys-color-on-surface-variant)', '&[data-state="active"]': { color: 'var(--sys-color-primary)', borderBottom: '2px solid var(--sys-color-primary)'} }}>
                <SettingsIcon sx={{ fontSize: 'var(--sys-icon-size-medium)' }} />
                Privacy
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" currentValue={activeTab}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr' }, gap: 'var(--sys-space-6)' }}>
                  {/* Personal Information */}
                  <Card sx={{ p: 'var(--sys-space-6)', borderRadius: 'var(--sys-shape-corner-medium)', boxShadow: 'var(--sys-elevation-level1)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-3)', mb: 'var(--sys-space-6)' }}>
                      <Box sx={{ p: 'var(--sys-space-2)', backgroundColor: 'var(--sys-color-primary-container)', borderRadius: 'var(--sys-shape-corner-medium)' }}>
                        <PersonIcon sx={{ color: 'var(--sys-color-on-primary-container)' }} />
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 'var(--sys-type-weight-medium)', fontSize: 'var(--sys-type-size-title-large)' }}>Personal Details</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--sys-space-4)' }}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 'var(--sys-space-4)' }}>
                        <Box>
                          <label sx={{ display: 'block', fontWeight: 'var(--sys-type-weight-medium)', mb: 'var(--sys-space-2)'}}>Full Name *</label>
                          <Input
                            value={personalInfo.fullName}
                            onChange={(e) =>
                              setPersonalInfo({ ...personalInfo, fullName: e.target.value })
                            }
                            placeholder="Enter full name"
                          />
                        </Box>
                        <Box>
                          <label sx={{ display: 'block', fontWeight: 'var(--sys-type-weight-medium)', mb: 'var(--sys-space-2)'}}>
                            Professional Title
                          </label>
                          <Input
                            value={personalInfo.title}
                            onChange={(e) =>
                              setPersonalInfo({ ...personalInfo, title: e.target.value })
                            }
                            placeholder="e.g., Senior Developer"
                          />
                        </Box>
                      </Box>

                      <Box>
                        <label sx={{ display: 'block', fontWeight: 'var(--sys-type-weight-medium)', mb: 'var(--sys-space-2)'}}>
                          Professional Tagline
                        </label>
                        <Input
                          value={personalInfo.tagline}
                          onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, tagline: e.target.value })
                          }
                          placeholder="A brief, compelling description"
                        />
                      </Box>

                      <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 'var(--sys-space-4)' }}>
                        <Box>
                          <label sx={{ display: 'block', fontWeight: 'var(--sys-type-weight-medium)', mb: 'var(--sys-space-2)'}}>Email *</label>
                          <Input
                            type="email"
                            value={personalInfo.email}
                            onChange={(e) =>
                              setPersonalInfo({ ...personalInfo, email: e.target.value })
                            }
                            placeholder="professional@email.com"
                          />
                        </Box>
                        <Box>
                          <label sx={{ display: 'block', fontWeight: 'var(--sys-type-weight-medium)', mb: 'var(--sys-space-2)'}}>Phone</label>
                          <Input
                            value={personalInfo.phone}
                            onChange={(e) =>
                              setPersonalInfo({ ...personalInfo, phone: e.target.value })
                            }
                            placeholder="+1 (555) 123-4567"
                          />
                        </Box>
                      </Box>

                      <Box>
                        <label sx={{ display: 'block', fontWeight: 'var(--sys-type-weight-medium)', mb: 'var(--sys-space-2)'}}>Location</label>
                        <Input
                          value={personalInfo.location}
                          onChange={(e) =>
                            setPersonalInfo({ ...personalInfo, location: e.target.value })
                          }
                          placeholder="City, State/Province, Country"
                        />
                      </Box>
                    </Box>
                  </Card>

                  {/* Professional Summary */}
                  <Card sx={{ p: 'var(--sys-space-6)', borderRadius: 'var(--sys-shape-corner-medium)', boxShadow: 'var(--sys-elevation-level1)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-3)', mb: 'var(--sys-space-6)' }}>
                      <Box sx={{ p: 'var(--sys-space-2)', backgroundColor: 'var(--sys-color-secondary-container)', borderRadius: 'var(--sys-shape-corner-medium)' }}>
                        <WorkIcon sx={{ color: 'var(--sys-color-on-secondary-container)' }} />
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 'var(--sys-type-weight-medium)', fontSize: 'var(--sys-type-size-title-large)' }}>Professional Summary</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--sys-space-4)' }}>
                      <Box sx={{ display: 'flex', gap: 'var(--sys-space-2)' }}>
                        {isGenerating ? (
                          <AIProcessingLoading message="Generating AI summary..." />
                        ) : (
                          <AnimatedButton
                            variant="outlined"
                            animation="shimmer"
                            sx={{ flex: 1, backgroundColor: 'var(--sys-color-primary)', color: 'var(--sys-color-on-primary)' }}
                            onClick={handleGenerateSummary}
                          >
                            <EmojiObjectsIcon sx={{ mr: 'var(--sys-space-2)'}} />
                            AI Generate
                          </AnimatedButton>
                        )}
                        <Tooltip title="Get personalized tips for your summary">
                          <Button variant="outlined" size="small" sx={{ borderColor: 'var(--sys-color-outline)'}}>
                            <GpsFixedIcon />
                          </Button>
                        </Tooltip>
                      </Box>

                      <Textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Write a compelling professional summary that highlights your key achievements, skills, and career objectives..."
                        sx={{ minHeight: '150px' }}
                      />

                      <Box sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                        <span style={{ color: summary.length > 300 ? 'var(--sys-color-error)' : 'inherit' }}>
                          {summary.length}/300 characters
                        </span>
                        {summary.length > 0 && (
                          <Box sx={{ mt: 'var(--sys-space-1)', display: 'flex', gap: 'var(--sys-space-4)' }}>
                            <Typography variant="body2">Readability: Good</Typography>
                            <Typography variant="body2">
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
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Card>
                </Box>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" currentValue={activeTab}>
                <Card sx={{ p: 'var(--sys-space-6)', borderRadius: 'var(--sys-shape-corner-medium)', boxShadow: 'var(--sys-elevation-level1)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 'var(--sys-space-6)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-3)' }}>
                      <Box sx={{ p: 'var(--sys-space-2)', backgroundColor: 'var(--sys-color-tertiary-container)', borderRadius: 'var(--sys-shape-corner-medium)' }}>
                        <EmojiEventsIcon sx={{ color: 'var(--sys-color-on-tertiary-container)' }} />
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 'var(--sys-type-weight-medium)', fontSize: 'var(--sys-type-size-title-large)' }}>Skills & Expertise</Typography>
                    </Box>
                    <Button variant="outlined" size="small" sx={{ borderColor: 'var(--sys-color-outline)', color: 'var(--sys-color-primary)' }}>
                      <AddIcon sx={{ mr: 'var(--sys-space-2)' }} />
                      Import from Resume
                    </Button>
                  </Box>

                  {/* Add New Skill */}
                  <Box sx={{ display: 'flex', gap: 'var(--sys-space-2)', mb: 'var(--sys-space-6)' }}>
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
                      sx={{ flex: 1 }}
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
                    <Button onClick={addSkill} variant="contained" sx={{ backgroundColor: 'var(--sys-color-primary)', color: 'var(--sys-color-on-primary)'}}>
                      <AddIcon />
                    </Button>
                  </Box>

                  {/* Skills Grid */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--sys-space-6)'}}>
                    {['technical', 'soft', 'industry', 'language'].map((category) => {
                      const categorySkills = skills.filter((skill) => skill.category === category);
                      if (categorySkills.length === 0) return null;

                      return (
                        <Box key={category}>
                          <Typography variant="h4" sx={{ fontWeight: 'var(--sys-type-weight-medium)', fontSize: 'var(--sys-type-size-label-large)', textTransform: 'uppercase', mb: 'var(--sys-space-3)', color: 'var(--sys-color-on-surface-variant)' }}>
                            {category} Skills ({categorySkills.length})
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--sys-space-4)' }}>
                            {categorySkills.map((skill) => (
                              <Card key={skill.keyword} sx={{ p: 'var(--sys-space-4)', border: '1px solid var(--sys-color-outline-variant)', borderRadius: 'var(--sys-shape-corner-medium)', boxShadow: 'var(--sys-elevation-level0)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 'var(--sys-space-3)' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-3)' }}>
                                    <Badge style={getCategoryColor(skill.category)}>
                                      {skill.keyword}
                                    </Badge>
                                    {skill.yearsOfExperience && (
                                      <Typography variant="body2" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                                        {skill.yearsOfExperience}+ years
                                      </Typography>
                                    )}
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-2)' }}>
                                    <Typography variant="body2" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                                      Level {skill.level}/10
                                    </Typography>
                                    <Button
                                      variant="text"
                                      size="small"
                                      sx={{ minWidth: 'auto', p: 'var(--sys-space-1)', color: 'var(--sys-color-on-surface-variant)' }}
                                      onClick={() => removeSkill(skill.keyword)}
                                    >
                                      <CloseIcon sx={{ fontSize: 'var(--sys-icon-size-small)' }} />
                                    </Button>
                                  </Box>
                                </Box>

                                <Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-2)' }}>
                                    <Typography variant="body2" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                                      Proficiency:
                                    </Typography>
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
                                      sx={{ flex: 1 }}
                                    />
                                  </Box>
                                  <Progress value={skill.level * 10} sx={{ mt: 'var(--sys-space-1)' }} />
                                </Box>
                              </Card>
                            ))}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>

                  {/* Skill Suggestions */}
                  <Card sx={{ p: 'var(--sys-space-4)', backgroundColor: 'var(--sys-color-tertiary-container)', border: '1px solid var(--sys-color-tertiary-container)', borderRadius: 'var(--sys-shape-corner-medium)', mt: 'var(--sys-space-6)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-2)', mb: 'var(--sys-space-3)' }}>
                      <EmojiObjectsIcon sx={{ color: 'var(--sys-color-on-tertiary-container)' }} />
                      <Typography variant="h4" sx={{ fontWeight: 'var(--sys-type-weight-medium)', color: 'var(--sys-color-on-tertiary-container)' }}>AI Skill Suggestions</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sys-space-2)' }}>
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
                          sx={{ borderColor: 'var(--sys-color-on-tertiary-container)', color: 'var(--sys-color-on-tertiary-container)', '&:hover': { backgroundColor: 'var(--sys-color-tertiary)' } }}
                          onClick={() => setNewSkill(suggestion)}
                        >
                          <AddIcon sx={{ mr: 'var(--sys-space-1)' }} />
                          {suggestion}
                        </Button>
                      ))}
                    </Box>
                  </Card>
                </Card>
            </TabsContent>

            {/* Social & Links Tab */}
            <TabsContent value="social" currentValue={activeTab}>
                <Card sx={{ p: 'var(--sys-space-6)', borderRadius: 'var(--sys-shape-corner-medium)', boxShadow: 'var(--sys-elevation-level1)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-3)', mb: 'var(--sys-space-6)' }}>
                    <Box sx={{ p: 'var(--sys-space-2)', backgroundColor: 'var(--sys-color-primary-container)', borderRadius: 'var(--sys-shape-corner-medium)' }}>
                      <PublicIcon sx={{ color: 'var(--sys-color-on-primary-container)' }} />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 'var(--sys-type-weight-medium)', fontSize: 'var(--sys-type-size-title-large)' }}>Social Links & Online Presence</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--sys-space-4)' }}>
                    {socialLinks.map((link, index) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-3)', p: 'var(--sys-space-3)', border: '1px solid var(--sys-color-outline-variant)', borderRadius: 'var(--sys-shape-corner-medium)' }}>
                          <Icon sx={{ color: 'var(--sys-color-on-surface-variant)' }} />
                          <Box sx={{ flex: 1 }}>
                            <Input
                              value={link.url}
                              onChange={(e) => {
                                const newLinks = [...socialLinks];
                                newLinks[index].url = e.target.value;
                                setSocialLinks(newLinks);
                              }}
                              placeholder={`Your ${link.platform} profile URL`}
                            />
                          </Box>
                          {link.verified && (
                            <Tooltip title="Verified profile">
                              <span>
                                <CheckCircleIcon sx={{ color: 'var(--sys-color-tertiary)' }} />
                              </span>
                            </Tooltip>
                          )}
                          <Button variant="text" size="small" sx={{ color: 'var(--sys-color-error)', minWidth: 'auto', p: 'var(--sys-space-1)' }}>
                            <CloseIcon />
                          </Button>
                        </Box>
                      );
                    })}

                    <Button
                      variant="outlined"
                      sx={{ width: '100%', borderColor: 'var(--sys-color-outline)', color: 'var(--sys-color-primary)' }}
                      onClick={() =>
                        setSocialLinks([
                          ...socialLinks,
                          { platform: 'website', url: '', verified: false },
                        ])
                      }
                    >
                      <AddIcon sx={{ mr: 'var(--sys-space-2)' }} />
                      Add Social Link
                    </Button>
                  </Box>
                </Card>
            </TabsContent>

            {/* Privacy Settings Tab */}
            <TabsContent value="settings" currentValue={activeTab}>
                <Card sx={{ p: 'var(--sys-space-6)', borderRadius: 'var(--sys-shape-corner-medium)', boxShadow: 'var(--sys-elevation-level1)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-3)', mb: 'var(--sys-space-6)' }}>
                    <Box sx={{ p: 'var(--sys-space-2)', backgroundColor: 'var(--sys-color-error-container)', borderRadius: 'var(--sys-shape-corner-medium)' }}>
                      <SettingsIcon sx={{ color: 'var(--sys-color-on-error-container)' }} />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 'var(--sys-type-weight-medium)', fontSize: 'var(--sys-type-size-title-large)' }}>Privacy & Preferences</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--sys-space-6)' }}>
                    {/* Profile Visibility */}
                    <Box>
                      <label sx={{ display: 'block', fontWeight: 'var(--sys-type-weight-medium)', mb: 'var(--sys-space-2)'}}>Profile Visibility</label>
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
                    </Box>

                    {/* Work Preferences */}
                    <Separator />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--sys-space-4)' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'var(--sys-type-weight-medium)' }}>Work Preferences</Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography sx={{ fontWeight: 'var(--sys-type-weight-medium)' }}>Open to Opportunities</Typography>
                          <Typography variant="body2" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                            Let recruiters know you're available
                          </Typography>
                        </Box>
                        <Switch
                          checked={profileSettings.openToOpportunities}
                          onCheckedChange={(checked) =>
                            setProfileSettings({ ...profileSettings, openToOpportunities: checked })
                          }
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography sx={{ fontWeight: 'var(--sys-type-weight-medium)' }}>Show Location</Typography>
                          <Typography variant="body2" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                            Display your location publicly
                          </Typography>
                        </Box>
                        <Switch
                          checked={profileSettings.showLocation}
                          onCheckedChange={(checked) =>
                            setProfileSettings({ ...profileSettings, showLocation: checked })
                          }
                        />
                      </Box>
                    </Box>
                  </Box>
                </Card>
            </TabsContent>
          </Tabs>

          {/* Enhanced Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'var(--sys-space-8)', pt: 'var(--sys-space-6)', borderTop: '1px solid var(--sys-color-outline-variant)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--sys-space-4)' }}>
              <Button variant="outlined" onClick={onBack} size="large" sx={{ borderColor: 'var(--sys-color-outline)', color: 'var(--sys-color-primary)' }}>
                <ArrowLeftIcon sx={{ mr: 'var(--sys-space-2)' }} />
                Back
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'var(--sys-color-on-surface-variant)' }}>
                <CheckCircleIcon sx={{ mr: 'var(--sys-space-1)', color: 'var(--sys-color-tertiary)' }} />
                Auto-saved 2 minutes ago
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 'var(--sys-space-2)' }}>
              <Button variant="outlined" size="large" sx={{ borderColor: 'var(--sys-color-outline)', color: 'var(--sys-color-primary)' }}>
                <VisibilityIcon sx={{ mr: 'var(--sys-space-2)' }} />
                Preview
              </Button>
              <Button
                onClick={onNext}
                size="large"
                variant="contained"
                sx={{ backgroundColor: 'var(--sys-color-primary)', color: 'var(--sys-color-on-primary)', '&:hover': { backgroundColor: 'var(--sys-color-primary-dark)' } }}
              >
                <StarIcon sx={{ mr: 'var(--sys-space-2)' }} />
                Save Profile & Continue
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </TooltipProvider>
  );
}
