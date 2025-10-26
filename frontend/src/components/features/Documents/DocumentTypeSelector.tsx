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
          className="group relative overflow-hidden border border-border rounded-lg cursor-pointer"
        >
          <Card
            className="border-0 shadow-none"
            onClick={() => onSelectType?.(doc.id)}
            onKeyDown={(e) => handleKeyDown(e, doc.id)}
            role="button"
            tabIndex={0}
          >
            {/* Recommendation Score Badge */}
            {sortBy === 'recommended' && recommendationScore > 70 && (
              <div className="absolute top-2 right-2 z-10">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">
                  {Math.round(recommendationScore)}% match
                </Badge>
              </div>
            )}

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-3 ${doc.bgColor} rounded-xl relative`}>
                    <Icon className={`w-6 h-6 ${doc.color}`} />
                    {doc.aiPowered && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                        <Zap className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{doc.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={getDifficultyColor(doc.difficulty)}>
                        {doc.difficulty}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(doc.estimatedTime)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <MuiTooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                    <Button
                      variant="text"
                      size="small"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(doc.id);
                      }}
                    >
                      <Heart
                        className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                      />
                    </Button>
                  </MuiTooltip>

                  <div className="flex gap-1">
                    {doc.isNew && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        New
                      </Badge>
                    )}
                    {doc.isPopular && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{doc.description}</p>

              {/* Analytics */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {doc.usageCount?.toLocaleString() || 0} users
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {doc.successRate}% success
                  </span>
                </div>
                {doc.aiPowered && (
                  <MuiTooltip title="This template includes AI assistance for content generation">
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200"
                    >
                      AI-Powered
                    </Badge>
                  </MuiTooltip>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {doc.tags.slice(0, 3).map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {doc.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{doc.tags.length - 3} more
                  </Badge>
                )}
              </div>

              <Button
                className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground"
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
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-9 w-full mt-4" />
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button variant="text" size="small" onClick={onBack} className="w-fit">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create New Document</h1>
            <p className="text-muted-foreground">
              Select a template to get started with your next career document
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search templates..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Tabs value={sortBy} onChange={(_e, value) => setSortBy(value as any)}>
                <TabsList className="grid grid-cols-4 w-[400px]">
                  <TabsTrigger value="recommended" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Recommended
                  </TabsTrigger>
                  <TabsTrigger value="popular" className="text-xs">
                    <BarChart className="w-3 h-3 mr-1" />
                    Popular
                  </TabsTrigger>
                  <TabsTrigger value="recent" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Recent
                  </TabsTrigger>
                  <TabsTrigger value="difficulty" className="text-xs">
                    <Target className="w-3 h-3 mr-1" />
                    Difficulty
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <Tabs
            value={selectedCategory}
            onChange={(_e, value) => setSelectedCategory(value as DocumentCategoryExtended)}
            className="w-full"
          >
            <TabsList className="w-full justify-start overflow-x-auto">
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
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.label}
                    <Badge variant="secondary" className="ml-1 text-xs">
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
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <History className="h-5 w-5" />
              <h2 className="font-medium">Recently Opened</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentDocuments.slice(0, 3).map((doc) => {
                const template = documentTypes.find((t) => t.id === doc.type);
                if (!template) return null;
                const Icon = template.icon;

                return (
                  <Card
                    key={doc.id}
                    className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => onSelectType?.(doc.type)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${template.bgColor} rounded-lg`}>
                        <Icon className={`w-4 h-4 ${template.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{doc.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          />
        ) : (
          <div className="text-center py-12 space-y-4">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">No templates found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
