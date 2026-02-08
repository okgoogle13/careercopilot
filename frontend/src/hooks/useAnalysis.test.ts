import { renderHook, act } from '@testing-library/react';
import { useAnalysis, type AnalysisResult } from './useAnalysis';

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
        let analysis: AnalysisResult | undefined;

        await act(async () => {
            const analysisPromise = result.current.analyzeDocument(documentText, jobCriteria, false);
            jest.advanceTimersByTime(1500);
            analysis = await analysisPromise;
        });

        expect(analysis?.breakdown.softSkills.reason).toContain('3 action verbs detected');
    });
});
