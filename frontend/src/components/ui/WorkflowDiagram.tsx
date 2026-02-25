/**
 * WorkflowDiagram.tsx
 *
 * Renders Mermaid flowchart diagrams for the CareerCopilot user workflow.
 * Uses the Mermaid CDN (loaded once via a <script> tag) and renders diagrams
 * into a div element using mermaid.run().
 *
 * Diagram content mirrors scripts/generate_workflow_diagram.py so both the
 * Python CLI and this component always stay in sync.
 */

import React, { useEffect, useId, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Mermaid diagram definitions (must mirror generate_workflow_diagram.py)
// ---------------------------------------------------------------------------

export const USER_JOURNEY_DIAGRAM = `flowchart TD
    A([👤 User Visits CareerCopilot]) --> B{Authenticated?}

    B -- No --> C[/Login · Sign Up/]
    C --> D[(Supabase Auth)]
    D --> E([✅ Session Established])
    B -- Yes --> E

    E --> F[🏠 Dashboard]

    F --> G[📄 Upload Resume / Paste Text]
    F --> H[🔍 Paste Job URL · Description]

    G --> I[(Ingestion Service\\npdfminer · python-docx)]
    H --> J[🤖 Job Analyzer Flow\\nScrape + Extract Requirements]

    I --> K[(Vector Store\\npgvector + Gemini Embeddings)]
    J --> L[📊 ATS Scoring Flow\\nKeyword Gap Analysis]

    K --> L
    L --> M{Choose Next Action}

    M --> N[✍️ Optimise Resume\\nresume_optimizer flow]
    M --> O[📝 Generate Cover Letter\\nsmart_cover_letter flow]
    M --> P[🎯 Generate KSC Responses\\nksc_generator flow]
    M --> Q[🏢 Research Company\\ncompany_context flow]

    N --> R{Accept Suggestions?}
    R -- Yes --> S[(Save to Supabase\\nDocument Store)]
    R -- No --> N

    O --> S
    P --> S
    Q --> S

    S --> T[📥 Export: PDF · DOCX · Markdown]
    T --> U[📬 Submit Application]
    U --> V[📋 Application Tracker\\nKanban Board]
    V --> W([🎉 Hired!])

    style A fill:#D4A84B,color:#1A1714,stroke:#D4A84B
    style W fill:#6B7F6E,color:#F5F0E8,stroke:#6B7F6E
    style D fill:#1A1714,color:#D4A84B,stroke:#A39B8F
    style K fill:#1A1714,color:#D4A84B,stroke:#A39B8F
    style S fill:#1A1714,color:#D4A84B,stroke:#A39B8F`;

export const AI_FLOW_DIAGRAM = `flowchart LR
    subgraph Input["📥 User Input"]
        R[Resume / Profile]
        J[Job Description / URL]
    end

    subgraph Ingestion["🔄 Ingestion Layer"]
        P[IngestionService\\npdfminer · python-docx]
        JA[Job Analyzer\\nScrape + NLP]
    end

    subgraph AI["🤖 AI Flows · Gemini via Genkit"]
        ATS[ATS Scoring\\nats_scoring.py]
        RO[Resume Optimizer\\nresume_optimizer.py]
        CL[Cover Letter Generator\\ncover_letter_generator.py]
        KSC[KSC Generator\\nksc_generator.py]
        CC[Company Context\\ncompany_context.py]
        JM[Job Matcher\\nadvanced_job_matching.py]
    end

    subgraph Store["🗄️ Data Layer"]
        VS[(Vector Store\\npgvector)]
        DB[(Postgres\\nSupabase)]
    end

    subgraph Output["📤 Output"]
        OD[Optimised Resume]
        OCL[Cover Letter]
        OKSC[KSC Responses]
        OA[Application Package]
    end

    R --> P --> VS
    J --> JA --> ATS
    VS --> ATS
    ATS --> RO & CL & KSC & CC & JM
    RO --> OD --> DB
    CL --> OCL --> DB
    KSC --> OKSC --> DB
    OD & OCL & OKSC --> OA

    style AI fill:#1A1714,color:#F5F0E8,stroke:#D4A84B
    style Store fill:#1A1714,color:#F5F0E8,stroke:#A39B8F
    style Input fill:#2A1F0B,color:#F5F0E8,stroke:#D4A84B
    style Output fill:#0B2A1A,color:#F5F0E8,stroke:#6B7F6E`;

// ---------------------------------------------------------------------------
// Mermaid loader (injects <script> once per page load)
// ---------------------------------------------------------------------------

let mermaidLoaded = false;
let mermaidLoadPromise: Promise<void> | null = null;

function loadMermaid(): Promise<void> {
  if (mermaidLoaded) return Promise.resolve();
  if (mermaidLoadPromise) return mermaidLoadPromise;

  mermaidLoadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
    script.async = true;
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).mermaid?.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          background: '#1A1714',
          primaryColor: '#D4A84B',
          primaryTextColor: '#F5F0E8',
          primaryBorderColor: '#A39B8F',
          lineColor: '#A39B8F',
          secondaryColor: '#2A1F0B',
          tertiaryColor: '#1A1714',
          fontFamily: 'Work Sans, sans-serif',
        },
      });
      mermaidLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Mermaid'));
    document.head.appendChild(script);
  });

  return mermaidLoadPromise;
}

// ---------------------------------------------------------------------------
// MermaidDiagram – renders a single diagram
// ---------------------------------------------------------------------------

interface MermaidDiagramProps {
  /** Raw Mermaid diagram source */
  diagram: string;
  className?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ diagram, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    loadMermaid()
      .then(async () => {
        if (cancelled || !containerRef.current) return;
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mermaid = (window as any).mermaid;
          const { svg } = await mermaid.render(`mermaid-${uid}`, diagram);
          if (!cancelled && containerRef.current) {
            containerRef.current.innerHTML = svg;
            setLoading(false);
          }
        } catch (err) {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : String(err));
            setLoading(false);
          }
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [diagram, uid]);

  if (error) {
    return (
      <div
        className={`rounded-lg border border-[var(--sys-color-waratahRed)] bg-[var(--sys-color-asphaltBlack)] p-4 text-[var(--sys-color-waratahRed)] text-sm font-mono ${className}`}
      >
        <strong>Diagram render error:</strong> {error}
        <pre className="mt-2 whitespace-pre-wrap text-xs opacity-70">{diagram}</pre>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="flex items-center justify-center py-12 text-[var(--sys-color-concreteGrey)]">
          <span className="animate-pulse text-sm">Rendering diagram…</span>
        </div>
      )}
      <div
        ref={containerRef}
        className="overflow-x-auto"
        style={{ display: loading ? 'none' : 'block' }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// WorkflowDiagram – public component with tab switcher
// ---------------------------------------------------------------------------

export type DiagramTab = 'journey' | 'ai-flow';

export interface WorkflowDiagramProps {
  /** Initially selected tab */
  defaultTab?: DiagramTab;
  className?: string;
}

export const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({
  defaultTab = 'journey',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<DiagramTab>(defaultTab);

  const tabs: { id: DiagramTab; label: string; diagram: string }[] = [
    { id: 'journey', label: '👤 User Journey', diagram: USER_JOURNEY_DIAGRAM },
    { id: 'ai-flow', label: '🤖 AI Flow Architecture', diagram: AI_FLOW_DIAGRAM },
  ];

  return (
    <div
      className={`rounded-2xl border border-[var(--sys-color-concreteGrey)]/20 bg-[var(--sys-color-asphaltBlack)] overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--sys-color-concreteGrey)]/20">
        <h2 className="text-xl font-bold text-[var(--sys-color-paperWhite)]">
          CareerCopilot – Workflow Diagrams
        </h2>
        <p className="text-sm text-[var(--sys-color-concreteGrey)] mt-1">
          End-to-end user journey and AI flow architecture
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-[var(--sys-color-concreteGrey)]/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              'px-6 py-3 text-sm font-medium transition-colors focus:outline-none',
              activeTab === tab.id
                ? 'text-[var(--sys-color-kr-ink-gold)] border-b-2 border-[var(--sys-color-kr-ink-gold)]'
                : 'text-[var(--sys-color-concreteGrey)] hover:text-[var(--sys-color-paperWhite)]',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Diagram panel */}
      <div className="p-6">
        {tabs.map((tab) => (
          <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
            <MermaidDiagram diagram={tab.diagram} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowDiagram;
