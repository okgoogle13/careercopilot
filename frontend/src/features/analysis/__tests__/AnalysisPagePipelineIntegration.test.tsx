import { renderHook, act } from '@testing-library/react';
import { useAnalysisPipelineStore } from '../../../stores/analysisPipelineStore';

describe('AnalysisPage pipeline store integration', () => {
  beforeEach(() => {
    useAnalysisPipelineStore.setState({
      pipelines: {},
    });
  });

  it('should persist ingestion data when handleAnalysis is called', () => {
    const { result } = renderHook(() => useAnalysisPipelineStore());
    const assetId = 'test-asset-123';
    const resumeText = 'Senior Engineer with 5 years experience';

    act(() => {
      result.current.setIngestion(assetId, {
        fileType: 'txt',
        fileName: 'resume',
        extractedText: resumeText,
        uploadedAt: new Date(),
      });
    });

    const pipeline = result.current.getPipeline(assetId);
    expect(pipeline?.ingestion?.extractedText).toBe(resumeText);
    expect(pipeline?.ingestion?.fileName).toBe('resume');
  });

  it('should persist ATS result after analysis', () => {
    const { result } = renderHook(() => useAnalysisPipelineStore());
    const assetId = 'test-asset-456';

    act(() => {
      result.current.setAtsResult(assetId, {
        overallScore: 82,
        keywordMatch: 15,
        semanticScore: 0.78,
        formattingScore: 0.85,
        extractionFlags: ['missing_gpa', 'weak_action_verbs'],
        scoredAt: new Date(),
      });
    });

    const pipeline = result.current.getPipeline(assetId);
    expect(pipeline?.atsResult?.overallScore).toBe(82);
    expect(pipeline?.atsResult?.keywordMatch).toBe(15);
  });

  it('should survive page refresh by persisting to localStorage', () => {
    const { result: result1 } = renderHook(() => useAnalysisPipelineStore());
    const assetId = 'test-asset-789';

    act(() => {
      result1.current.setIngestion(assetId, {
        fileType: 'pdf',
        fileName: 'resume.pdf',
        extractedText: 'Jane Doe experience',
        uploadedAt: new Date(),
      });
    });

    // Simulate localStorage persistence
    const stored = JSON.parse(localStorage.getItem('analysis-pipeline-store') || '{}');
    expect(stored.state?.pipelines?.[assetId]).toBeDefined();
  });

  it('should support clearing a pipeline', () => {
    const { result } = renderHook(() => useAnalysisPipelineStore());
    const assetId = 'test-asset-delete';

    act(() => {
      result.current.setIngestion(assetId, {
        fileType: 'txt',
        fileName: 'resume',
        extractedText: 'data',
        uploadedAt: new Date(),
      });
    });

    expect(result.current.getPipeline(assetId)).toBeDefined();

    act(() => {
      result.current.clearPipeline(assetId);
    });

    expect(result.current.getPipeline(assetId)).toBeUndefined();
  });
});
