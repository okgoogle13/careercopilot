import React, { useState, useEffect, useCallback } from 'react';
import { templateAssetService } from '../../services/templateAssetService';
import { atsComplianceValidator } from '../../services/atsComplianceValidator';
import './TemplateSelector.css';

export interface Template {
  id: string;
  name: string;
  category: 'professional' | 'modern' | 'creative';
  preview: string;
  atsScore: number;
  features: string[];
  isRecommended?: boolean;
}

interface TemplateSelectorProps {
  selectedTemplate: Template | null;
  onTemplateSelect: (template: Template) => void;
  jobDescription?: string;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect,
  jobDescription
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [atsAnalysis, setAtsAnalysis] = useState<Record<string, number>>({});

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (jobDescription && templates.length > 0) {
      analyzeAtsCompliance();
    }
  }, [jobDescription, templates, analyzeAtsCompliance]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const templateData = await templateAssetService.getAvailableTemplates();
      setTemplates(templateData);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeAtsCompliance = useCallback(async () => {
    if (!jobDescription) return;
    
    const analysis: Record<string, number> = {};
    for (const template of templates) {
      try {
        const score = await atsComplianceValidator.analyzeTemplate(template, jobDescription);
        analysis[template.id] = score;
      } catch (error) {
        console.error(`Failed to analyze template ${template.id}:`, error);
        analysis[template.id] = template.atsScore;
      }
    }
    setAtsAnalysis(analysis);
  }, [jobDescription, templates]);

  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') return templates;
    return templates.filter(t => t.category === selectedCategory);
  };

  const getAtsScore = (template: Template) => {
    return atsAnalysis[template.id] || template.atsScore;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="template-selector loading">
        <div className="loading-spinner">Loading templates...</div>
      </div>
    );
  }

  return (
    <div className="template-selector">
      <div className="template-selector-header">
        <h3 className="text-lg font-semibold mb-4">Choose Your Template</h3>
        
        {/* Category Filter */}
        <div className="category-filter mb-6">
          <div className="flex space-x-2">
            {['all', 'professional', 'modern', 'creative'].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ATS Analysis Notice */}
        {jobDescription && (
          <div className="ats-notice mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">ATS Analysis Active:</span> Templates are scored based on your job description for better compatibility.
            </p>
          </div>
        )}
      </div>

      {/* Template Grid */}
      <div className="template-grid">
        {getFilteredTemplates().map(template => {
          const atsScore = getAtsScore(template);
          const isSelected = selectedTemplate?.id === template.id;
          const isRecommended = template.isRecommended || atsScore >= 85;

          return (
            <div
              key={template.id}
              className={`template-card ${isSelected ? 'selected' : ''} ${isRecommended ? 'recommended' : ''}`}
              onClick={() => onTemplateSelect(template)}
            >
              {/* Recommendation Badge */}
              {isRecommended && (
                <div className="recommendation-badge">
                  <span className="text-xs font-medium">Recommended</span>
                </div>
              )}

              {/* Template Preview */}
              <div className="template-preview">
                <img 
                  src={template.preview} 
                  alt={`${template.name} template preview`}
                  className="preview-image"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-template.png';
                  }}
                />
              </div>

              {/* Template Info */}
              <div className="template-info">
                <div className="template-header">
                  <h4 className="template-name">{template.name}</h4>
                  <div className={`ats-score ${getScoreColor(atsScore)}`}>
                    <span className="text-xs font-medium">ATS: {atsScore}%</span>
                  </div>
                </div>

                <div className="template-category">
                  <span className="category-badge">{template.category}</span>
                </div>

                {/* Features */}
                <div className="template-features">
                  {template.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                  {template.features.length > 3 && (
                    <span className="feature-tag more">
                      +{template.features.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="selection-indicator">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Templates Message */}
      {getFilteredTemplates().length === 0 && (
        <div className="no-templates">
          <p className="text-gray-500 text-center py-8">
            No templates found for the selected category.
          </p>
        </div>
      )}

      {/* Selected Template Summary */}
      {selectedTemplate && (
        <div className="selected-summary mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{selectedTemplate.name}</h4>
              <p className="text-sm text-gray-600">
                ATS Score: <span className={getScoreColor(getAtsScore(selectedTemplate))}>{getAtsScore(selectedTemplate)}%</span>
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                Customize
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;