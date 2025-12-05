import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Grid,
  alpha,
} from '@mui/material';
import { ArrowLeft, Eye, Star, Download } from 'lucide-react';

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
    preview: 'slate',
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
    preview: 'blue',
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
    preview: 'purple',
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
    preview: 'green',
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
    preview: 'gray',
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
    preview: 'teal',
    features: ['Modern Typography', 'Color Accents', 'Company Logo Space', 'Social Links'],
    type: 'cover-letter',
    isPremium: true,
  },
];

export interface TemplateSelectorProps {
  onBack: () => void;
  onSelectTemplate: (templateId: string, type: 'resume' | 'cover-letter') => void;
}

const getPreviewGradient = (preview: string) => {
  const gradients: Record<string, string> = {
    slate: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
    blue: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    purple: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
    green: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    gray: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
    teal: 'linear-gradient(135deg, #ccfbf1, #99f6e4)',
  };
  return gradients[preview] || gradients.slate;
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onBack, onSelectTemplate }) => {
  const [selectedType, setSelectedType] = useState<'resume' | 'cover-letter'>('resume');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTemplates = mockTemplates.filter((template) => {
    const typeMatch = template.type === selectedType;
    const categoryMatch = selectedCategory === 'all' || template.category === selectedCategory;
    return typeMatch && categoryMatch;
  });

  const categories = ['all', ...Array.from(new Set(mockTemplates.filter((t) => t.type === selectedType).map((t) => t.category)))];

  return (
    <Box
      sx={{
        flex: 1,
        p: { xs: 3, md: 6 },
        bgcolor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 6, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Button variant="text" startIcon={<ArrowLeft size={16} />} onClick={onBack} sx={{ color: 'text.secondary' }}>
              Back to Dashboard
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Choose Template
            </Typography>
          </Box>
          <Chip
            label={`${filteredTemplates.length} templates available`}
            sx={{
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
            }}
          />
        </Box>

        {/* Type and Category Filters */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant={selectedType === 'resume' ? 'aurora' : 'outlined'}
              onClick={() => setSelectedType('resume')}
            >
              Resume Templates
            </Button>
            <Button
              variant={selectedType === 'cover-letter' ? 'aurora' : 'outlined'}
              onClick={() => setSelectedType('cover-letter')}
            >
              Cover Letter Templates
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Template Grid */}
        <Grid container spacing={3}>
          {filteredTemplates.map((template) => (
            <Grid item xs={12} sm={6} lg={4} key={template.id}>
              <Card
                variant="glass"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.customShadows.glowPrimary,
                  },
                }}
              >
                {/* Template Preview */}
                <Box
                  sx={{
                    height: 192,
                    background: getPreviewGradient(template.preview),
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Mock document preview */}
                  <Box
                    sx={{
                      width: 128,
                      height: 160,
                      bgcolor: 'white',
                      borderRadius: 1,
                      boxShadow: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      p: 1,
                    }}
                  >
                    <Box sx={{ height: 12, bgcolor: '#e5e7eb', mb: 1, borderRadius: 0.5 }} />
                    <Box sx={{ height: 8, bgcolor: '#d1d5db', mb: 0.5, borderRadius: 0.5, width: '75%' }} />
                    <Box sx={{ height: 8, bgcolor: '#d1d5db', mb: 1, borderRadius: 0.5, width: '50%' }} />
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ height: 4, bgcolor: '#e5e7eb', borderRadius: 0.5 }} />
                      <Box sx={{ height: 4, bgcolor: '#e5e7eb', borderRadius: 0.5, width: '80%' }} />
                      <Box sx={{ height: 4, bgcolor: '#e5e7eb', borderRadius: 0.5, width: '60%' }} />
                      <Box sx={{ height: 4, bgcolor: '#e5e7eb', borderRadius: 0.5, width: '80%' }} />
                    </Box>
                  </Box>
                  {template.isPremium && (
                    <Chip
                      label="Premium"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: '#fbbf24',
                        color: 'black',
                        fontWeight: 700,
                      }}
                    />
                  )}
                </Box>

                {/* Template Info */}
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {template.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star size={14} fill="#fbbf24" color="#fbbf24" />
                      <Typography variant="body2" color="text.secondary">
                        {template.rating}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {template.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {template.downloads.toLocaleString()} downloads
                    </Typography>
                    <Chip label={template.category} size="small" />
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                      Features:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {template.features.map((feature, index) => (
                        <Chip key={index} label={feature} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button variant="outlined" size="small" startIcon={<Eye size={14} />} sx={{ flex: 1 }}>
                    Preview
                  </Button>
                  <Button
                    variant="aurora"
                    size="small"
                    startIcon={<Download size={14} />}
                    onClick={() => onSelectTemplate(template.id, template.type)}
                    sx={{ flex: 1 }}
                  >
                    Use Template
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredTemplates.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              No templates found for the selected filters
            </Typography>
            <Button variant="outlined" onClick={() => setSelectedCategory('all')}>
              Clear Filters
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TemplateSelector;
