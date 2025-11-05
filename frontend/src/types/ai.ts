export interface AIResponse {
  success: boolean;
  content: string;
  confidence_score: number;
  suggestions: string[];
  metadata: Record<string, any>;
  error?: string | null;
}
