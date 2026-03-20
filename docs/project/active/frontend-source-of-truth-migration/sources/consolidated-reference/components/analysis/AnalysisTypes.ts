import { LucideIcon } from 'lucide-react';

export interface MetricData {
  label: string;
  value: string;
  change: string;
  up: boolean;
  valueColor: string;
  borderColor: string;
  icon: LucideIcon;
}

export interface KeywordMatchEntry {
  keyword: string;
  rate: number;
}

export interface TrendDataPoint {
  date: string;
  score: number;
}

export interface PipelineDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface AnalysisState {
  metrics: MetricData[];
  trendData: TrendDataPoint[];
  pipelineData: PipelineDataPoint[];
  keywordMatch: KeywordMatchEntry[];
  matchedSkills: string[];
  skillGaps: string[];
}
