import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Violation {
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  location?: string;
}

interface ResumeRulesState {
  strictnessMode: 'strict' | 'moderate' | 'light';
  violations: Violation[];
  overallScore: number | null;
  scanSimulation: string | null;
  
  setStrictness: (mode: 'strict' | 'moderate' | 'light') => void;
  setAuditResult: (result: { violations: Violation[]; overallScore: number; scanSimulation: string }) => void;
  clearViolations: () => void;
}

export const useResumeRulesStore = create<ResumeRulesState>()(
  persist(
    (set) => ({
      strictnessMode: 'moderate',
      violations: [],
      overallScore: null,
      scanSimulation: null,

      setStrictness: (mode) => set({ strictnessMode: mode }),
      
      setAuditResult: (result) => set({
        violations: result.violations,
        overallScore: result.overallScore,
        scanSimulation: result.scanSimulation
      }),

      clearViolations: () => set({ 
        violations: [], 
        overallScore: null,
        scanSimulation: null 
      })
    }),
    { name: 'resume-rules-store' }
  )
);
