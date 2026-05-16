import { jest } from '@jest/globals';

// Must register mocks before dynamic import of the module under test
const mockAnalyzeJobDescription = jest.fn();
const mockAnalyzeJobFromUrl = jest.fn();
const mockGenerateIntelligencePackage = jest.fn();

(jest as any).unstable_mockModule('@/services/aiTextProcessing', () => ({
  analyzeJobDescription: mockAnalyzeJobDescription,
  analyzeJobFromUrl: mockAnalyzeJobFromUrl,
  generateIntelligencePackage: mockGenerateIntelligencePackage,
}));

const { renderHook, act } = await import('@testing-library/react');
const { useAnalysis } = await import('./useAnalysis');

describe('useAnalysis', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('counts unique action verbs in analysis results', async () => {
    const { result } = renderHook(() => useAnalysis());
    const documentText = 'Led the team and led delivery. Managed budgets and delivered outcomes.';
    const jobCriteria = 'leadership management budgeting';
    let analysis: any;

    await act(async () => {
      const analysisPromise = result.current.analyzeDocument(documentText, jobCriteria, false);
      jest.advanceTimersByTime(1500);
      analysis = await analysisPromise;
    });

    expect(analysis?.score.softSkills).toBe(30);
  });

  it('does not double-count repeated action verbs', async () => {
    const { result } = renderHook(() => useAnalysis());
    const documentText = 'Led the team. Led delivery.';
    const jobCriteria = 'leadership management budgeting';
    let analysis: any;

    await act(async () => {
      const analysisPromise = result.current.analyzeDocument(documentText, jobCriteria, false);
      jest.advanceTimersByTime(1500);
      analysis = await analysisPromise;
    });

    expect(analysis?.score.softSkills).toBe(10);
  });

  it('generates quantifier suggestions for impact language', async () => {
    const { result } = renderHook(() => useAnalysis());
    let analysis: any;

    await act(async () => {
      const analysisPromise = result.current.analyzeDocument(
        'Managed a team and improved outcomes. Led a project and delivered results.',
        'leadership outcomes delivery',
        false
      );
      jest.advanceTimersByTime(1500);
      analysis = await analysisPromise;
    });

    expect(analysis?.quantifiers.length).toBeGreaterThan(0);
    expect(analysis?.quantifiers.some((q: any) => q.type === 'number')).toBe(true);
    expect(analysis?.quantifiers.some((q: any) => q.type === 'percentage')).toBe(true);
  });

  it('recommends ATS formatting improvements when sections are missing', async () => {
    const { result } = renderHook(() => useAnalysis());
    let analysis: any;

    await act(async () => {
      const analysisPromise = result.current.analyzeDocument(
        'Short freeform paragraph without standard resume headings.',
        'python react leadership',
        false
      );
      jest.advanceTimersByTime(1500);
      analysis = await analysisPromise;
    });

    expect(analysis?.score.atsReadability).toBeLessThan(80);
    expect(
      analysis?.recommendations.includes('Simplify formatting for better ATS compatibility')
    ).toBe(true);
  });

  it('returns strong recommendations when document is well structured', async () => {
    const { result } = renderHook(() => useAnalysis());
    let analysis: any;
    const longContent = `
      Summary
      Led teams, managed projects, developed systems, implemented improvements, optimized process.
      Experience
      Achieved 30% efficiency gains and delivered a $500K program in 3 months.
      Education
      Skills
      Python React Leadership Management Delivery Strategy Collaboration
      `.repeat(8);

    await act(async () => {
      const analysisPromise = result.current.analyzeDocument(
        longContent,
        'python react leadership management delivery strategy collaboration',
        false
      );
      jest.advanceTimersByTime(1500);
      analysis = await analysisPromise;
    });

    expect(analysis?.score.hardSkills).toBeGreaterThanOrEqual(70);
    expect(analysis?.score.softSkills).toBeGreaterThanOrEqual(60);
    expect(analysis?.score.impact).toBeGreaterThanOrEqual(70);
    expect(analysis?.recommendations).toContain('Excellent! Your document is well-optimized');
  });
});
