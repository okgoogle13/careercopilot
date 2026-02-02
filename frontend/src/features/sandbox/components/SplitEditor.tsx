import { useState } from 'react';
import { SplitSquareHorizontal, Save, Sparkles, Wand2, ShieldCheck } from 'lucide-react';
import { NorthcoteButton } from '@/components/ui/NorthcoteButton';
import { scaffoldKSCResponse, STARInput } from '../logic';
import { toast } from 'sonner';
import { useAnalysis, type AnalysisResult } from '@/hooks/useAnalysis';

import { Archetype } from '../EcosystemSandbox';

interface SplitEditorProps {
    activeTab: 'ksc' | 'resume';
    onTabChange: (tab: 'ksc' | 'resume') => void;
    archetype: Archetype;
}

export function SplitEditor({ activeTab, onTabChange, archetype }: SplitEditorProps) {
    const [criteria, setCriteria] = useState(''); // Context logic (Left Pane)
    const [content, setContent] = useState(''); // Drafting logic (Right Pane)
    const [isDropping, setIsDropping] = useState(false);

    // Feature 3.2 Integration
    const { analyzeDocument, analyzing } = useAnalysis();

    const handleAnalyze = async () => {
        if (!content.trim()) {
            toast.error("Draft is empty! Write something or drag evidence first.");
            return;
        }

        // Trigger Feature 3.2 Scoring
        toast.promise(analyzeDocument(content, criteria, true), {
            loading: `Running ${archetype === 'gov' ? 'APS Capability' : 'Corporate Value'} Audit...`,
            success: (data: AnalysisResult) => `Audit Complete: Score ${data.score.overall}%`,
            error: 'Audit failed. Try again.'
        });
    };

    // Handle Drop from Evidence Sidebar
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDropping(false);
        const data = e.dataTransfer.getData('application/json');

        if (data) {
            try {
                const star: STARInput = JSON.parse(data);

                // Logic: Insert the STAR content into the draft
                // If we have criteria set, we can auto-scaffold
                if (criteria.trim().length > 10) {
                    const scaffolded = scaffoldKSCResponse(criteria, star);
                    setContent(scaffolded);
                    toast.success('Generated draft from STAR Evidence!');
                } else {
                    // Just insert raw STAR
                    const rawInsert = `### Situation\n${star.situation}\n\n### Task\n${star.task}\n\n### Action\n${star.action}\n\n### Result\n${star.result}`;
                    setContent(prev => prev + '\n\n' + rawInsert);
                    toast.info('Inserted raw STAR evidence. Set criteria to auto-scaffold.');
                }
            } catch (err) {
                console.error('Failed to parse dropped STAR data', err);
            }
        }
    };

    return (
        <div className="h-full flex flex-col relative">
            {/* Toolbar */}
            <div className="h-14 flex items-center justify-between px-4 border-b border-outline-variant bg-surface-container-high/30 flex-none">
                <div className="flex gap-1 bg-surface-container-high p-1 rounded-lg">
                    <button
                        onClick={() => onTabChange('ksc')}
                        className={`px-4 py-1.5 rounded-md text-label-small font-bold transition-all ${activeTab === 'ksc'
                            ? 'bg-surface shadow-sm text-on-surface'
                            : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                    >
                        {archetype === 'gov' ? 'KSC Response' : 'Cover Letter'}
                    </button>
                    <button
                        onClick={() => onTabChange('resume')}
                        className={`px-4 py-1.5 rounded-md text-label-small font-bold transition-all ${activeTab === 'resume'
                            ? 'bg-surface shadow-sm text-on-surface'
                            : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                    >
                        Resume Tailor
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <NorthcoteButton variant="secondary" className="h-8 w-8 p-0 rounded-full" title="Split View (Coming Soon)">
                        <SplitSquareHorizontal className="w-4 h-4 text-on-surface-variant" />
                    </NorthcoteButton>
                    <NorthcoteButton
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        className="h-8 px-4 text-label-small bg-tertiary-container text-on-tertiary-container hover:bg-tertiary hover:text-on-tertiary transition-colors"
                    >
                        <ShieldCheck className="w-3 h-3 mr-2" />
                        {analyzing ? 'Auditing...' : 'Analyze'}
                    </NorthcoteButton>
                    <NorthcoteButton className="h-8 px-4 text-label-small bg-primary text-on-primary">
                        <Save className="w-3 h-3 mr-2" />
                        Save Draft
                    </NorthcoteButton>
                </div>
            </div>

            {/* Split Pane Area */}
            <div className="flex-1 flex min-h-0">
                {/* Left Pane: Context / Input */}
                <div className="w-1/3 border-r border-outline-variant p-4 flex flex-col bg-surface-container-low/50">
                    <label className="text-label-small font-bold text-on-surface-variant mb-2">
                        TARGET CRITERIA / INSTRUCTIONS
                    </label>
                    <textarea
                        value={criteria}
                        onChange={(e) => setCriteria(e.target.value)}
                        placeholder="Paste the Key Selection Criteria here..."
                        className="flex-1 bg-surface-container-high p-3 rounded-md resize-none text-body-small outline-none focus:ring-1 ring-primary/50"
                    />

                    <div className="mt-4 p-3 bg-secondary-container/20 rounded-md border border-secondary-container">
                        <h4 className="text-label-medium font-bold text-secondary flex items-center gap-2">
                            <Wand2 className="w-3 h-3" />
                            Tip
                        </h4>
                        <p className="text-body-small text-on-surface-variant mt-1">
                            Drag a STAR card from the left sidebar to instantly generate a draft response for this criteria.
                        </p>
                    </div>
                </div>

                {/* Right Pane: Drafting Area */}
                <div
                    className={`flex-1 p-6 relative transition-colors ${isDropping ? 'bg-primary-container/10' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDropping(true); }}
                    onDragLeave={() => setIsDropping(false)}
                    onDrop={handleDrop}
                >
                    {isDropping && (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/10 z-10 backdrop-blur-[1px] border-2 border-dashed border-primary rounded-xl m-4 animate-pulse">
                            <div className="text-primary font-bold flex flex-col items-center">
                                <Sparkles className="w-8 h-8 mb-2" />
                                Drop Evidence to Scaffold
                            </div>
                        </div>
                    )}

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Drafting canvas..."
                        className="w-full h-full bg-transparent resize-none outline-none text-body-large text-on-surface placeholder:text-on-surface-variant/40 leading-relaxed font-mono"
                        spellCheck={false}
                    />
                </div>
            </div>
        </div>
    );
}
