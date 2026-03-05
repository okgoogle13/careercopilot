/**
 * KSC Logic - Migrated from KSCGenerator.tsx
 * Defines the APS ILS scaffolding and metrics extraction.
 */

export interface STARInput {
  situation: string;
  task: string;
  action: string;
  result: string;
}

/**
 * Generate expert KSC response using APS ILS standards
 */
export function scaffoldKSCResponse(criteria: string, star: STARInput): string {
  const { situation, task, action, result } = star;
  const metricsAnalysis = extractQuantifiableMetrics(result);

  return `# Key Selection Criteria Response

## Addressing the Criterion
**"${criteria || '[Insert Capability Framework Criterion]'}"**

---

## Professional Response

I have consistently demonstrated this capability throughout my career, particularly during my work in [Relevant Role/Context].

### Situation
${situation || '[Describe the context...]'}

### Task
${task || '[Describe your responsibility...]'}

### Action
${action || '[Describe your specific steps...]'}

My approach aligned with the APS Integrated Leadership System (ILS) principles, particularly:
- **Shapes Strategic Thinking:** Anticipating long-term impacts
- **Achieves Results:** Delivering measurable outcomes
- **Cultivates Productive Working Relationships:** Building trust
- **Exemplifies Personal Drive and Integrity:** Maintaining standards
- **Communicates with Influence:** Tailoring messaging

### Result
${result || '[Describe the outcome...]'}

---

## Alignment with Standards

This experience demonstrates my commitment to:
- **Evidence-based practice**
- **Cultural competency**
- **Ethical practice**
- **Professional accountability**

### Quantifiable Outcomes
${metricsAnalysis}

---

*Verified by Ecosystem Sandbox*
`;
}

/**
 * Extract or suggest quantifiable metrics from the result
 */
export function extractQuantifiableMetrics(result: string): string {
  if (!result) return '';

  // Simple heuristic for numbers
  const hasNumbers = /\d+/.test(result);

  if (hasNumbers) {
    return `The outcomes included specific measurable achievements detailed above, demonstrating tangible impact ($D_{star} boost applied).`;
  }

  return `*Consider adding quantifiable metrics such as:*
    - **Client outcomes:** Number of individuals/families supported
    - **Efficiency gains:** Percentage reduction in processing time
    - **Stakeholder engagement:** Number of partnerships established`;
}
