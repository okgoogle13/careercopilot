import nlp from 'compromise';
import {
  ATSScoreResult,
  CoverLetterScoreResult,
  DocumentType,
  ScoringWeights,
} from '../../../types/career';

export class ATSScorer {
  private resumeWeights: ScoringWeights = {
    keywordMatch: 0.45,
    skillsAlignment: 0.25,
    jobTitleMatch: 0.15,
    experienceRelevance: 0.1,
    formatCompliance: 0.05,
  };

  private coverLetterWeights = {
    keywordDensity: 0.45,
    keywordPlacement: 0.18,
    skillsAlignment: 0.22,
    formatCompliance: 0.15,
  };

  public calculateScore(
    documentText: string,
    jobDescription: string,
    documentType: DocumentType = 'resume'
  ): ATSScoreResult | CoverLetterScoreResult {
    if (documentType === 'coverLetter') {
      return this.calculateCoverLetterScore(documentText, jobDescription);
    }
    return this.calculateResumeScore(documentText, jobDescription);
  }

  private calculateResumeScore(resumeText: string, jobDescription: string): ATSScoreResult {
    const jobKeywords = this.extractKeywords(jobDescription);
    const resumeKeywords = this.extractKeywords(resumeText);

    const keywordMatchScore = this.scoreKeywordMatch(resumeKeywords, jobKeywords, resumeText);
    const skillsScore = this.scoreSkillsAlignment(resumeText, jobDescription);
    const jobTitleScore = this.scoreJobTitleMatch(resumeText, jobDescription);
    const experienceScore = this.scoreExperienceRelevance(resumeText, jobDescription);
    const formatScore = this.scoreFormatCompliance(resumeText);

    const overallScore = Math.round(
      keywordMatchScore * this.resumeWeights.keywordMatch +
        skillsScore * this.resumeWeights.skillsAlignment +
        jobTitleScore * this.resumeWeights.jobTitleMatch +
        experienceScore * this.resumeWeights.experienceRelevance +
        formatScore * this.resumeWeights.formatCompliance
    );

    return {
      overallScore,
      breakdown: {
        keywordMatch: keywordMatchScore,
        skillsAlignment: skillsScore,
        jobTitleMatch: jobTitleScore,
        experienceRelevance: experienceScore,
        formatCompliance: formatScore,
      },
      matchedKeywords: this.getMatchedKeywords(resumeKeywords, jobKeywords),
      missingKeywords: this.getMissingKeywords(resumeKeywords, jobKeywords),
      suggestions: this.generateSuggestions(
        resumeText,
        jobDescription,
        keywordMatchScore,
        skillsScore
      ),
      keywordDensity: this.calculateKeywordDensity(resumeText, jobKeywords),
    };
  }

  private calculateCoverLetterScore(
    coverLetterText: string,
    jobDescription: string
  ): CoverLetterScoreResult {
    const jobKeywords = this.extractKeywords(jobDescription);
    const coverLetterKeywords = this.extractKeywords(coverLetterText);

    const keywordMatchScore = this.scoreKeywordMatch(
      coverLetterKeywords,
      jobKeywords,
      coverLetterText,
      'coverLetter'
    );
    const placementScore = this.scoreKeywordPlacement(coverLetterText, jobKeywords);
    const skillsScore = this.scoreSkillsAlignment(coverLetterText, jobDescription);
    const formatScore = this.scoreCoverLetterFormat(coverLetterText);

    const narrativeScore = this.scoreNarrativeQuality(coverLetterText);
    const personalizationScore = this.scorePersonalization(coverLetterText, jobDescription);
    const toneScore = this.scoreToneProfessionalism(coverLetterText);
    const lengthScore = this.scoreLengthCompliance(coverLetterText);

    const overallScore = Math.round(
      keywordMatchScore * this.coverLetterWeights.keywordDensity +
        placementScore * this.coverLetterWeights.keywordPlacement +
        skillsScore * this.coverLetterWeights.skillsAlignment +
        formatScore * this.coverLetterWeights.formatCompliance
    );

    const callToActionPresent = this.detectCallToAction(coverLetterText);

    return {
      overallScore,
      breakdown: {
        keywordMatch: keywordMatchScore,
        skillsAlignment: skillsScore,
        formatCompliance: formatScore,
        jobTitleMatch: 100, // Not applicable for CL
        experienceRelevance: 100, // Not applicable for CL
        narrativeQuality: narrativeScore,
        personalizationScore: personalizationScore,
        toneProfessionalism: toneScore,
      },
      matchedKeywords: this.getMatchedKeywords(coverLetterKeywords, jobKeywords),
      missingKeywords: this.getMissingKeywords(coverLetterKeywords, jobKeywords),
      suggestions: this.generateCoverLetterSuggestions(
        coverLetterText,
        jobDescription,
        placementScore,
        formatScore,
        callToActionPresent
      ),
      keywordDensity: this.calculateKeywordDensity(coverLetterText, jobKeywords),
      keywordPlacement: placementScore,
      narrativeQuality: narrativeScore,
      personalizationScore: personalizationScore,
      toneProfessionalism: toneScore,
      lengthCompliance: lengthScore,
      callToActionPresent,
    };
  }

  private extractKeywords(text: string): Set<string> {
    const doc = nlp(text.toLowerCase());
    const nouns = doc.nouns().out('array');
    const verbs = doc.verbs().out('array');
    const adjectives = doc.adjectives().out('array');

    // Filter out common words and short tokens
    const stopWords = new Set([
      'the',
      'and',
      'for',
      'with',
      'that',
      'this',
      'from',
      'your',
      'their',
      'will',
      'have',
      'been',
      'were',
      'was',
      'are',
      'has',
    ]);

    const keywords = [...nouns, ...verbs, ...adjectives]
      .map((k) => k.trim())
      .filter((k) => k.length > 2 && !stopWords.has(k) && /^[a-z\s]+$/.test(k));

    return new Set(keywords);
  }

  private scoreKeywordMatch(
    docKeywords: Set<string>,
    jobKeywords: Set<string>,
    text: string,
    type: DocumentType = 'resume'
  ): number {
    if (jobKeywords.size === 0) return 100;

    const exactMatches = [...jobKeywords].filter((kw) => docKeywords.has(kw));
    const baseScore = (exactMatches.length / jobKeywords.size) * 100;

    // Simple semantic bonus based on word overlap in sentences
    const sentences = text.toLowerCase().split(/[.!?]+/);
    let bonus = 0;
    jobKeywords.forEach((kw) => {
      if (!docKeywords.has(kw)) {
        const foundInSentence = sentences.some((s) => s.includes(kw));
        if (foundInSentence) bonus += 2;
      }
    });

    return Math.min(100, baseScore + bonus);
  }

  private scoreSkillsAlignment(text: string, jobDescription: string): number {
    const commonSkills = [
      'python',
      'javascript',
      'react',
      'typescript',
      'node.js',
      'sql',
      'aws',
      'docker',
      'kubernetes',
      'git',
      'communication',
      'leadership',
      'problem-solving',
      'teamwork',
      'agile',
      'scrum',
      'project management',
      'data analysis',
      'customer service',
      'sales',
      'marketing',
      'design',
      'ui/ux',
      'ndis',
      'trauma-informed',
    ];

    const jobSkills = commonSkills.filter((skill) => jobDescription.toLowerCase().includes(skill));
    if (jobSkills.length === 0) return 100;

    const resumeSkills = jobSkills.filter((skill) => text.toLowerCase().includes(skill));
    return (resumeSkills.length / jobSkills.length) * 100;
  }

  private scoreJobTitleMatch(text: string, jobDescription: string): number {
    const jobTitleMatch = jobDescription.match(/Job Title:?\s*([^\n]+)/i);
    if (!jobTitleMatch) return 100;

    const targetTitle = jobTitleMatch[1].toLowerCase();
    return text.toLowerCase().includes(targetTitle) ? 100 : 50;
  }

  private scoreExperienceRelevance(text: string, jobDescription: string): number {
    const yearsMatch = jobDescription.match(/(\d+)\+?\s*years?/i);
    if (!yearsMatch) return 100;

    const requiredYears = parseInt(yearsMatch[1]);
    const resumeYears = text.match(/(\d+)\+?\s*years?/gi);

    if (!resumeYears) return 50;

    const maxYears = Math.max(...resumeYears.map((y) => parseInt(y)));
    return maxYears >= requiredYears ? 100 : (maxYears / requiredYears) * 100;
  }

  private scoreKeywordPlacement(coverLetterText: string, keywords: Set<string>): number {
    const paragraphs = coverLetterText.split('\n\n').filter((p) => p.trim().length > 0);

    if (paragraphs.length === 0 || keywords.size === 0) return 0;

    const firstParaKeywords = [...keywords].filter((kw) =>
      paragraphs[0].toLowerCase().includes(kw)
    ).length;

    const otherParaKeywords = [...keywords].filter((kw) =>
      paragraphs.slice(1).join(' ').toLowerCase().includes(kw)
    ).length;

    const placementScore =
      (firstParaKeywords / keywords.size) * 60 + (otherParaKeywords / keywords.size) * 40;

    return Math.min(100, placementScore);
  }

  private scoreCoverLetterFormat(text: string): number {
    let score = 100;
    const paragraphs = text.split('\n\n').filter((p) => p.trim().length > 0);
    if (paragraphs.length < 3) score -= 20;
    if (text.includes('Table') || text.includes('Chart')) score -= 20;
    return Math.max(0, score);
  }

  private scoreFormatCompliance(text: string): number {
    let score = 100;
    if (text.includes('Table') || text.includes('Chart')) score -= 20;
    if (text.length < 500) score -= 30;
    return Math.max(0, score);
  }

  private scoreNarrativeQuality(text: string): number {
    let score = 100;
    const paragraphs = text.split('\n\n').filter((p) => p.trim().length > 0);
    if (paragraphs.length < 3) score -= 20;
    if (paragraphs.length > 6) score -= 10;

    const hasMetrics = /\d+%|\d+\+|increased|improved|reduced|generated/i.test(text);
    if (!hasMetrics) score -= 15;

    return Math.max(0, score);
  }

  private scorePersonalization(text: string, jobDescription: string): number {
    let score = 100;
    const companyNameMatch =
      jobDescription.match(/Company:?\s*([^\n]+)/i) ||
      jobDescription.match(/at\s+([A-Z][a-zA-Z\s&]+?)[\.,\s]/);
    const companyName = companyNameMatch ? companyNameMatch[1].trim() : null;

    if (companyName && !text.toLowerCase().includes(companyName.toLowerCase())) {
      score -= 30;
    }

    const genericPhrases = [
      'to whom it may concern',
      'dear hiring manager',
      'i am writing to apply',
    ];
    genericPhrases.forEach((phrase) => {
      if (text.toLowerCase().includes(phrase)) score -= 10;
    });

    return Math.max(0, score);
  }

  private scoreToneProfessionalism(text: string): number {
    let score = 100;
    const hasGreeting = /dear\s+[a-z]+/i.test(text);
    if (!hasGreeting) score -= 20;

    const hasClosing = /sincerely|regards|respectfully|best/i.test(text);
    if (!hasClosing) score -= 20;

    return Math.max(0, score);
  }

  private scoreLengthCompliance(text: string): number {
    const wordCount = text.split(/\s+/).length;
    if (wordCount >= 300 && wordCount <= 400) return 100;
    if (wordCount < 200) return 40;
    return 70;
  }

  private detectCallToAction(text: string): boolean {
    const ctaPatterns = ['look forward to', 'would welcome', 'eager to discuss', 'available for'];
    return ctaPatterns.some((pattern) => text.toLowerCase().includes(pattern));
  }

  private calculateKeywordDensity(text: string, keywords: Set<string>): Record<string, number> {
    const words = text.toLowerCase().split(/\s+/);
    const wordCount = words.length;
    const density: Record<string, number> = {};

    keywords.forEach((keyword) => {
      const occurrences = (text.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || [])
        .length;
      density[keyword] = parseFloat(((occurrences / wordCount) * 100).toFixed(2));
    });

    return density;
  }

  private getMatchedKeywords(docKeywords: Set<string>, jobKeywords: Set<string>): string[] {
    return [...jobKeywords].filter((kw) => docKeywords.has(kw));
  }

  private getMissingKeywords(docKeywords: Set<string>, jobKeywords: Set<string>): string[] {
    return [...jobKeywords].filter((kw) => !docKeywords.has(kw));
  }

  private generateSuggestions(
    text: string,
    jobDescription: string,
    keywordScore: number,
    skillsScore: number
  ): string[] {
    const suggestions: string[] = [];
    if (keywordScore < 60)
      suggestions.push('Add more keywords from the job description to improve match rate');
    if (skillsScore < 70)
      suggestions.push('Include specific technical skills mentioned in the job posting');
    return suggestions;
  }

  private generateCoverLetterSuggestions(
    text: string,
    jobDescription: string,
    placementScore: number,
    formatScore: number,
    hasCTA: boolean
  ): string[] {
    const suggestions: string[] = [];
    if (placementScore < 60)
      suggestions.push('Include more job description keywords in your opening paragraph');
    if (formatScore < 80)
      suggestions.push('Ensure simple paragraph formatting without tables or complex structures');
    if (!hasCTA) suggestions.push('Add a call to action expressing interest in an interview');
    return suggestions;
  }
}
