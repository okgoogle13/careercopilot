import { Template } from '../components/DocumentGeneration/TemplateSelector';

export interface ATSAnalysisResult {
  score: number;
  category: 'excellent' | 'good' | 'fair' | 'poor';
  factors: {
    readability: number;
    keywordOptimization: number;
    formatting: number;
    structure: number;
  };
  recommendations: string[];
  warnings: string[];
}

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  weight: number;
  check: (template: Template, jobDescription?: string) => boolean;
  recommendation: string;
}

class ATSComplianceValidator {
  private rules: ComplianceRule[] = [
    {
      id: 'simple-formatting',
      name: 'Simple Formatting',
      description: 'Template uses simple, ATS-friendly formatting',
      weight: 25,
      check: (template) => {
        // Professional and modern templates typically have better ATS compatibility
        return template.category === 'professional' || template.category === 'modern';
      },
      recommendation: 'Use professional or modern templates for better ATS compatibility'
    },
    {
      id: 'readable-fonts',
      name: 'Readable Fonts',
      description: 'Template uses standard, readable fonts',
      weight: 15,
      check: (template) => {
        // Assume professional templates use standard fonts
        return template.features.includes('Professional Typography') || template.features.includes('Clean Layout');
      },
      recommendation: 'Choose templates with standard, readable typography'
    },
    {
      id: 'clear-sections',
      name: 'Clear Section Headers',
      description: 'Template has clear, well-defined sections',
      weight: 20,
      check: (template) => {
        return template.features.includes('Header Focus') || template.features.includes('Clean Layout');
      },
      recommendation: 'Ensure your template has clearly defined section headers'
    },
    {
      id: 'keyword-friendly',
      name: 'Keyword Optimization',
      description: 'Template layout supports keyword optimization',
      weight: 25,
      check: (template) => {
        return template.features.includes('ATS Optimized') || template.features.includes('Skills Highlighting');
      },
      recommendation: 'Select templates that are specifically ATS-optimized'
    },
    {
      id: 'standard-structure',
      name: 'Standard Structure',
      description: 'Template follows standard resume structure',
      weight: 15,
      check: (template) => {
        // All templates should follow standard structure, but creative ones might not
        return template.category !== 'creative';
      },
      recommendation: 'Avoid overly creative layouts that might confuse ATS systems'
    }
  ];

  /**
   * Analyze template ATS compliance
   */
  async analyzeTemplate(template: Template, jobDescription?: string): Promise<number> {
    // Simulate analysis delay
    await this.delay(300);

    let totalScore = 0;
    let totalWeight = 0;

    // Check each rule
    for (const rule of this.rules) {
      const passed = rule.check(template, jobDescription);
      if (passed) {
        totalScore += rule.weight;
      }
      totalWeight += rule.weight;
    }

    // Calculate percentage score
    const score = Math.round((totalScore / totalWeight) * 100);

    // Apply bonus for job description matching (if provided)
    if (jobDescription) {
      const bonus = this.calculateJobMatchBonus(template, jobDescription);
      return Math.min(score + bonus, 100);
    }

    return score;
  }

  /**
   * Get detailed ATS analysis
   */
  async getDetailedAnalysis(template: Template, jobDescription?: string): Promise<ATSAnalysisResult> {
    await this.delay(500);

    const score = await this.analyzeTemplate(template, jobDescription);
    const factors = await this.analyzeFactors(template, jobDescription);
    
    return {
      score,
      category: this.getScoreCategory(score),
      factors,
      recommendations: this.generateRecommendations(template, jobDescription),
      warnings: this.generateWarnings(template, score)
    };
  }

  /**
   * Validate multiple templates and return rankings
   */
  async rankTemplates(templates: Template[], jobDescription?: string): Promise<Array<Template & { atsScore: number }>> {
    await this.delay(800);

    const analyzed = await Promise.all(
      templates.map(async (template) => ({
        ...template,
        atsScore: await this.analyzeTemplate(template, jobDescription)
      }))
    );

    // Sort by ATS score descending
    return analyzed.sort((a, b) => b.atsScore - a.atsScore);
  }

  /**
   * Check if template meets minimum ATS requirements
   */
  async meetsMinimumRequirements(template: Template): Promise<{
    meets: boolean;
    failedRules: string[];
    criticalIssues: string[];
  }> {
    await this.delay(200);

    const failedRules: string[] = [];
    const criticalIssues: string[] = [];

    // Check critical rules (high weight)
    const criticalRules = this.rules.filter(rule => rule.weight >= 20);
    
    for (const rule of criticalRules) {
      if (!rule.check(template)) {
        failedRules.push(rule.name);
        criticalIssues.push(rule.recommendation);
      }
    }

    return {
      meets: failedRules.length === 0,
      failedRules,
      criticalIssues
    };
  }

  /**
   * Get ATS optimization suggestions
   */
  async getOptimizationSuggestions(template: Template, jobDescription?: string): Promise<{
    immediate: string[];
    recommended: string[];
    advanced: string[];
  }> {
    await this.delay(300);

    const immediate: string[] = [];
    const recommended: string[] = [];
    const advanced: string[] = [];

    // Check each rule and categorize suggestions
    for (const rule of this.rules) {
      if (!rule.check(template, jobDescription)) {
        if (rule.weight >= 25) {
          immediate.push(rule.recommendation);
        } else if (rule.weight >= 15) {
          recommended.push(rule.recommendation);
        } else {
          advanced.push(rule.recommendation);
        }
      }
    }

    // Add job-specific suggestions if job description provided
    if (jobDescription) {
      const jobSuggestions = this.getJobSpecificSuggestions(template, jobDescription);
      recommended.push(...jobSuggestions);
    }

    return {
      immediate,
      recommended,
      advanced
    };
  }

  /**
   * Calculate job match bonus
   */
  private calculateJobMatchBonus(template: Template, jobDescription: string): number {
    const jobKeywords = jobDescription.toLowerCase();
    let bonus = 0;

    // Industry-specific bonuses
    if (jobKeywords.includes('executive') && template.id === 'executive-professional') {
      bonus += 5;
    }
    
    if (jobKeywords.includes('tech') || jobKeywords.includes('engineer')) {
      if (template.id === 'tech-specialist') bonus += 5;
      if (template.features.includes('Technical Focus')) bonus += 3;
    }

    if (jobKeywords.includes('creative') || jobKeywords.includes('design')) {
      if (template.category === 'creative') bonus += 3;
    }

    if (jobKeywords.includes('startup')) {
      if (template.id === 'startup-ready') bonus += 4;
    }

    return Math.min(bonus, 10); // Cap bonus at 10 points
  }

  /**
   * Analyze individual factors
   */
  private async analyzeFactors(template: Template, jobDescription?: string): Promise<ATSAnalysisResult['factors']> {
    return {
      readability: this.analyzeReadability(template),
      keywordOptimization: this.analyzeKeywordOptimization(template, jobDescription),
      formatting: this.analyzeFormatting(template),
      structure: this.analyzeStructure(template)
    };
  }

  private analyzeReadability(template: Template): number {
    let score = 70; // Base score
    
    if (template.features.includes('Professional Typography')) score += 15;
    if (template.features.includes('Clean Layout')) score += 10;
    if (template.category === 'creative') score -= 10; // Creative templates might be less readable to ATS
    
    return Math.min(score, 100);
  }

  private analyzeKeywordOptimization(template: Template, jobDescription?: string): number {
    let score = 60; // Base score
    
    if (template.features.includes('ATS Optimized')) score += 20;
    if (template.features.includes('Skills Highlighting')) score += 15;
    if (template.features.includes('Technical Focus')) score += 10;
    
    if (jobDescription) {
      score += 5; // Bonus for having job description to optimize against
    }
    
    return Math.min(score, 100);
  }

  private analyzeFormatting(template: Template): number {
    let score = 75; // Base score
    
    if (template.category === 'professional') score += 15;
    if (template.category === 'modern') score += 10;
    if (template.category === 'creative') score -= 15;
    
    if (template.features.includes('Clean Layout')) score += 10;
    
    return Math.min(Math.max(score, 0), 100);
  }

  private analyzeStructure(template: Template): number {
    let score = 80; // Base score
    
    if (template.features.includes('Header Focus')) score += 10;
    if (template.features.includes('Project Showcase')) score += 5;
    if (template.category === 'creative') score -= 10;
    
    return Math.min(score, 100);
  }

  /**
   * Get score category
   */
  private getScoreCategory(score: number): ATSAnalysisResult['category'] {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    return 'poor';
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(template: Template, jobDescription?: string): string[] {
    const recommendations: string[] = [];
    
    // Base recommendations by category
    if (template.category === 'creative') {
      recommendations.push('Consider using a more traditional template for better ATS compatibility');
    }
    
    if (!template.features.includes('ATS Optimized')) {
      recommendations.push('Look for templates specifically marked as ATS-optimized');
    }
    
    // Job-specific recommendations
    if (jobDescription) {
      const jobKeywords = jobDescription.toLowerCase();
      
      if (jobKeywords.includes('senior') || jobKeywords.includes('executive')) {
        recommendations.push('Use a professional template that conveys executive presence');
      }
      
      if (jobKeywords.includes('tech') && !template.features.includes('Technical Focus')) {
        recommendations.push('Consider a template that highlights technical skills and projects');
      }
    }
    
    return recommendations;
  }

  /**
   * Generate warnings
   */
  private generateWarnings(template: Template, score: number): string[] {
    const warnings: string[] = [];
    
    if (score < 70) {
      warnings.push('This template may have low ATS compatibility');
    }
    
    if (template.category === 'creative' && score < 80) {
      warnings.push('Creative templates can sometimes be difficult for ATS systems to parse');
    }
    
    if (!template.features.includes('ATS Optimized') && score < 85) {
      warnings.push('Template is not specifically optimized for ATS systems');
    }
    
    return warnings;
  }

  /**
   * Get job-specific suggestions
   */
  private getJobSpecificSuggestions(template: Template, jobDescription: string): string[] {
    const suggestions: string[] = [];
    const jobKeywords = jobDescription.toLowerCase();
    
    if (jobKeywords.includes('remote') || jobKeywords.includes('distributed')) {
      suggestions.push('Highlight remote work experience and digital collaboration skills');
    }
    
    if (jobKeywords.includes('leadership') || jobKeywords.includes('management')) {
      suggestions.push('Emphasize leadership experience and team management skills');
    }
    
    if (jobKeywords.includes('agile') || jobKeywords.includes('scrum')) {
      suggestions.push('Include agile methodology experience and certifications');
    }
    
    return suggestions;
  }

  /**
   * Utility method to simulate API delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Batch analyze multiple templates
   */
  async batchAnalyze(templates: Template[], jobDescription?: string): Promise<Map<string, ATSAnalysisResult>> {
    await this.delay(1000);
    
    const results = new Map<string, ATSAnalysisResult>();
    
    for (const template of templates) {
      const analysis = await this.getDetailedAnalysis(template, jobDescription);
      results.set(template.id, analysis);
    }
    
    return results;
  }

  /**
   * Get compliance summary for dashboard
   */
  async getComplianceSummary(templates: Template[]): Promise<{
    totalTemplates: number;
    highCompliance: number;
    mediumCompliance: number;
    lowCompliance: number;
    averageScore: number;
  }> {
    await this.delay(400);
    
    let totalScore = 0;
    let highCompliance = 0;
    let mediumCompliance = 0;
    let lowCompliance = 0;
    
    for (const template of templates) {
      const score = await this.analyzeTemplate(template);
      totalScore += score;
      
      if (score >= 80) highCompliance++;
      else if (score >= 60) mediumCompliance++;
      else lowCompliance++;
    }
    
    return {
      totalTemplates: templates.length,
      highCompliance,
      mediumCompliance,
      lowCompliance,
      averageScore: Math.round(totalScore / templates.length)
    };
  }
}

// Export singleton instance
export const atsComplianceValidator = new ATSComplianceValidator();

// Export the class for testing or custom instances
export { ATSComplianceValidator };