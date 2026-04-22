import { renderHook, act } from '@testing-library/react';
import { useAnalysisPipelineStore } from '../analysisPipelineStore';

describe('analysisPipelineStore', () => {
  beforeEach(() => {
    useAnalysisPipelineStore.setState({ pipelines: {} });
  });

  it('should initialize with empty pipelines', () => {
    const { result } = renderHook(() => useAnalysisPipelineStore());
    expect(result.current.pipelines).toEqual({});
  });

  it('should set ingestion data keyed by assetId', () => {
    const { result } = renderHook(() => useAnalysisPipelineStore());
    act(() => {
      result.current.setIngestion('asset-123', {
        fileType: 'pdf',
        fileName: 'resume.pdf',
        extractedText: 'Jane Doe...',
      });
    });
    expect(result.current.pipelines['asset-123'].ingestion).toEqual({
      fileType: 'pdf',
      fileName: 'resume.pdf',
      extractedText: 'Jane Doe...',
    });
  });

  it('should set ATS result keyed by assetId', () => {
    const { result } = renderHook(() => useAnalysisPipelineStore());
    act(() => {
      result.current.setAtsResult('asset-123', {
        overallScore: 78,
        keywordMatch: 0.85,
        semanticScore: 0.72,
        formattingScore: 0.68,
        extractionFlags: [],
      });
    });
    expect(result.current.pipelines['asset-123'].atsResult?.overallScore).toBe(78);
  });

  it('should set export URLs keyed by assetId and format', () => {
    const { result } = renderHook(() => useAnalysisPipelineStore());
    act(() => {
      result.current.setExportUrl('asset-123', 'resume', '/export/resume/signed-url-1');
      result.current.setExportUrl('asset-123', 'cover-letter', '/export/cover-letter/signed-url-2');
    });
    expect(result.current.pipelines['asset-123'].exports.resume).toBe(
      '/export/resume/signed-url-1'
    );
    expect(result.current.pipelines['asset-123'].exports['cover-letter']).toBe(
      '/export/cover-letter/signed-url-2'
    );
  });

  it('should retrieve pipeline by assetId', () => {
    const { result } = renderHook(() => useAnalysisPipelineStore());
    act(() => {
      result.current.setIngestion('asset-123', {
        fileType: 'pdf',
        fileName: 'resume.pdf',
        extractedText: 'Jane Doe...',
      });
    });
    const pipeline = result.current.getPipeline('asset-123');
    expect(pipeline?.ingestion?.fileName).toBe('resume.pdf');
  });

  it('should clear pipeline by assetId', () => {
    const { result } = renderHook(() => useAnalysisPipelineStore());
    act(() => {
      result.current.setIngestion('asset-123', {
        fileType: 'pdf',
        fileName: 'resume.pdf',
        extractedText: 'Jane Doe...',
      });
    });
    expect(result.current.pipelines['asset-123']).toBeDefined();
    act(() => {
      result.current.clearPipeline('asset-123');
    });
    expect(result.current.pipelines['asset-123']).toBeUndefined();
  });
});
