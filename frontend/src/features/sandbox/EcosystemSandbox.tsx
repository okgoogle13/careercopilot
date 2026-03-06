import { useState } from 'react';
import { AuroraHeader } from '@/components/ui/AuroraHeader';
import { EvidenceSidebar } from './components/EvidenceSidebar';
import { SplitEditor } from './components/SplitEditor';
import { Building2, Landmark } from 'lucide-react';

export type Archetype = 'gov' | 'corp';

export function EcosystemSandbox() {
  const [activeTab, setActiveTab] = useState<'ksc' | 'resume'>('ksc');
  const [archetype, setArchetype] = useState<Archetype>('gov');

  return (
    <div className="relative min-h-screen bg-surface-KrDark-slate-smoke-high overflow-hidden">
      <div className="p-4 md:p-8 h-[calc(100vh)] flex flex-col animate-in fade-in zoom-in-95 duration-500">
        <div className="flex-none mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <AuroraHeader
            title="Ecosystem Sandbox"
            tag="KrDark"
            wittySubtitle="Where evidence meets execution"
          />

          {/* DOC-007 Archetype Selector */}
          <div className="bg-surface-container-high/50 p-1 rounded-full flex gap-1 border border-white/10 shadow-sm backdrop-blur-md">
            <button
              onClick={() => setArchetype('gov')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-label-small font-bold transition-all ${
                archetype === 'gov'
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <Landmark className="w-4 h-4" />
              Gov / NFP
            </button>
            <button
              onClick={() => setArchetype('corp')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-label-small font-bold transition-all ${
                archetype === 'corp'
                  ? 'bg-secondary text-on-secondary shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Corporate
            </button>
          </div>
        </div>

        <div className="flex-1 flex gap-4 overflow-hidden min-h-0 bg-surface-scrim/30 backdrop-blur-xl rounded-2xl border border-white/10 p-1.5 shadow-2xl">
          {/* Left: Evidence & Intelligence */}
          <div className="w-[320px] flex-none hidden lg:flex h-full overflow-hidden flex-col">
            <EvidenceSidebar />
          </div>

          {/* Right: The Editor */}
          <div className="flex-1 h-full overflow-hidden bg-surface-container/90 rounded-xl border border-outline-variant flex flex-col shadow-inner backdrop-blur-sm">
            <SplitEditor
              activeTab={activeTab}
              onTabChange={setActiveTab}
              archetype={archetype}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
