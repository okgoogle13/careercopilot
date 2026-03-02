import { useState, useCallback } from 'react';
import type { AuditResponse, JobAnalysis, UserProfile } from '../types/intelligence';
import { analyzeJobDescription, analyzeJobFromUrl, generateIntelligencePackage } from '../services/aiInterface';
import { EXPERT_RESUME_AUDITOR_PROMPT } from '../services/prompts';

/**
 * Analysis Hook - Enhanced with Portable Intelligence Engine
 * Implements 4-Quadrant Scoring Rubric + The Quantifier
 * 
 * Now integrated with:
 * - JobAnalysis type system
 * - AuditResponse 4-quadrant scoring
 * - Expert Resume Auditor persona from MiniMe
 */


export interface AnalysisScore {
    overall: number; // 0-100
    hardSkills: number; // 0-100
    softSkills: number; // 0-100
    impact: number; // 0-100
    atsReadability: number; // 0-100
}

export interface QuantifierSuggestion {
    original: string;
    suggestion: string;
    type: 'number' | 'percentage' | 'timeframe' | 'scale';
    contextualWhy?: string;
}

export interface AnalysisResult {
    score: AnalysisScore;
    keywords: {
        matched: string[];
        missing: string[];
        density: number;
    };
    quantifiers: QuantifierSuggestion[];
    recommendations: string[];
    breakdown: {
        hardSkills: { score: number; reason: string };
        softSkills: { score: number; reason: string };
        impact: { score: number; reason: string };
        atsReadability: { score: number; reason: string };
    };
}

export function useAnalysis() {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);


    /**
     * Analyze Job Description - Extract intelligence
     */
    const analyzeJob = useCallback(async (jobText: string): Promise<JobAnalysis> => {
        try {
            const analysis = await analyzeJobDescription(jobText);
            setJobAnalysis(analysis);
            return analysis;
        } catch (error) {
            console.error('Job analysis failed:', error);
            throw error;
        }
    }, []);

    /**
     * Analyze Job from URL - Extract intelligence with Google Search grounding
     */
    const analyzeJobUrl = useCallback(async (url: string): Promise<JobAnalysis> => {
        try {
            const analysis = await analyzeJobFromUrl(url);
            setJobAnalysis(analysis);
            return analysis;
        } catch (error) {
            console.error('Job URL analysis failed:', error);
            throw error;
        }
    }, []);

    /**
     * Core Analysis Engine
     * Evaluates resume/document against job criteria
     * Now with AI-powered intelligence
     */
    const analyzeDocument = useCallback(async (
        documentText: string,
        jobCriteria: string,
        useAI = false
    ): Promise<AnalysisResult> => {
        setAnalyzing(true);

        try {
            if (useAI && jobAnalysis) {
                // Use AI-powered analysis with Portable Intelligence Engine
                const profile = parseDocumentToProfile(documentText);
                const intelligencePackage = await generateIntelligencePackage(
                    profile,
                    jobAnalysis,
                    EXPERT_RESUME_AUDITOR_PROMPT
                );

                const aiResult = convertAuditToAnalysisResult(intelligencePackage.audit, jobAnalysis);
                setResult(aiResult);
                return aiResult;
            }

            // Fallback: Heuristic-based analysis
            await new Promise((resolve) => setTimeout(resolve, 1500));

            const criteriaKeywords = extractKeywords(jobCriteria);
            const documentWords = extractKeywords(documentText);

            const matchedKeywords = criteriaKeywords.filter((kw) =>
                documentWords.some((dw) => dw.toLowerCase().includes(kw.toLowerCase()))
            );
            const missingKeywords = criteriaKeywords.filter(
                (kw) => !matchedKeywords.includes(kw)
            );
            const keywordDensity = (matchedKeywords.length / criteriaKeywords.length) * 100;
            const hardSkillsScore = Math.min(keywordDensity, 100);

            const actionVerbs = countActionVerbs(documentText);
            const softSkillsScore = Math.min((actionVerbs / 10) * 100, 100);

            const quantifiers = detectQuantifiers(documentText);
            const impactScore = Math.min((quantifiers.length / 5) * 100, 100);

            const atsScore = evaluateAtsReadability(documentText);

            const overall = Math.round(
                hardSkillsScore * 0.3 +
                softSkillsScore * 0.2 +
                impactScore * 0.3 +
                atsScore * 0.2
            );

            const recommendations = generateRecommendations({
                hardSkills: hardSkillsScore,
                softSkills: softSkillsScore,
                impact: impactScore,
                atsReadability: atsScore,
            });

            const quantifierSuggestions = suggestQuantifiers(documentText);

            const analysisResult: AnalysisResult = {
                score: {
                    overall,
                    hardSkills: Math.round(hardSkillsScore),
                    softSkills: Math.round(softSkillsScore),
                    impact: Math.round(impactScore),
                    atsReadability: Math.round(atsScore),
                },
                keywords: {
                    matched: matchedKeywords,
                    missing: missingKeywords,
                    density: Math.round(keywordDensity),
                },
                quantifiers: quantifierSuggestions,
                recommendations,
                breakdown: {
                    hardSkills: {
                        score: Math.round(hardSkillsScore),
                        reason: `${matchedKeywords.length}/${criteriaKeywords.length} key skills matched`,
                    },
                    softSkills: {
                        score: Math.round(softSkillsScore),
                        reason: `${actionVerbs} action verbs detected`,
                    },
                    impact: {
                        score: Math.round(impactScore),
                        reason: `${quantifiers.length} quantifiable achievements found`,
                    },
                    atsReadability: {
                        score: Math.round(atsScore),
                        reason: atsScore > 80 ? 'Excellent structure' : 'Needs formatting improvement',
                    },
                },
            };

            setResult(analysisResult);
            return analysisResult;
        } finally {
            setAnalyzing(false);
        }
    }, [jobAnalysis]);


    return {
        analyzeDocument,
        analyzeJob,
        analyzeJobUrl,
        analyzing,
        result,
        jobAnalysis,
    };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert AI Audit Response to AnalysisResult format
 */
function convertAuditToAnalysisResult(
    audit: AuditResponse,
    jobAnalysis: JobAnalysis
): AnalysisResult {
    return {
        score: {
            overall: audit.overallScore,
            hardSkills: audit.scoreBreakdown.hardSkillsMatch.score,
            softSkills: audit.scoreBreakdown.softSkillsMatch.score,
            impact: audit.scoreBreakdown.quantifiableAchievements.score,
            atsReadability: audit.scoreBreakdown.atsReadability.score,
        },
        keywords: {
            matched: jobAnalysis.keywords.slice(0, 10), // Simplified
            missing: jobAnalysis.keywords.slice(10, 15),
            density: audit.scoreBreakdown.hardSkillsMatch.score,
        },
        quantifiers: audit.quantificationSuggestions.map((q) => ({
            original: q.originalText,
            suggestion: q.suggestedRewrite,
            type: 'number' as const,
            contextualWhy: q.contextualWhy,
        })),
        recommendations: audit.actionableFeedback,
        breakdown: {
            hardSkills: {
                score: audit.scoreBreakdown.hardSkillsMatch.score,
                reason: audit.scoreBreakdown.hardSkillsMatch.analysis,
            },
            softSkills: {
                score: audit.scoreBreakdown.softSkillsMatch.score,
                reason: audit.scoreBreakdown.softSkillsMatch.analysis,
            },
            impact: {
                score: audit.scoreBreakdown.quantifiableAchievements.score,
                reason: audit.scoreBreakdown.quantifiableAchievements.analysis,
            },
            atsReadability: {
                score: audit.scoreBreakdown.atsReadability.score,
                reason: audit.scoreBreakdown.atsReadability.analysis,
            },
        },
    };
}

/**
 * Parse document text to UserProfile (simplified version)
 */
function parseDocumentToProfile(documentText: string): UserProfile {
    // This is a simplified parser - in production, you'd want more sophisticated parsing
    return {
        fullName: 'User Name',
        resumeHeadline: 'Professional',
        contact: {
            phone: '',
            email: '',
            location: '',
        },
        careerSummary: documentText.slice(0, 200),
        education: [],
        skills: [],
        experience: [],
        development: {
            certifications: [],
            trainings: [],
        },
    };
}

function extractKeywords(text: string): string[] {
    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3);

    const stopWords = new Set(['this', 'that', 'with', 'from', 'have', 'been', 'were', 'your', 'will']);
    return [...new Set(words.filter((w) => !stopWords.has(w)))];
}

const ACTION_VERBS = [
    'led', 'managed', 'created', 'developed', 'implemented', 'designed',
    'achieved', 'improved', 'increased', 'reduced', 'optimized', 'coordinated',
    'facilitated', 'mentored', 'trained', 'delivered', 'executed', 'launched',
];
const ACTION_VERB_PATTERN = new RegExp(`\\b(?:${ACTION_VERBS.join('|')})\\b`, 'gi');

function countActionVerbs(text: string): number {
    const matches = text.match(ACTION_VERB_PATTERN);
    if (!matches) {
        return 0;
    }
    const normalizedMatches = matches.map((match) => match.toLowerCase());
    return new Set(normalizedMatches).size;
}

function detectQuantifiers(text: string): string[] {
    const numberPattern = /\d+[%]?|\$\d+[kKmM]?/g;
    return text.match(numberPattern) || [];
}

function evaluateAtsReadability(text: string): number {
    let score = 100;

    if ((text.match(/[•●▪]/g) || []).length > 20) score -= 10;

    const hasSections = /experience|education|skills|summary/i.test(text);
    if (!hasSections) score -= 20;

    if (text.length < 200) score -= 30;
    if (text.length > 5000) score -= 10;

    return Math.max(score, 0);
}

function generateRecommendations(scores: {
    hardSkills: number;
    softSkills: number;
    impact: number;
    atsReadability: number;
}): string[] {
    const recommendations: string[] = [];

    if (scores.hardSkills < 70) {
        recommendations.push('Add more technical keywords from the job description');
    }

    if (scores.softSkills < 60) {
        recommendations.push('Use more action verbs (e.g., "Led", "Developed", "Achieved")');
    }

    if (scores.impact < 70) {
        recommendations.push('Quantify your achievements with numbers and percentages');
    }

    if (scores.atsReadability < 80) {
        recommendations.push('Simplify formatting for better ATS compatibility');
    }

    if (recommendations.length === 0) {
        recommendations.push('Excellent! Your document is well-optimized');
    }

    return recommendations;
}

function suggestQuantifiers(text: string): QuantifierSuggestion[] {
    const suggestions: QuantifierSuggestion[] = [];

    const patterns = [
        {
            regex: /managed\s+(a\s+)?team/gi,
            suggestion: '[Managed a team of 10]',
            type: 'number' as const,
        },
        {
            regex: /improved|increased|enhanced/gi,
            suggestion: '[Increased efficiency by 25%]',
            type: 'percentage' as const,
        },
        {
            regex: /led\s+(a\s+)?project/gi,
            suggestion: '[Led a $500K project]',
            type: 'scale' as const,
        },
        {
            regex: /delivered|completed/gi,
            suggestion: '[Delivered within 3 months]',
            type: 'timeframe' as const,
        },
    ];

    patterns.forEach(({ regex, suggestion, type }) => {
        const matches = text.match(regex);
        if (matches) {
            matches.slice(0, 2).forEach((match) => {
                suggestions.push({
                    original: match,
                    suggestion,
                    type,
                });
            });
        }
    });

    return suggestions;
}
