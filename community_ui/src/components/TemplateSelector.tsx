import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Eye, Star, Download } from "lucide-react";

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
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean, professional design perfect for tech and creative roles",
    category: "Modern",
    rating: 4.8,
    downloads: 12450,
    preview: "bg-gradient-to-br from-slate-100 to-slate-200",
    features: ["ATS-Friendly", "Single Page", "Contact Icons", "Skills Section"],
    type: "resume",
    isPremium: false
  },
  {
    id: "executive-pro",
    name: "Executive Pro",
    description: "Sophisticated layout designed for senior-level positions",
    category: "Professional",
    rating: 4.9,
    downloads: 8920,
    preview: "bg-gradient-to-br from-blue-100 to-indigo-200",
    features: ["Two Column", "Executive Summary", "Achievement Highlights", "References"],
    type: "resume",
    isPremium: true
  },
  {
    id: "creative-portfolio",
    name: "Creative Portfolio",
    description: "Eye-catching design for designers and creative professionals",
    category: "Creative",
    rating: 4.7,
    downloads: 6340,
    preview: "bg-gradient-to-br from-purple-100 to-pink-200",
    features: ["Portfolio Section", "Color Accents", "Project Showcase", "Skills Visualization"],
    type: "resume",
    isPremium: true
  },
  {
    id: "ats-optimized",
    name: "ATS Optimized",
    description: "Specifically designed to pass through applicant tracking systems",
    category: "ATS-Friendly",
    rating: 4.6,
    downloads: 15670,
    preview: "bg-gradient-to-br from-green-100 to-emerald-200",
    features: ["98% ATS Pass Rate", "Standard Fonts", "Simple Layout", "Keyword Optimized"],
    type: "resume",
    isPremium: false
  },
  {
    id: "cover-professional",
    name: "Professional Cover",
    description: "Classic cover letter template for any industry",
    category: "Professional",
    rating: 4.8,
    downloads: 9840,
    preview: "bg-gradient-to-br from-gray-100 to-slate-200",
    features: ["Business Format", "Customizable", "Multiple Layouts", "Industry Agnostic"],
    type: "cover-letter",
    isPremium: false
  },
  {
    id: "cover-modern",
    name: "Modern Cover",
    description: "Contemporary cover letter design with subtle styling",
    category: "Modern",
    rating: 4.7,
    downloads: 7230,
    preview: "bg-gradient-to-br from-teal-100 to-cyan-200",
    features: ["Modern Typography", "Color Accents", "Company Logo Space", "Social Links"],
    type: "cover-letter",
    isPremium: true
  }
];

export function TemplateSelector({ onBack, onSelectTemplate }: TemplateSelectorProps) {
  const [selectedType, setSelectedType] = useState<'resume' | 'cover-letter'>('resume');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTemplates = mockTemplates.filter(template => {
    const typeMatch = template.type === selectedType;
    const categoryMatch = selectedCategory === 'all' || template.category === selectedCategory;
    return typeMatch && categoryMatch;
  });

  const categories = ['all', ...Array.from(new Set(mockTemplates.filter(t => t.type === selectedType).map(t => t.category)))];

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            {/* Template Preview */}
            <div className={`h-48 ${template.preview} relative flex items-center justify-center`}>
              <div className="w-32 h-40 bg-white rounded shadow-lg flex flex-col">
                <div className="h-3 bg-gray-200 m-2 rounded"></div>
                <div className="h-2 bg-gray-300 mx-2 mb-1 rounded w-3/4"></div>
                <div className="h-2 bg-gray-300 mx-2 mb-2 rounded w-1/2"></div>
                <div className="flex-1 mx-2 mb-2 space-y-1">
                  <div className="h-1 bg-gray-200 rounded"></div>
                  <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                  <div className="h-1 bg-gray-200 rounded w-3/5"></div>
                  <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
              {template.isPremium && (
                <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
                  Premium
                </Badge>
              )}
            </div>

            {/* Template Info */}
            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-foreground">{template.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {template.rating}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{template.downloads.toLocaleString()} downloads</span>
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => onSelectTemplate(template.id, template.type)}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Use Template
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">No templates found for the selected filters</div>
          <Button variant="outline" onClick={() => setSelectedCategory('all')}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}