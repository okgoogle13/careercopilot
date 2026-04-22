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

export const useAnalysisPipelineStore = create<AnalysisPipelineStore>()(
  devtools(
    persist(
      (set, get) => ({
        pipelines: {},

        setIngestion: (assetId: string, ingestion: IngestionData) => {
          set((state) => {
            const existing = state.pipelines[assetId] || {
              assetId,
              exports: {},
              createdAt: new Date(),
              updatedAt: new Date()
            };

            return {
              pipelines: {
                ...state.pipelines,
                [assetId]: {
                  ...existing,
                  ingestion,
                  updatedAt: new Date()
                }
              }
            };
          });
        },

        setAtsResult: (assetId: string, atsResult: AtsResult) => {
          set((state) => {
            const existing = state.pipelines[assetId] || {
              assetId,
              exports: {},
              createdAt: new Date(),
              updatedAt: new Date()
            };

            return {
              pipelines: {
                ...state.pipelines,
                [assetId]: {
                  ...existing,
                  atsResult,
                  updatedAt: new Date()
                }
              }
            };
          });
        },

        setExportUrl: (assetId: string, format: 'resume' | 'cover-letter', url: string) => {
          set((state) => {
            const existing = state.pipelines[assetId] || {
              assetId,
              exports: {},
              createdAt: new Date(),
              updatedAt: new Date()
            };

            return {
              pipelines: {
                ...state.pipelines,
                [assetId]: {
                  ...existing,
                  exports: {
                    ...existing.exports,
                    [format]: url
                  },
                  updatedAt: new Date()
                }
              }
            };
          });
        },

        getPipeline: (assetId: string) => {
          return get().pipelines[assetId];
        },

        clearPipeline: (assetId: string) => {
          set((state) => {
            const { [assetId]: _, ...rest } = state.pipelines;
            return { pipelines: rest };
          });
        }
      }),
      {
        name: 'analysis-pipeline-store',
        version: 1
      }
    ),
    { name: 'AnalysisPipelineStore' }
  )
);
