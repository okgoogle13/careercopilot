import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface IngestionData {
  fileType: 'pdf' | 'docx' | 'txt';
  fileName: string;
  extractedText: string;
  uploadedAt?: Date;
}

export interface AtsResult {
  overallScore: number;
  keywordMatch: number;
  semanticScore: number;
  formattingScore: number;
  extractionFlags: string[];
  scoredAt?: Date;
}

export interface PipelineExports {
  resume?: string;
  'cover-letter'?: string;
}

export interface AnalysisPipeline {
  assetId: string;
  ingestion?: IngestionData;
  atsResult?: AtsResult;
  exports: PipelineExports;
  createdAt: Date;
  updatedAt: Date;
}

interface AnalysisPipelineStore {
  pipelines: Record<string, AnalysisPipeline>;
  setIngestion: (assetId: string, ingestion: IngestionData) => void;
  setAtsResult: (assetId: string, atsResult: AtsResult) => void;
  setExportUrl: (assetId: string, format: 'resume' | 'cover-letter', url: string) => void;
  getPipeline: (assetId: string) => AnalysisPipeline | undefined;
  clearPipeline: (assetId: string) => void;
}

const makeEmptyPipeline = (assetId: string): AnalysisPipeline => ({
  assetId,
  exports: {},
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const useAnalysisPipelineStore = create<AnalysisPipelineStore>()(
  devtools(
    persist(
      (set, get) => ({
        pipelines: {},

        setIngestion: (assetId, ingestion) =>
          set((state) => ({
            pipelines: {
              ...state.pipelines,
              [assetId]: {
                ...(state.pipelines[assetId] ?? makeEmptyPipeline(assetId)),
                ingestion,
                updatedAt: new Date(),
              },
            },
          })),

        setAtsResult: (assetId, atsResult) =>
          set((state) => ({
            pipelines: {
              ...state.pipelines,
              [assetId]: {
                ...(state.pipelines[assetId] ?? makeEmptyPipeline(assetId)),
                atsResult,
                updatedAt: new Date(),
              },
            },
          })),

        setExportUrl: (assetId, format, url) =>
          set((state) => {
            const existing = state.pipelines[assetId] ?? makeEmptyPipeline(assetId);
            return {
              pipelines: {
                ...state.pipelines,
                [assetId]: {
                  ...existing,
                  exports: { ...existing.exports, [format]: url },
                  updatedAt: new Date(),
                },
              },
            };
          }),

        getPipeline: (assetId) => get().pipelines[assetId],

        clearPipeline: (assetId) =>
          set((state) => {
            const { [assetId]: _, ...rest } = state.pipelines;
            return { pipelines: rest };
          }),
      }),
      { name: 'analysis-pipeline-store', version: 1 }
    ),
    { name: 'AnalysisPipelineStore' }
  )
);
