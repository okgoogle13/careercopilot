import { Template } from '../components/DocumentGeneration/TemplateSelector';

export interface TemplateAsset {
  id: string;
  url: string;
  type: 'image' | 'css' | 'font';
  category: string;
}

export interface TemplateMetadata {
  id: string;
  name: string;
  category: 'professional' | 'modern' | 'creative';
  description: string;
  features: string[];
  atsScore: number;
  isRecommended: boolean;
  assets: TemplateAsset[];
  previewImages: {
    thumbnail: string;
    fullSize: string;
  };
}

class TemplateAssetService {
  private templates: TemplateMetadata[] = [
    {
      id: 'executive-professional',
      name: 'Executive Professional',
      category: 'professional',
      description: 'Clean, traditional layout perfect for executive and senior-level positions',
      features: ['ATS Optimized', 'Clean Layout', 'Professional Typography', 'Header Focus'],
      atsScore: 95,
      isRecommended: true,
      assets: [],
      previewImages: {
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/careercopilot-staging.firebasestorage.app/o/templates%2Fexecutive-professional-thumb.png?alt=media',
        fullSize: 'https://firebasestorage.googleapis.com/v0/b/careercopilot-staging.firebasestorage.app/o/templates%2Fexecutive-professional-full.png?alt=media'
      }
    },
    {
      id: 'modern-minimalist',
      name: 'Modern Minimalist',
      category: 'modern',
      description: 'Contemporary design with clean lines and modern typography',
      features: ['Modern Design', 'Minimalist Layout', 'Color Accents', 'Icon Integration'],
      atsScore: 88,
      isRecommended: true,
      assets: [],
      previewImages: {
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/careercopilot-staging.firebasestorage.app/o/templates%2Fmodern-minimalist-thumb.png?alt=media',
        fullSize: 'https://firebasestorage.googleapis.com/v0/b/careercopilot-staging.firebasestorage.app/o/templates%2Fmodern-minimalist-full.png?alt=media'
      }
    },
    {
      id: 'creative-portfolio',
      name: 'Creative Portfolio',
      category: 'creative',
      description: 'Bold design for creative professionals and portfolio showcases',
      features: ['Creative Layout', 'Visual Elements', 'Portfolio Focus', 'Brand Integration'],
      atsScore: 75,
      isRecommended: false,
      assets: [],
      previewImages: {
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/careercopilot-staging.firebasestorage.app/o/templates%2Fcreative-portfolio-thumb.png?alt=media',
        fullSize: 'https://firebasestorage.googleapis.com/v0/b/careercopilot-staging.firebasestorage.app/o/templates%2Fcreative-portfolio-full.png?alt=media'
      }
    },
    {
      id: 'tech-specialist',
      name: 'Tech Specialist',
      category: 'professional',
      description: 'Technical resume template optimized for IT and engineering roles',
      features: ['Technical Focus', 'Skills Highlighting', 'Project Showcase', 'ATS Optimized'],
      atsScore: 92,
      isRecommended: true,
      assets: [],
      previewImages: {
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/careercopilot-staging.firebasestorage.app/o/templates%2Ftech-specialist-thumb.png?alt=media',
        fullSize: 'https://firebasestorage.googleapis.com/v0/b/careercopilot-staging.firebasestorage.app/o/templates%2Ftech-specialist-full.png?alt=media'
      }
    },
    {
      id: 'startup-ready',
      name: 'Startup Ready',
      category: 'modern',
      description: 'Dynamic template perfect for startup environments and fast-paced roles',
      features: ['Dynamic Layout', 'Growth Focus', 'Innovation Highlight', 'Modern Typography'],
      atsScore: 82,
      isRecommended: false,
      assets: [],
      previewImages: {
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/careercopilot-staging.firebasestorage.app/o/templates%2Fstartup-ready-thumb.png?alt=media',
        fullSize: 'https://firebasestorage.googleapis.com/v0/b/careercopilot-staging.firebasestorage.app/o/templates%2Fstartup-ready-full.png?alt=media'
      }
    },
    {
      id: 'design-focused',
      name: 'Design Focused',
      category: 'creative',
      description: 'Visual-first template for designers and creative professionals',
      features: ['Visual Design', 'Portfolio Integration', 'Creative Typography', 'Brand Expression'],
      atsScore: 70,
      isRecommended: false,
      assets: [],
      previewImages: {
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/careercopilot-staging.firebasestorage.app/o/templates%2Fdesign-focused-thumb.png?alt=media',
        fullSize: 'https://firebasestorage.googleapis.com/v0/b/careercopilot-staging.firebasestorage.app/o/templates%2Fdesign-focused-full.png?alt=media'
      }
    }
  ];

  /**
   * Get all available templates
   */
  async getAvailableTemplates(): Promise<Template[]> {
    // Simulate API delay
    await this.delay(500);
    
    return this.templates.map(template => ({
      id: template.id,
      name: template.name,
      category: template.category,
      preview: template.previewImages.thumbnail,
      atsScore: template.atsScore,
      features: template.features,
      isRecommended: template.isRecommended
    }));
  }

  /**
   * Get template by ID
   */
  async getTemplate(id: string): Promise<TemplateMetadata | null> {
    await this.delay(200);
    
    const template = this.templates.find(t => t.id === id);
    return template || null;
  }

  /**
   * Get templates by category
   */
  async getTemplatesByCategory(category: 'professional' | 'modern' | 'creative'): Promise<Template[]> {
    await this.delay(300);
    
    return this.templates
      .filter(template => template.category === category)
      .map(template => ({
        id: template.id,
        name: template.name,
        category: template.category,
        preview: template.previewImages.thumbnail,
        atsScore: template.atsScore,
        features: template.features,
        isRecommended: template.isRecommended
      }));
  }

  /**
   * Get template assets (CSS, images, fonts)
   */
  async getTemplateAssets(templateId: string): Promise<TemplateAsset[]> {
    await this.delay(200);
    
    const template = this.templates.find(t => t.id === templateId);
    return template?.assets || [];
  }

  /**
   * Download template as PDF
   */
  async downloadTemplate(templateId: string, userData: any): Promise<Blob> {
    await this.delay(2000); // Simulate PDF generation time
    
    // In a real implementation, this would call the backend API
    // For now, return a mock PDF blob
    const mockPdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 100
>>
stream
BT
/F1 12 Tf
100 700 Td
(Generated Resume - Template: ${templateId}) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000100 00000 n 
0000000178 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
330
%%EOF`;

    return new Blob([mockPdfContent], { type: 'application/pdf' });
  }

  /**
   * Get recommended templates based on job description
   */
  async getRecommendedTemplates(jobDescription: string): Promise<Template[]> {
    await this.delay(800);
    
    // Simple keyword-based recommendation logic
    const jobKeywords = jobDescription.toLowerCase();
    let recommendedTemplates = [...this.templates];

    // Score templates based on job description
    recommendedTemplates = recommendedTemplates.map(template => {
      let score = template.atsScore;
      
      // Boost scores based on job keywords
      if (jobKeywords.includes('executive') || jobKeywords.includes('senior') || jobKeywords.includes('director')) {
        if (template.id === 'executive-professional') score += 10;
      }
      
      if (jobKeywords.includes('tech') || jobKeywords.includes('engineer') || jobKeywords.includes('developer')) {
        if (template.id === 'tech-specialist') score += 10;
      }
      
      if (jobKeywords.includes('startup') || jobKeywords.includes('fast-paced')) {
        if (template.id === 'startup-ready') score += 10;
      }
      
      if (jobKeywords.includes('creative') || jobKeywords.includes('design') || jobKeywords.includes('portfolio')) {
        if (template.category === 'creative') score += 10;
      }

      return { ...template, atsScore: Math.min(score, 100) };
    });

    // Sort by score and return top templates
    recommendedTemplates.sort((a, b) => b.atsScore - a.atsScore);
    
    return recommendedTemplates.slice(0, 3).map(template => ({
      id: template.id,
      name: template.name,
      category: template.category,
      preview: template.previewImages.thumbnail,
      atsScore: template.atsScore,
      features: template.features,
      isRecommended: true
    }));
  }

  /**
   * Validate template compatibility
   */
  async validateTemplateCompatibility(templateId: string, userProfile: any): Promise<{
    isCompatible: boolean;
    warnings: string[];
    suggestions: string[];
  }> {
    await this.delay(400);
    
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      return {
        isCompatible: false,
        warnings: ['Template not found'],
        suggestions: ['Please select a valid template']
      };
    }

    const warnings: string[] = [];
    const suggestions: string[] = [];
    let isCompatible = true;

    // Example validation logic
    if (template.category === 'creative' && userProfile?.experience > 10) {
      warnings.push('Creative templates may not be suitable for very senior positions');
      suggestions.push('Consider using a professional template for senior roles');
    }

    if (template.atsScore < 80) {
      warnings.push('This template has a lower ATS compatibility score');
      suggestions.push('Consider using a more ATS-optimized template for better visibility');
    }

    return {
      isCompatible,
      warnings,
      suggestions
    };
  }

  /**
   * Utility method to simulate API delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get template statistics
   */
  async getTemplateStats(): Promise<{
    totalTemplates: number;
    byCategory: Record<string, number>;
    averageAtsScore: number;
  }> {
    await this.delay(200);
    
    const byCategory = this.templates.reduce((acc, template) => {
      acc[template.category] = (acc[template.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageAtsScore = this.templates.reduce((sum, t) => sum + t.atsScore, 0) / this.templates.length;

    return {
      totalTemplates: this.templates.length,
      byCategory,
      averageAtsScore: Math.round(averageAtsScore)
    };
  }
}

// Export singleton instance
export const templateAssetService = new TemplateAssetService();

// Export the class for testing or custom instances
export { TemplateAssetService };