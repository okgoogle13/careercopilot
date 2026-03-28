/* eslint-disable */
// Salvaged from: prototype_v2.0/src/hooks/useAiOutputs.ts
// Strategy: S1 — Behavior Seam Extraction (transcribe logic only)
// Destination: /analysis route
// Data seam: criteria and output data must be supplied by the consumer via props.
//   The prototype embedded hardcoded mock criteria here — that coupling is removed.
import { useState } from 'react';

export type AiOutputTab = 'resume' | 'cover' | 'ksc';

export interface AiCriterion {
  id: number;
  title: string;
  required: boolean;
}

export function useAiOutputs() {
  const [activeTab, setActiveTab] = useState<AiOutputTab>('ksc');
  const [ignoredCriteria, setIgnoredCriteria] = useState<number[]>([]);

  const toggleCriteria = (id: number) => {
    setIgnoredCriteria((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return {
    activeTab,
    setActiveTab,
    ignoredCriteria,
    toggleCriteria,
    handleCopy,
  };
}
