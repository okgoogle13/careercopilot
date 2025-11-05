import {
  ArrowLeft,
  EmojiEvents as Award,
  BarChart,
  Book as BookOpen,
  Work as Briefcase,
  Schedule as Clock,
  Description as FileText,
  Favorite as Heart,
  History,
  Lightbulb,
  Mail,
  Search,
  GpsFixed as Target,
  TrendingUp,
  People as Users,
  FlashOn as Zap,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import { Button, Card, Tooltip as MuiTooltip } from '@mui/material';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Skeleton } from '../../ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { TooltipProvider } from '../../ui/tooltip';
import { SkeletonLoading } from '../common/StandardizedLoadingStates';
import { AnimatedCard, StaggeredList } from '../demo/AnimatedComponents';

type DocumentCategory = 'all' | 'resume' | 'cover-letter' | 'other';

interface DocumentType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  category: DocumentCategory;
  tags: string[];
  isPopular?: boolean;
  isNew?: boolean;
  usageCount?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  successRate?: number; // percentage
  recommendedFor?: string[];
  aiPowered?: boolean;
}

interface DocumentTypeSelectorProps {
  onSelectType?: (type: string) => void;
  onSelect?: (type: 'resume' | 'cover-letter' | 'selection-criteria') => void;
  onBack: () => void;
  recentDocuments?: Array<{ id: string; type: string; title: string; lastOpened: Date }>;
  userProfile?: {
    experience: 'entry' | 'mid' | 'senior';
    industry: string;
    goals: string[];
    favoriteTemplates: string[];
  };
}

type DocumentCategoryExtended = DocumentCategory | 'favorites';

export function DocumentTypeSelector({
  onSelectType,
  onSelect,
  onBack,
  recentDocuments = [],
  userProfile,
}: DocumentTypeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategoryExtended>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(userProfile?.favoriteTemplates || []);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'recommended' | 'difficulty'>(
    'recommended'
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  const documentTypes: DocumentType[] = [
    {
      id: 'resume',
      title: 'Resume',
      description: 'Create a professional resume tailored to your target role',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      category: 'resume',
      tags: ['professional', 'ats-friendly', 'work history'],
      isPopular: true,
      usageCount: 1247,
      difficulty: 'beginner',
      estimatedTime: 45,
      successRate: 94,
      recommendedFor: ['job seekers', 'career changers', 'recent graduates'],
      aiPowered: true,
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter',
      description: 'Write a compelling cover letter that highlights your fit',
      icon: Mail,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      category: 'cover-letter',
      tags: ['introduction', 'personalized', 'professional'],
      usageCount: 892,
      difficulty: 'intermediate',
      estimatedTime: 30,
      successRate: 89,
      recommendedFor: ['experienced professionals', 'specific applications'],
      aiPowered: true,
    },
    {
      id: 'selection-criteria',
      title: 'Selection Criteria',
      description: 'Address key selection criteria with detailed examples',
      icon: Award,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      category: 'other',
      tags: ['government', 'detailed', 'examples'],
      isNew: true,
      usageCount: 156,
      difficulty: 'advanced',
      estimatedTime: 90,
      successRate: 78,
      recommendedFor: ['government roles', 'public sector'],
      aiPowered: false,
    },
    {
      id: 'linkedin-profile',
      title: 'LinkedIn Profile',
      description: 'Optimize your LinkedIn profile for recruiters',
      icon: Briefcase,
      color: 'text-sky-500',
      bgColor: 'bg-sky-500/10',
      category: 'resume',
      tags: ['social', 'recruiter', 'networking'],
      isPopular: true,
      usageCount: 674,
      difficulty: 'beginner',
      estimatedTime: 25,
      successRate: 91,
      recommendedFor: ['all professionals', 'networking'],
      aiPowered: true,
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      description: 'Showcase your best work and projects',
      icon: BookOpen,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      category: 'other',
      tags: ['creative', 'showcase', 'projects'],
      usageCount: 423,
      difficulty: 'intermediate',
      estimatedTime: 120,
      successRate: 85,
      recommendedFor: ['creative roles', 'freelancers', 'designers'],
      aiPowered: false,
    },
    {
      id: 'elevator-pitch',
      title: 'Elevator Pitch',
      description: 'Craft a compelling 30-second pitch about yourself',
      icon: Zap,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      category: 'other',
      tags: ['networking', 'interview', 'pitch'],
      usageCount: 321,
      difficulty: 'beginner',
      estimatedTime: 15,
      successRate: 82,
      recommendedFor: ['networking events', 'interviews'],
      aiPowered: true,
    },
  ];

  const categories = [
    { id: 'all', label: 'All Documents', icon: FileText },
    { id: 'resume', label: 'Resumes', icon: FileText },
    { id: 'cover-letter', label: 'Cover Letters', icon: Mail },
    { id: 'other', label: 'Other', icon: Lightbulb },
    { id: 'favorites', label: 'Favorites', icon: Heart },
  ];

  const toggleFavorite = (templateId: string) => {
    setFavorites((prev) =>
      prev.includes(templateId) ? prev.filter((id) => id !== templateId) : [...prev, templateId]
    );
  };

  const getRecommendationScore = (doc: DocumentType) => {
    let score = 0;

    // Base popularity score
    score += ((doc.usageCount || 0) / 1000) * 30;

    // Success rate bonus
    score += (doc.successRate || 0) * 0.4;

    // User experience match
    if (userProfile?.experience) {
      const expMap = { entry: 'beginner', mid: 'intermediate', senior: 'advanced' };
      if (doc.difficulty === expMap[userProfile.experience]) {
        score += 20;
      }
    }

    // AI-powered preference
    if (doc.aiPowered) score += 10;

    // Favorites bonus
    if (favorites.includes(doc.id)) score += 50;

    return Math.min(100, score);
  };

  const sortDocuments = (docs: DocumentType[]) => {
    switch (sortBy) {
      case 'popular':
        return docs.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
      case 'recent':
        return docs.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'difficulty':
        const diffOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        return docs.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
      case 'recommended':
      default:
        return docs.sort((a, b) => getRecommendationScore(b) - getRecommendationScore(a));
    }
  };

  const filteredDocuments = sortDocuments(
    documentTypes.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' ||
        doc.category === selectedCategory ||
        (selectedCategory === 'favorites' && favorites.includes(doc.id));

      return matchesSearch && matchesCategory;
    })
  );

  const handleKeyDown = (e: React.KeyboardEvent, typeId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectType?.(typeId);
    }
  };

  // Focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const renderDocumentCard = (doc: DocumentType) => {
    const Icon = doc.icon;
    const isFavorite = favorites.includes(doc.id);
    const recommendationScore = getRecommendationScore(doc);

    return (
      <TooltipProvider key={doc.id}>
        <AnimatedCard
          hover={true}
          tap={true}
          sx={{
      "group": true,
      "relative": true,
      overflow: "hidden",
      border: 1,
      "border-border": true,
      borderRadius: 0.5rem,
      cursor: "pointer"
    }}
        >
          <Card
            sx={{
      border: 0,
      boxShadow: 0
    }}
            onClick={() => onSelectType?.(doc.id)}
            onKeyDown={(e) => handleKeyDown(e, doc.id)}
            role="button"
            tabIndex={0}
          >
            {/* Recommendation Score Badge */}
            {sortBy === 'recommended' && recommendationScore > 70 && (
              <div sx={{
      "absolute": true,
      "top-2": true,
      "right-2": true,
      "z-10": true
    }}>
                <Badge sx={{
      "bg-gradient-to-r": true,
      "from-green-500": true,
      "to-emerald-500": true,
      color: "common.white",
      typography: body2
    }}>
                  {Math.round(recommendationScore)}% match
                </Badge>
              </div>
            )}

            <div sx={{
      p: 6,
      "space-y-4": true
    }}>
              <div sx={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between"
    }}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3,
      flex: 1
    }}>
                  <div sx={{
      p: 3,
      "${doc.bgColor}": true,
      borderRadius: 0.75rem,
      "relative": true
    }}>
                    <Icon sx={{
      "w-6": true,
      "h-6": true,
      "${doc.color}": true
    }} />
                    {doc.aiPowered && (
                      <div sx={{
      "absolute": true,
      "-top-1": true,
      "-right-1": true,
      "w-4": true,
      "h-4": true,
      bgcolor: "purple.500",
      borderRadius: 9999px,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
                        <Zap sx={{
      "w-2": true,
      "h-2": true,
      color: "common.white"
    }} />
                      </div>
                    )}
                  </div>
                  <div sx={{
      flex: 1
    }}>
                    <h3 sx={{
      typography: h6,
      fontWeight: 600,
      "text-foreground": true
    }}>{doc.title}</h3>
                    <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      mt: 1
    }}>
                      <Badge variant="outline" className={getDifficultyColor(doc.difficulty)}>
                        {doc.difficulty}
                      </Badge>
                      <span sx={{
      typography: body2,
      "text-muted-foreground": true,
      display: "flex",
      alignItems: "center",
      gap: 1
    }}>
                        <Clock sx={{
      "w-3": true,
      "h-3": true
    }} />
                        {formatTime(doc.estimatedTime)}
                      </span>
                    </div>
                  </div>
                </div>
                <div sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      alignItems: "flex-end"
    }}>
                  <MuiTooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                    <Button
                      variant="text"
                      size="small"
                      sx={{
      "h-8": true,
      "w-8": true
    }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(doc.id);
                      }}
                    >
                      <Heart
                        sx={{
      "w-4": true,
      "h-4": true,
      "${isFavorite": true,
      "?": true,
      "'fill-red-500": true,
      "text-red-500'": true,
      ":": true,
      "'text-muted-foreground'}": true
    }}
                      />
                    </Button>
                  </MuiTooltip>

                  <div sx={{
      display: "flex",
      gap: 1
    }}>
                    {doc.isNew && (
                      <Badge variant="secondary" sx={{
      bgcolor: "green.100",
      "text-green-800": true,
      typography: body2
    }}>
                        New
                      </Badge>
                    )}
                    {doc.isPopular && (
                      <Badge variant="secondary" sx={{
      bgcolor: "amber.100",
      "text-amber-800": true,
      typography: body2
    }}>
                        Popular
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <p sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>{doc.description}</p>

              {/* Analytics */}
              <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      typography: body2,
      "text-muted-foreground": true
    }}>
                <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
                  <span sx={{
      display: "flex",
      alignItems: "center",
      gap: 1
    }}>
                    <Users sx={{
      "w-3": true,
      "h-3": true
    }} />
                    {doc.usageCount?.toLocaleString() || 0} users
                  </span>
                  <span sx={{
      display: "flex",
      alignItems: "center",
      gap: 1
    }}>
                    <Target sx={{
      "w-3": true,
      "h-3": true
    }} />
                    {doc.successRate}% success
                  </span>
                </div>
                {doc.aiPowered && (
                  <MuiTooltip title="This template includes AI assistance for content generation">
                    <Badge
                      variant="outline"
                      sx={{
      bgcolor: "purple.50",
      color: "purple.700",
      borderColor: "purple.200"
    }}
                    >
                      AI-Powered
                    </Badge>
                  </MuiTooltip>
                )}
              </div>

              <div sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: 2,
      pt: 2
    }}>
                {doc.tags.slice(0, 3).map((tag, i) => (
                  <Badge key={i} variant="outline" sx={{
      typography: body2
    }}>
                    {tag}
                  </Badge>
                ))}
                {doc.tags.length > 3 && (
                  <Badge variant="outline" sx={{
      typography: body2
    }}>
                    +{doc.tags.length - 3} more
                  </Badge>
                )}
              </div>

              <Button
                sx={{
      width: "100%",
      mt: 4,
      "group-hover:bg-primary": true,
      "group-hover:text-primary-foreground": true
    }}
                variant="outlined"
                size="small"
              >
                Select Template
              </Button>
            </div>
          </Card>
        </AnimatedCard>
      </TooltipProvider>
    );
  };

  const renderSkeleton = () => (
    <Card sx={{
      p: 6,
      "space-y-4": true
    }}>
      <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
        <Skeleton sx={{
      "h-12": true,
      "w-12": true,
      borderRadius: 0.75rem
    }} />
        <Skeleton sx={{
      "h-6": true,
      "w-32": true
    }} />
      </div>
      <Skeleton sx={{
      "h-4": true,
      width: "100%"
    }} />
      <Skeleton sx={{
      "h-4": true,
      width: "75%"
    }} />
      <div sx={{
      display: "flex",
      gap: 2,
      pt: 2
    }}>
        <Skeleton sx={{
      "h-6": true,
      "w-16": true,
      borderRadius: 9999px
    }} />
        <Skeleton sx={{
      "h-6": true,
      "w-20": true,
      borderRadius: 9999px
    }} />
      </div>
      <Skeleton sx={{
      "h-9": true,
      width: "100%",
      mt: 4
    }} />
    </Card>
  );

  return (
    <div sx={{
      minHeight: "100vh",
      "bg-background": true,
      p: 4,
      [theme.breakpoints.up('sm')]: { p: 6 }
    }}>
      <div sx={{
      "max-w-6xl": true,
      "mx-auto": true,
      "space-y-8": true
    }}>
        {/* Header */}
        <div sx={{
      display: "flex",
      flexDirection: "column",
      gap: 4
    }}>
          <Button variant="text" size="small" onClick={onBack} sx={{
      "w-fit": true
    }}>
            <ArrowLeft sx={{
      "w-4": true,
      "h-4": true,
      mr: 2
    }} />
            Back to Dashboard
          </Button>

          <div sx={{
      "space-y-2": true
    }}>
            <h1 sx={{
      typography: h3,
      fontWeight: 700,
      "tracking-tight": true
    }}>Create New Document</h1>
            <p sx={{
      "text-muted-foreground": true
    }}>
              Select a template to get started with your next career document
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div sx={{
      "space-y-4": true
    }}>
          <div sx={{
      display: "flex",
      gap: 4
    }}>
            <div sx={{
      "relative": true,
      flex: 1
    }}>
              <Search sx={{
      "absolute": true,
      "left-3": true,
      "top-1/2": true,
      "h-4": true,
      "w-4": true,
      "-translate-y-1/2": true,
      "text-muted-foreground": true
    }} />
              <Input
                ref={searchInputRef}
                placeholder="Search templates..."
                sx={{
      pl: 10
    }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
              <span sx={{
      typography: body1,
      "text-muted-foreground": true
    }}>Sort by:</span>
              <Tabs value={sortBy} onChange={(_e, value) => setSortBy(value as any)}>
                <TabsList sx={{
      "grid": true,
      "grid-cols-4": true,
      w: "400px"
    }}>
                  <TabsTrigger value="recommended" sx={{
      typography: body2
    }}>
                    <TrendingUp sx={{
      "w-3": true,
      "h-3": true,
      mr: 1
    }} />
                    Recommended
                  </TabsTrigger>
                  <TabsTrigger value="popular" sx={{
      typography: body2
    }}>
                    <BarChart sx={{
      "w-3": true,
      "h-3": true,
      mr: 1
    }} />
                    Popular
                  </TabsTrigger>
                  <TabsTrigger value="recent" sx={{
      typography: body2
    }}>
                    <Clock sx={{
      "w-3": true,
      "h-3": true,
      mr: 1
    }} />
                    Recent
                  </TabsTrigger>
                  <TabsTrigger value="difficulty" sx={{
      typography: body2
    }}>
                    <Target sx={{
      "w-3": true,
      "h-3": true,
      mr: 1
    }} />
                    Difficulty
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <Tabs
            value={selectedCategory}
            onChange={(_e, value) => setSelectedCategory(value as DocumentCategoryExtended)}
            sx={{
      width: "100%"
    }}
          >
            <TabsList sx={{
      width: "100%",
      justifyContent: "flex-start",
      "overflow-x-auto": true
    }}>
              {categories.map((category) => {
                const Icon = category.icon;
                const count =
                  category.id === 'favorites'
                    ? favorites.length
                    : category.id === 'all'
                      ? documentTypes.length
                      : documentTypes.filter((d) => d.category === category.id).length;

                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}
                  >
                    <Icon sx={{
      "h-4": true,
      "w-4": true
    }} />
                    {category.label}
                    <Badge variant="secondary" sx={{
      ml: 1,
      typography: body2
    }}>
                      {count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
        {/* Recent Documents */}
        {recentDocuments.length > 0 && (
          <div sx={{
      "space-y-4": true
    }}>
            <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      "text-muted-foreground": true
    }}>
              <History sx={{
      "h-5": true,
      "w-5": true
    }} />
              <h2 sx={{
      fontWeight: 500
    }}>Recently Opened</h2>
            </div>
            <div sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      [theme.breakpoints.up('md')]: { "grid-cols-3": true },
      gap: 4
    }}>
              {recentDocuments.slice(0, 3).map((doc) => {
                const template = documentTypes.find((t) => t.id === doc.type);
                if (!template) return null;
                const Icon = template.icon;

                return (
                  <Card
                    key={doc.id}
                    sx={{
      p: 4,
      '&:hover': { "bg-muted/50": true },
      "transition-colors": true,
      cursor: "pointer"
    }}
                    onClick={() => onSelectType?.(doc.type)}
                  >
                    <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
                      <div sx={{
      p: 2,
      "${template.bgColor}": true,
      borderRadius: 0.5rem
    }}>
                        <Icon sx={{
      "w-4": true,
      "h-4": true,
      "${template.color}": true
    }} />
                      </div>
                      <div sx={{
      flex: 1,
      "min-w-0": true
    }}>
                        <h3 sx={{
      fontWeight: 500,
      [object Object]
    }}>{doc.title}</h3>
                        <p sx={{
      typography: body2,
      "text-muted-foreground": true,
      [object Object]
    }}>
                          {new Date(doc.lastOpened).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Document Grid */}
        {isLoading ? (
          <motion.div
            sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      [theme.breakpoints.up('md')]: { "grid-cols-3": true },
      gap: 6
    }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <SkeletonLoading variant="card" />
              </motion.div>
            ))}
          </motion.div>
        ) : filteredDocuments.length > 0 ? (
          <StaggeredList
            items={filteredDocuments}
            renderItem={(doc) => renderDocumentCard(doc)}
            sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      [theme.breakpoints.up('md')]: { "grid-cols-3": true },
      gap: 6
    }}
          />
        ) : (
          <div sx={{
      textAlign: "center",
      py: 12,
      "space-y-4": true
    }}>
            <FileText sx={{
      "mx-auto": true,
      "h-12": true,
      "w-12": true,
      "text-muted-foreground": true
    }} />
            <h3 sx={{
      typography: h6,
      fontWeight: 500
    }}>No templates found</h3>
            <p sx={{
      "text-muted-foreground": true
    }}>Try adjusting your search or filter criteria</p>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              sx={{
      mt: 4
    }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
