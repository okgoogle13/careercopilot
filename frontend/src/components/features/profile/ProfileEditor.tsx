import {
  ArrowLeft,
  EmojiEvents as Award,
  Work as Briefcase,
  CameraAlt as Camera,
  CheckCircle,
  Code,
  Visibility as Eye,
  GitHub,
  Public as Globe,
  LinkedIn,
  LocationOn as MapPin,
  Add as Plus,
  Settings,
  EmojiObjects as Sparkles,
  Star,
  GpsFixed as Target,
  X as Twitter,
  Person as User,
  Close as X,
} from '@mui/icons-material';
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
      linkedin: LinkedIn,
      github: GitHub,
      twitter: Twitter,
      website: Globe,
      portfolio: Code,
    };
    return icons[platform as keyof typeof icons] || Globe;
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
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src={personalInfo.avatarUrl} />
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {personalInfo.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="small"
                  variant="outlined"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white shadow-sm"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-foreground">{personalInfo.fullName}</h1>
                <p className="text-lg text-muted-foreground">{personalInfo.title}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {personalInfo.location}
                </p>
              </div>
            </div>

            {/* Profile Strength Indicator */}
            <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Profile Strength</span>
                <Badge variant={calculateProfileStrength() >= 80 ? 'default' : 'secondary'}>
                  {calculateProfileStrength()}% Complete
                </Badge>
              </div>
              <AnimatedProgress value={calculateProfileStrength()} max={100} />
              <p className="text-xs text-muted-foreground mt-2">
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
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="experience" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Experience
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Skills
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Social & Links
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Privacy
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" currentValue={activeTab} className="space-y-6">
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-lg">Personal Details</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Full Name *</label>
                          <Input
                            value={personalInfo.fullName}
                            onChange={(e) =>
                              setPersonalInfo({ ...personalInfo, fullName: e.target.value })
                            }
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
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
                        <label className="text-sm font-medium mb-2 block">
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Email *</label>
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
                          <label className="text-sm font-medium mb-2 block">Phone</label>
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
                        <label className="text-sm font-medium mb-2 block">Location</label>
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
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Briefcase className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-lg">Professional Summary</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-2">
                        {isGenerating ? (
                          <AIProcessingLoading message="Generating AI summary..." />
                        ) : (
                          <AnimatedButton
                            variant="outlined"
                            animation="shimmer"
                            className="flex-1"
                            onClick={handleGenerateSummary}
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            AI Generate
                          </AnimatedButton>
                        )}
                        <Tooltip title="Get personalized tips for your summary">
                          <Button variant="outlined" size="small">
                            <Target className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      </div>

                      <Textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Write a compelling professional summary that highlights your key achievements, skills, and career objectives..."
                        className="min-h-[150px] resize-none"
                      />

                      <div className="text-xs text-muted-foreground">
                        <span className={summary.length > 300 ? 'text-amber-600' : ''}>
                          {summary.length}/300 characters
                        </span>
                        {summary.length > 0 && (
                          <div className="mt-1 flex gap-4">
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
            <TabsContent value="skills" currentValue={activeTab} className="space-y-6">
              <>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Award className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-lg">Skills & Expertise</h3>
                    </div>
                    <Button variant="outlined" size="small">
                      <Plus className="w-4 h-4 mr-2" />
                      Import from Resume
                    </Button>
                  </div>

                  {/* Add New Skill */}
                  <div className="flex gap-2 mb-6">
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
                      className="flex-1"
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
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Skills Grid */}
                  <div className="space-y-6">
                    {['technical', 'soft', 'industry', 'language'].map((category) => {
                      const categorySkills = skills.filter((skill) => skill.category === category);
                      if (categorySkills.length === 0) return null;

                      return (
                        <div key={category}>
                          <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-3">
                            {category} Skills ({categorySkills.length})
                          </h4>
                          <div className="grid gap-4">
                            {categorySkills.map((skill) => (
                              <Card key={skill.keyword} className="p-4 border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <Badge className={getCategoryColor(skill.category)}>
                                      {skill.keyword}
                                    </Badge>
                                    {skill.yearsOfExperience && (
                                      <span className="text-xs text-muted-foreground">
                                        {skill.yearsOfExperience}+ years
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                      Level {skill.level}/10
                                    </span>
                                    <Button
                                      variant="text"
                                      size="small"
                                      className="h-6 w-6"
                                      onClick={() => removeSkill(skill.keyword)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground w-16">
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
                                      className="flex-1"
                                    />
                                  </div>
                                  <Progress value={skill.level * 10} className="h-2" />
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Skill Suggestions */}
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <h4 className="font-medium text-blue-900">AI Skill Suggestions</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
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
                          className="text-xs border-blue-300 hover:bg-blue-100"
                          onClick={() => setNewSkill(suggestion)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </Card>
                </Card>
              </>
            </TabsContent>

            {/* Social & Links Tab */}
            <TabsContent value="social" currentValue={activeTab} className="space-y-6">
              <>
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Globe className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Social Links & Online Presence</h3>
                  </div>

                  <div className="space-y-4">
                    {socialLinks.map((link, index) => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Icon className="w-5 h-5 text-muted-foreground" />
                          <div className="flex-1">
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
                              <span><CheckCircle className="w-5 h-5 text-green-500" /></span>
                            </Tooltip>
                          )}
                          <Button variant="text" size="small" className="text-red-500">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}

                    <Button
                      variant="outlined"
                      className="w-full"
                      onClick={() =>
                        setSocialLinks([
                          ...socialLinks,
                          { platform: 'website', url: '', verified: false },
                        ])
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Social Link
                    </Button>
                  </div>
                </Card>
              </>
            </TabsContent>

            {/* Privacy Settings Tab */}
            <TabsContent value="settings" currentValue={activeTab} className="space-y-6">
              <>
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Settings className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Privacy & Preferences</h3>
                  </div>

                  <div className="space-y-6">
                    {/* Profile Visibility */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Profile Visibility</label>
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
                    <div className="space-y-4">
                      <h4 className="font-medium">Work Preferences</h4>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Open to Opportunities</p>
                          <p className="text-xs text-muted-foreground">
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

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Show Location</p>
                          <p className="text-xs text-muted-foreground">
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
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <div className="flex items-center gap-4">
              <Button variant="outlined" onClick={onBack} size="large">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" />
                Auto-saved 2 minutes ago
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outlined" size="large">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={onNext}
                size="large"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Star className="w-4 h-4 mr-2" />
                Save Profile & Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
