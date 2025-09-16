import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft } from 'lucide-react';
import { TemplateCard } from './library/TemplateCard';
import { selectTemplate, getDocumentPreview } from '../api/aiServices';

interface TemplateSelectorProps {
  onBack: () => void;
  onSelectTemplate: (templateId: string, type: 'resume' | 'cover-letter') => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: number;
  preview: string;
  features: string[];
  type: 'resume' | 'cover-letter';
  isPremium: boolean;
}

const mockTemplates: Template[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean, professional design perfect for tech and creative roles',
    category: 'Modern',
    rating: 4.8,
    downloads: 12450,
    preview: 'bg-gradient-to-br from-slate-100 to-slate-200',
    features: ['ATS-Friendly', 'Single Page', 'Contact Icons', 'Skills Section'],
    type: 'resume',
    isPremium: false,
  },
  {
    id: 'executive-pro',
    name: 'Executive Pro',
    description: 'Sophisticated layout designed for senior-level positions',
    category: 'Professional',
    rating: 4.9,
    downloads: 8920,
    preview: 'bg-gradient-to-br from-blue-100 to-indigo-200',
    features: ['Two Column', 'Executive Summary', 'Achievement Highlights', 'References'],
    type: 'resume',
    isPremium: true,
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Eye-catching design for designers and creative professionals',
    category: 'Creative',
    rating: 4.7,
    downloads: 6340,
    preview: 'bg-gradient-to-br from-purple-100 to-pink-200',
    features: ['Portfolio Section', 'Color Accents', 'Project Showcase', 'Skills Visualization'],
    type: 'resume',
    isPremium: true,
  },
  {
    id: 'ats-optimized',
    name: 'ATS Optimized',
    description: 'Specifically designed to pass through applicant tracking systems',
    category: 'ATS-Friendly',
    rating: 4.6,
    downloads: 15670,
    preview: 'bg-gradient-to-br from-green-100 to-emerald-200',
    features: ['98% ATS Pass Rate', 'Standard Fonts', 'Simple Layout', 'Keyword Optimized'],
    type: 'resume',
    isPremium: false,
  },
  {
    id: 'cover-professional',
    name: 'Professional Cover',
    description: 'Classic cover letter template for any industry',
    category: 'Professional',
    rating: 4.8,
    downloads: 9840,
    preview: 'bg-gradient-to-br from-gray-100 to-slate-200',
    features: ['Business Format', 'Customizable', 'Multiple Layouts', 'Industry Agnostic'],
    type: 'cover-letter',
    isPremium: false,
  },
  {
    id: 'cover-modern',
    name: 'Modern Cover',
    description: 'Contemporary cover letter design with subtle styling',
    category: 'Modern',
    rating: 4.7,
    downloads: 7230,
    preview: 'bg-gradient-to-br from-teal-100 to-cyan-200',
    features: ['Modern Typography', 'Color Accents', 'Company Logo Space', 'Social Links'],
    type: 'cover-letter',
    isPremium: true,
  },
];

export function TemplateSelector({ onBack, onSelectTemplate }: TemplateSelectorProps) {
  const [selectedType, setSelectedType] = useState<'resume' | 'cover-letter'>('resume');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSelectingTemplate, setIsSelectingTemplate] = useState(false);

  const handleTemplateSelection = async (templateId: string, type: 'resume' | 'cover-letter') => {
    try {
      setIsSelectingTemplate(true);

      // Call backend API to select template
      const response = await selectTemplate(templateId, {}, '');

      console.log('Template selection response:', response);

      // Call the parent handler to navigate to next step
      onSelectTemplate(templateId, type);
    } catch (error) {
      console.error('Failed to select template:', error);
      // Still proceed with navigation even if API call fails
      onSelectTemplate(templateId, type);
    } finally {
      setIsSelectingTemplate(false);
    }
  };

  const handleTemplatePreview = async (templateId: string, templateName: string) => {
    try {
      const previewResponse = await getDocumentPreview(templateId);
      console.log('Template preview response:', previewResponse);

      // For now, just log the preview - you could show it in a modal
      console.log(`Previewing template: ${templateName}`);
    } catch (error) {
      console.error('Failed to get template preview:', error);
      console.log(`Previewing template: ${templateName} (offline mode)`);
    }
  };

  const filteredTemplates = mockTemplates
    .map((template) => ({
      ...template,
      template_name: template.name,
      ats_score: Math.floor(85 + Math.random() * 15), // Generate random ATS score between 85-99
      is_recommended: template.rating > 4.7,
      best_for_tags: template.features.slice(0, 3),
    }))
    .filter((template) => {
      const typeMatch = template.type === selectedType;
      const categoryMatch = selectedCategory === 'all' || template.category === selectedCategory;
      return typeMatch && categoryMatch;
    });

  const categories = [
    'all',
    ...Array.from(
      new Set(mockTemplates.filter((t) => t.type === selectedType).map((t) => t.category))
    ),
  ];

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
          <h1 className="text-2xl font-bold text-foreground">Choose Template</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {filteredTemplates.length} templates available
          </Badge>
        </div>
      </div>

      {/* Type and Category Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-2">
          <Button
            variant={selectedType === 'resume' ? 'default' : 'outline'}
            className={selectedType === 'resume' ? 'bg-primary hover:bg-primary/90' : ''}
            onClick={() => setSelectedType('resume')}
          >
            Resume Templates
          </Button>
          <Button
            variant={selectedType === 'cover-letter' ? 'default' : 'outline'}
            className={selectedType === 'cover-letter' ? 'bg-primary hover:bg-primary/90' : ''}
            onClick={() => setSelectedType('cover-letter')}
          >
            Cover Letter Templates
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className={selectedCategory === category ? 'bg-primary hover:bg-primary/90' : ''}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All Categories' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isSelectingTemplate ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template_name={template.name}
            ats_score={template.ats_score}
            preview_image={template.preview}
            is_recommended={template.is_recommended}
            best_for_tags={template.best_for_tags}
            onSelect={() => handleTemplateSelection(template.id, template.type)}
            onPreview={() => handleTemplatePreview(template.id, template.name)}
          />
        ))}
      </div>

      {isSelectingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-lg font-medium">Selecting template...</span>
            </div>
          </div>
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            No templates found for the selected filters
          </div>
          <Button variant="outline" onClick={() => setSelectedCategory('all')}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
