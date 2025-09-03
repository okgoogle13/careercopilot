import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, LoadingSpinner } from '../ui';
import { HelpButton } from '../HelpSystem';
import { Eye, Download, Star, Filter, Grid3X3, List, Search, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface Template {
  id: string;
  name: string;
  category: 'professional' | 'modern' | 'creative' | 'executive' | 'academic' | 'technical';
  industry: string[];
  level: 'entry' | 'mid' | 'senior' | 'executive';
  description: string;
  features: string[];
  preview: {
    thumbnail: string;
    fullPreview: string;
  };
  rating: number;
  downloadCount: number;
  isPremium: boolean;
  tags: string[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  layouts: {
    singleColumn: boolean;
    twoColumn: boolean;
    multiColumn: boolean;
  };
  compatibility: {
    ats: number; // ATS compatibility score out of 100
    applicantTracking: boolean;
    mobile: boolean;
  };
}

interface TemplateGalleryProps {
  onTemplateSelect: (template: Template) => void;
  selectedTemplate?: Template;
  userProfile?: {
    industry?: string;
    level?: string;
    skills?: string[];
  };
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onTemplateSelect,
  selectedTemplate,
  userProfile,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'name' | 'ats'>('popular');
  const [showOnlyAtsOptimized, setShowOnlyAtsOptimized] = useState(false);

  // Mock template data - in reality this would come from an API
  useEffect(() => {
    const mockTemplates: Template[] = [
      {
        id: 'professional-classic',
        name: 'Professional Classic',
        category: 'professional',
        industry: ['finance', 'consulting', 'healthcare', 'law'],
        level: 'mid',
        description: 'A timeless, clean design perfect for traditional industries and corporate positions.',
        features: ['Clean typography', 'Conservative layout', 'ATS-optimized', 'Professional color scheme'],
        preview: {
          thumbnail: '/templates/professional-classic-thumb.png',
          fullPreview: '/templates/professional-classic-full.png',
        },
        rating: 4.8,
        downloadCount: 15420,
        isPremium: false,
        tags: ['corporate', 'traditional', 'clean', 'formal'],
        colorScheme: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#1e40af',
        },
        layouts: {
          singleColumn: true,
          twoColumn: false,
          multiColumn: false,
        },
        compatibility: {
          ats: 95,
          applicantTracking: true,
          mobile: true,
        },
      },
      {
        id: 'modern-minimalist',
        name: 'Modern Minimalist',
        category: 'modern',
        industry: ['technology', 'startups', 'design', 'marketing'],
        level: 'mid',
        description: 'A contemporary design with plenty of white space and modern typography.',
        features: ['Minimalist design', 'Modern fonts', 'Color accents', 'Mobile-responsive'],
        preview: {
          thumbnail: '/templates/modern-minimalist-thumb.png',
          fullPreview: '/templates/modern-minimalist-full.png',
        },
        rating: 4.9,
        downloadCount: 23180,
        isPremium: false,
        tags: ['modern', 'minimal', 'tech', 'clean'],
        colorScheme: {
          primary: '#10b981',
          secondary: '#6b7280',
          accent: '#059669',
        },
        layouts: {
          singleColumn: false,
          twoColumn: true,
          multiColumn: false,
        },
        compatibility: {
          ats: 88,
          applicantTracking: true,
          mobile: true,
        },
      },
      {
        id: 'creative-portfolio',
        name: 'Creative Portfolio',
        category: 'creative',
        industry: ['design', 'marketing', 'media', 'arts'],
        level: 'senior',
        description: 'A bold, visual design perfect for creative professionals who want to stand out.',
        features: ['Visual elements', 'Portfolio integration', 'Creative layout', 'Brand-focused'],
        preview: {
          thumbnail: '/templates/creative-portfolio-thumb.png',
          fullPreview: '/templates/creative-portfolio-full.png',
        },
        rating: 4.6,
        downloadCount: 8930,
        isPremium: true,
        tags: ['creative', 'visual', 'portfolio', 'artistic'],
        colorScheme: {
          primary: '#8b5cf6',
          secondary: '#6b7280',
          accent: '#7c3aed',
        },
        layouts: {
          singleColumn: false,
          twoColumn: false,
          multiColumn: true,
        },
        compatibility: {
          ats: 72,
          applicantTracking: false,
          mobile: true,
        },
      },
      {
        id: 'executive-leadership',
        name: 'Executive Leadership',
        category: 'executive',
        industry: ['management', 'consulting', 'finance', 'healthcare'],
        level: 'executive',
        description: 'A sophisticated design for senior executives and C-suite professionals.',
        features: ['Executive styling', 'Leadership focus', 'Premium layout', 'Achievement highlights'],
        preview: {
          thumbnail: '/templates/executive-leadership-thumb.png',
          fullPreview: '/templates/executive-leadership-full.png',
        },
        rating: 4.7,
        downloadCount: 5670,
        isPremium: true,
        tags: ['executive', 'leadership', 'premium', 'sophisticated'],
        colorScheme: {
          primary: '#1f2937',
          secondary: '#6b7280',
          accent: '#374151',
        },
        layouts: {
          singleColumn: true,
          twoColumn: true,
          multiColumn: false,
        },
        compatibility: {
          ats: 92,
          applicantTracking: true,
          mobile: true,
        },
      },
      {
        id: 'tech-innovator',
        name: 'Tech Innovator',
        category: 'technical',
        industry: ['technology', 'engineering', 'software'],
        level: 'senior',
        description: 'Designed specifically for software engineers and technical professionals.',
        features: ['Code-friendly', 'Technical skills focus', 'GitHub integration', 'Project highlights'],
        preview: {
          thumbnail: '/templates/tech-innovator-thumb.png',
          fullPreview: '/templates/tech-innovator-full.png',
        },
        rating: 4.9,
        downloadCount: 18250,
        isPremium: false,
        tags: ['technical', 'software', 'engineering', 'code'],
        colorScheme: {
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#2563eb',
        },
        layouts: {
          singleColumn: false,
          twoColumn: true,
          multiColumn: false,
        },
        compatibility: {
          ats: 90,
          applicantTracking: true,
          mobile: true,
        },
      },
    ];

    setTemplates(mockTemplates);
    setFilteredTemplates(mockTemplates);
    setLoading(false);
  }, []);

  // Filter and sort templates
  useEffect(() => {
    let filtered = [...templates];

    // Apply filters
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(template => template.industry.includes(selectedIndustry));
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(template => template.level === selectedLevel);
    }

    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (showOnlyAtsOptimized) {
      filtered = filtered.filter(template => template.compatibility.ats >= 85);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'ats':
          return b.compatibility.ats - a.compatibility.ats;
        case 'popular':
        default:
          return b.downloadCount - a.downloadCount;
      }
    });

    setFilteredTemplates(filtered);
  }, [templates, selectedCategory, selectedIndustry, selectedLevel, searchQuery, sortBy, showOnlyAtsOptimized]);

  const handleTemplateSelect = (template: Template) => {
    onTemplateSelect(template);
    toast.success(`Selected ${template.name} template`);
  };

  const getRecommendedTemplates = () => {
    if (!userProfile) return [];

    return templates
      .filter(template => {
        if (userProfile.industry && template.industry.includes(userProfile.industry)) return true;
        if (userProfile.level && template.level === userProfile.level) return true;
        return false;
      })
      .slice(0, 3);
  };

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'professional', name: 'Professional', count: templates.filter(t => t.category === 'professional').length },
    { id: 'modern', name: 'Modern', count: templates.filter(t => t.category === 'modern').length },
    { id: 'creative', name: 'Creative', count: templates.filter(t => t.category === 'creative').length },
    { id: 'executive', name: 'Executive', count: templates.filter(t => t.category === 'executive').length },
    { id: 'technical', name: 'Technical', count: templates.filter(t => t.category === 'technical').length },
  ];

  const industries = [
    'all', 'technology', 'finance', 'healthcare', 'consulting', 'design',
    'marketing', 'engineering', 'law', 'management', 'education'
  ];

  const levels = [
    'all', 'entry', 'mid', 'senior', 'executive'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">Template Gallery</h2>
          <HelpButton helpId="template-selection" size="sm" />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="flex items-center gap-2"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
        </div>
      </div>

      {/* Recommended Templates */}
      {userProfile && getRecommendedTemplates().length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getRecommendedTemplates().map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg p-4 border border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="aspect-[3/4] bg-gray-100 rounded mb-3 relative overflow-hidden">
                  <img
                    src={template.preview.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/api/placeholder/300/400';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-2 text-white text-xs font-medium">
                    {template.compatibility.ats}% ATS
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                <p className="text-xs text-gray-600">{template.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'rating' | 'name' | 'ats')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="ats">Best ATS Score</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} {category.count > 0 && `(${category.count})`}
              </button>
            ))}
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Industries</option>
              {industries.slice(1).map((industry) => (
                <option key={industry} value={industry}>
                  {industry.charAt(0).toUpperCase() + industry.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              {levels.slice(1).map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)} Level
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
              <input
                type="checkbox"
                checked={showOnlyAtsOptimized}
                onChange={(e) => setShowOnlyAtsOptimized(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">ATS Optimized Only</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Templates Grid/List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredTemplates.length} of {templates.length} templates
          </p>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate?.id === template.id}
                onSelect={() => handleTemplateSelect(template)}
                onPreview={() => setPreviewTemplate(template)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTemplates.map((template) => (
              <TemplateListItem
                key={template.id}
                template={template}
                isSelected={selectedTemplate?.id === template.id}
                onSelect={() => handleTemplateSelect(template)}
                onPreview={() => setPreviewTemplate(template)}
              />
            ))}
          </div>
        )}

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms to find more templates.
            </p>
            <Button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedIndustry('all');
                setSelectedLevel('all');
                setSearchQuery('');
                setShowOnlyAtsOptimized(false);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onSelect={() => {
            handleTemplateSelect(previewTemplate);
            setPreviewTemplate(null);
          }}
        />
      )}
    </div>
  );
};

// Template Card Component
const TemplateCard: React.FC<{
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
  onPreview: () => void;
}> = ({ template, isSelected, onSelect, onPreview }) => {
  return (
    <Card className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
      isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
    }`}>
      <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden group">
        <img
          src={template.preview.thumbnail}
          alt={template.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/api/placeholder/300/400';
          }}
        />

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              Select
            </Button>
          </div>
        </div>

        {/* ATS Score Badge */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
          {template.compatibility.ats}% ATS
        </div>

        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
            Premium
          </div>
        )}
      </div>

      <div className="p-4" onClick={onSelect}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-medium">{template.rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{template.downloadCount.toLocaleString()} downloads</span>
          <span className="capitalize">{template.level} level</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

// Template List Item Component
const TemplateListItem: React.FC<{
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
  onPreview: () => void;
}> = ({ template, isSelected, onSelect, onPreview }) => {
  return (
    <Card className={`p-6 cursor-pointer transition-all hover:shadow-md ${
      isSelected ? 'ring-2 ring-blue-500 shadow-md' : ''
    }`} onClick={onSelect}>
      <div className="flex gap-6">
        <div className="w-24 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0">
          <img
            src={template.preview.thumbnail}
            alt={template.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/api/placeholder/96/128';
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="capitalize">{template.category}</span>
                <span className="capitalize">{template.level} level</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span>{template.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {template.isPremium && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-medium">
                  Premium
                </span>
              )}
              <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
                {template.compatibility.ats}% ATS
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-3">{template.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {template.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {template.downloadCount.toLocaleString()} downloads
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview();
                }}
              >
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Template Preview Modal Component
const TemplatePreviewModal: React.FC<{
  template: Template;
  onClose: () => void;
  onSelect: () => void;
}> = ({ template, onClose, onSelect }) => {
  return (
    <Modal isOpen={true} onClose={onClose} size="xl">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{template.name}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="capitalize">{template.category} • {template.level} level</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{template.rating} ({template.downloadCount.toLocaleString()} downloads)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {template.isPremium && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
                Premium
              </span>
            )}
            <div className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
              {template.compatibility.ats}% ATS Compatible
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Image */}
          <div className="lg:col-span-2">
            <div className="aspect-[8.5/11] bg-gray-100 rounded-lg overflow-hidden shadow-lg">
              <img
                src={template.preview.fullPreview}
                alt={`${template.name} full preview`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/api/placeholder/680/880';
                }}
              />
            </div>
          </div>

          {/* Template Details */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{template.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
              <ul className="space-y-1">
                {template.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Best For</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Industries:</span>{' '}
                  {template.industry.map(ind => ind.charAt(0).toUpperCase() + ind.slice(1)).join(', ')}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Career Level:</span>{' '}
                  {template.level.charAt(0).toUpperCase() + template.level.slice(1)}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Compatibility</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>ATS Compatibility</span>
                  <span className="font-medium">{template.compatibility.ats}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Mobile Responsive</span>
                  <span className={template.compatibility.mobile ? 'text-green-600' : 'text-red-600'}>
                    {template.compatibility.mobile ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Applicant Tracking</span>
                  <span className={template.compatibility.applicantTracking ? 'text-green-600' : 'text-red-600'}>
                    {template.compatibility.applicantTracking ? 'Supported' : 'Limited'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={onSelect} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Select This Template
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TemplateGallery;