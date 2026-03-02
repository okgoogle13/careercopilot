import { Pebble, Signal, Stone, Vessel } from '@/components/ui';
import { m3Toast } from '@/utils/toast';
import {
  AlertTriangle,
  BrainCircuit,
  Briefcase,
  Download,
  Redo2,
  ShieldCheck,
  Sparkles,
  Trophy,
  Undo2,
  User,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { EditableField } from '../../../components/shared/EditableField';
import { StatusChip } from '../../../components/shared/StatusChip';
import { CareerDatabase, KSCResponse, StructuredAchievement } from '../../../types/api';

interface ValidationDashboardProps {
  data: CareerDatabase;
  onUpdate: (updatedData: CareerDatabase) => void;
}

export const ValidationDashboard: React.FC<ValidationDashboardProps> = ({ data, onUpdate }) => {
  const [localData, setLocalData] = useState<CareerDatabase>(data);
  const [history, setHistory] = useState<CareerDatabase[]>([data]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const flaggedAchievements = localData.Structured_Achievements.filter(
    (a: StructuredAchievement) => a.Needs_Review_Flag
  );
  const flaggedKSCs = localData.KSC_Responses.filter((k: KSCResponse) => k.Needs_Review_Flag);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey && e.shiftKey && e.key === 'Z') || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault();
        handleRedo();
      }
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleDownloadJSON();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [localData, historyIndex, history]);

  const addToHistory = useCallback(
    (newData: CareerDatabase) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newData);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setLocalData(history[newIndex]);
      onUpdate(history[newIndex]);
      m3Toast.success('Undo Applied', 'Previous state restored.');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setLocalData(history[newIndex]);
      onUpdate(history[newIndex]);
      m3Toast.success('Redo Applied', 'Next state restored.');
    }
  };

  const handleAchievementUpdate = (achievementId: string, field: string, value: string) => {
    const updated = {
      ...localData,
      Structured_Achievements: localData.Structured_Achievements.map(
        (ach: StructuredAchievement) =>
          ach.Achievement_ID === achievementId ? { ...ach, [field]: value } : ach
      ),
    };
    setLocalData(updated);
    onUpdate(updated);
    addToHistory(updated);
  };

  const handleKSCUpdate = (kscId: string, field: string, value: string) => {
    const updated = {
      ...localData,
      KSC_Responses: localData.KSC_Responses.map((ksc: KSCResponse) =>
        ksc.KSC_ID === kscId ? { ...ksc, [field]: value } : ksc
      ),
    };
    setLocalData(updated);
    onUpdate(updated);
    addToHistory(updated);
  };

  const handleApplyAllSuggestions = () => {
    let updated = { ...localData };
    let appliedCount = 0;

    updated.Structured_Achievements = updated.Structured_Achievements.map(
      (ach: StructuredAchievement) => {
        if (ach.Improvement_Suggestions) {
          appliedCount++;
          return {
            ...ach,
            Action_Verb: ach.Improvement_Suggestions.Action_Verb || ach.Action_Verb,
            Metric: ach.Improvement_Suggestions.Metric || ach.Metric,
            Outcome: ach.Improvement_Suggestions.Outcome || ach.Outcome,
            Needs_Review_Flag: false,
          };
        }
        return ach;
      }
    );

    updated.KSC_Responses = updated.KSC_Responses.map((ksc: KSCResponse) => {
      if (ksc.Improvement_Suggestions) {
        appliedCount++;
        return {
          ...ksc,
          Situation: ksc.Improvement_Suggestions.Situation || ksc.Situation,
          Task: ksc.Improvement_Suggestions.Task || ksc.Task,
          Action: ksc.Improvement_Suggestions.Action || ksc.Action,
          Result: ksc.Improvement_Suggestions.Result || ksc.Result,
          Needs_Review_Flag: false,
        };
      }
      return ksc;
    });

    setLocalData(updated);
    onUpdate(updated);
    addToHistory(updated);
    m3Toast.success('Refinement Complete', `Applied ${appliedCount} AI conceptual improvements.`);
  };

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(localData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `professional-vector-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    m3Toast.success('Export Secure', 'Your professional vector has been downloaded.');
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[var(--color-specimen-night)] p-8 md:p-12 animate-in fade-in duration-700">
=======
    <div className="min-h-screen bg-[var(--color-asphalt-black)] p-8 md:p-12 animate-in fade-in duration-700">
>>>>>>> restoration-KR-Rage-Figma-v2.0
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div>
<<<<<<< HEAD
            <h1 className="text-5xl font-bold text-[var(--color-parchment)] tracking-tight">
              Professional Vector <span className="text-[var(--color-wattle-gold)]">Audit</span>
            </h1>
            <p className="text-xl text-[var(--color-flannel-flower-dark)] mt-2">
=======
            <h1 className="text-5xl font-bold text-[var(--color-paper-white)] tracking-tight">
              Professional Vector <span className="text-[var(--color-ink-gold)]">Audit</span>
            </h1>
            <p className="text-xl text-[var(--color-concrete-grey-dark)] mt-2">
>>>>>>> restoration-KR-Rage-Figma-v2.0
              Refine and validate the tactical components of your professional DNA.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Pebble
              variant="secondary"
              iconLeft={<Undo2 className="w-4 h-4" />}
              onClick={handleUndo}
              disabled={historyIndex === 0}
            >
              Undo
            </Pebble>
            <Pebble
              variant="secondary"
              iconLeft={<Redo2 className="w-4 h-4" />}
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
            >
              Redo
            </Pebble>
            {(flaggedAchievements.length > 0 || flaggedKSCs.length > 0) && (
              <Pebble
                variant="secondary"
                iconLeft={<Sparkles className="w-4 h-4" />}
                onClick={handleApplyAllSuggestions}
              >
                Apply AI Suggestions
              </Pebble>
            )}
            <Pebble
              variant="primary"
              iconLeft={<Download className="w-4 h-4" />}
              onClick={handleDownloadJSON}
            >
              Export Vector
            </Pebble>
          </div>
        </header>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Stone
            elevation="raised"
<<<<<<< HEAD
            mode="laboratory"
            className="flex items-center gap-6 border-l-4 border-l-[var(--color-wattle-gold)]"
          >
            <Trophy className="w-10 h-10 text-[var(--color-wattle-gold)]" />
            <div>
              <span className="text-3xl font-bold text-[var(--color-parchment)] block">
                {localData.Structured_Achievements.length}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-flannel-flower-dark)]">
=======
           
            className="flex items-center gap-6 border-l-4 border-l-[var(--color-ink-gold)]"
          >
            <Trophy className="w-10 h-10 text-[var(--color-ink-gold)]" />
            <div>
              <span className="text-3xl font-bold text-[var(--color-paper-white)] block">
                {localData.Structured_Achievements.length}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-concrete-grey-dark)]">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                Tactical Achievements
              </span>
            </div>
          </Stone>

          <Stone
            elevation="raised"
<<<<<<< HEAD
            mode="laboratory"
            className="flex items-center gap-6 border-l-4 border-l-[var(--color-eucalypt-smoke-base)]"
          >
            <BrainCircuit className="w-10 h-10 text-[var(--color-eucalypt-smoke-base)]" />
            <div>
              <span className="text-3xl font-bold text-[var(--color-parchment)] block">
                {localData.KSC_Responses.length}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-flannel-flower-dark)]">
=======
           
            className="flex items-center gap-6 border-l-4 border-l-[var(--color-concrete-grey-base)]"
          >
            <BrainCircuit className="w-10 h-10 text-[var(--color-concrete-grey-base)]" />
            <div>
              <span className="text-3xl font-bold text-[var(--color-paper-white)] block">
                {localData.KSC_Responses.length}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-concrete-grey-dark)]">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                Core Competencies
              </span>
            </div>
          </Stone>

          <Stone
            elevation="raised"
<<<<<<< HEAD
            mode="laboratory"
            className={`flex items-center gap-6 border-l-4 ${flaggedAchievements.length + flaggedKSCs.length > 0 ? 'border-l-orange-500 bg-orange-500/5' : 'border-l-[var(--color-eucalypt-smoke-base)]'}`}
          >
            <AlertTriangle
              className={`w-10 h-10 ${flaggedAchievements.length + flaggedKSCs.length > 0 ? 'text-orange-500' : 'text-[var(--color-flannel-flower-dark)]/40'}`}
            />
            <div>
              <span className="text-3xl font-bold text-[var(--color-parchment)] block">
                {flaggedAchievements.length + flaggedKSCs.length}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-flannel-flower-dark)]">
=======
           
            className={`flex items-center gap-6 border-l-4 ${flaggedAchievements.length + flaggedKSCs.length > 0 ? 'border-l-orange-500 bg-orange-500/5' : 'border-l-[var(--color-concrete-grey-base)]'}`}
          >
            <AlertTriangle
              className={`w-10 h-10 ${flaggedAchievements.length + flaggedKSCs.length > 0 ? 'text-orange-500' : 'text-[var(--color-concrete-grey-dark)]/40'}`}
            />
            <div>
              <span className="text-3xl font-bold text-[var(--color-paper-white)] block">
                {flaggedAchievements.length + flaggedKSCs.length}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-concrete-grey-dark)]">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                Audit Flags
              </span>
            </div>
          </Stone>
        </div>

        {/* Conflict/Audit Alert */}
        {(flaggedAchievements.length > 0 || flaggedKSCs.length > 0) && (
          <Signal
            severity="warning"
            variant="tonal"
            className="mb-10"
          >
            <div className="flex flex-col gap-1">
              <span className="font-bold">
                Attention Required: {flaggedAchievements.length + flaggedKSCs.length} Tactical
                Weaknesses Identified.
              </span>
              <span className="text-sm opacity-80">
                AI auditing has identified entries with insufficient metrics or vague situational
                context. Refinement is recommended before production use.
              </span>
            </div>
          </Signal>
        )}

        {/* Detailed Sections */}
        <div className="space-y-6">
          {/* Personal Context */}
          <Vessel
            title="Personal Context"
            icon={<User className="w-5 h-5" />}
            defaultExpanded
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <EditableField
                label="Full Legal Name"
                value={localData.Personal_Information.FullName}
                onSave={(val: string) => {
                  const updated = {
                    ...localData,
                    Personal_Information: { ...localData.Personal_Information, FullName: val },
                  };
                  setLocalData(updated);
                  onUpdate(updated);
                }}
              />
              <EditableField
                label="Strategic Communication Channel (Email)"
                value={localData.Personal_Information.Email}
                onSave={(val: string) => {
                  const updated = {
                    ...localData,
                    Personal_Information: { ...localData.Personal_Information, Email: val },
                  };
                  setLocalData(updated);
                  onUpdate(updated);
                }}
              />
            </div>
          </Vessel>

          {/* Achievements */}
          <Vessel
            title={`Structured Achievements (${localData.Structured_Achievements.length})`}
            icon={<Trophy className="w-5 h-5" />}
            defaultExpanded
          >
            <div className="space-y-8 mt-6">
              {localData.Structured_Achievements.map(
                (achievement: StructuredAchievement, idx: number) => (
                  <div
                    key={achievement.Achievement_ID}
                    className="relative pl-6 border-l border-white/10 pb-8 last:pb-0"
                  >
<<<<<<< HEAD
                    <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-[var(--color-wattle-gold)] shadow-[0_0_8px_var(--color-wattle-gold)]" />

                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] text-[var(--color-flannel-flower-dark)] uppercase tracking-widest">
=======
                    <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-[var(--color-ink-gold)] shadow-[0_0_8px_var(--color-ink-gold)]" />

                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] text-[var(--color-concrete-grey-dark)] uppercase tracking-widest">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                        Evidence Node {idx + 1}
                      </span>
                      <StatusChip needsReview={achievement.Needs_Review_Flag} />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <EditableField
                        label="Harvested Raw Evidence"
                        value={achievement.Original_Text}
                        multiline
                        onSave={(val: string) =>
                          handleAchievementUpdate(achievement.Achievement_ID, 'Original_Text', val)
                        }
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <EditableField
                          label="Precision Action Verb"
                          value={achievement.Action_Verb}
                          suggestion={achievement.Improvement_Suggestions?.Action_Verb}
                          onSave={(val: string) =>
                            handleAchievementUpdate(achievement.Achievement_ID, 'Action_Verb', val)
                          }
                        />
                        <EditableField
                          label="Quantifiable Metric"
                          value={achievement.Metric}
                          suggestion={achievement.Improvement_Suggestions?.Metric}
                          onSave={(val: string) =>
                            handleAchievementUpdate(achievement.Achievement_ID, 'Metric', val)
                          }
                        />
                      </div>

                      <EditableField
                        label="Strategic Outcome"
                        value={achievement.Outcome}
                        suggestion={achievement.Improvement_Suggestions?.Outcome}
                        multiline
                        onSave={(val: string) =>
                          handleAchievementUpdate(achievement.Achievement_ID, 'Outcome', val)
                        }
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </Vessel>

          {/* Competency Modules (KSC) */}
          {localData.KSC_Responses.length > 0 && (
            <Vessel
              title={`Competency Modules (${localData.KSC_Responses.length})`}
              icon={<Briefcase className="w-5 h-5" />}
            >
              <div className="space-y-12 mt-8">
                {localData.KSC_Responses.map((ksc: KSCResponse, idx: number) => (
                  <div
                    key={ksc.KSC_ID}
                    className="bg-white/5 rounded-[var(--radius-pebble)] p-8 border border-white/5"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex-1 mr-4">
<<<<<<< HEAD
                        <span className="text-[10px] text-[var(--color-wattle-gold)] uppercase tracking-widest block mb-2">
                          Module {idx + 1} Prompt
                        </span>
                        <h4 className="text-lg text-[var(--color-parchment)] italic">
=======
                        <span className="text-[10px] text-[var(--color-ink-gold)] uppercase tracking-widest block mb-2">
                          Module {idx + 1} Prompt
                        </span>
                        <h4 className="text-lg text-[var(--color-paper-white)] italic">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                          "{ksc.KSC_Prompt}"
                        </h4>
                      </div>
                      <StatusChip needsReview={ksc.Needs_Review_Flag} />
                    </div>

                    {ksc.Needs_Review_Flag && ksc.STAR_Feedback && (
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-stone p-4 mb-8 flex gap-4">
                        <BrainCircuit className="w-5 h-5 text-orange-500 shrink-0" />
<<<<<<< HEAD
                        <div className="text-xs text-[var(--color-parchment)]/80 leading-relaxed">
=======
                        <div className="text-xs text-[var(--color-paper-white)]/80 leading-relaxed">
>>>>>>> restoration-KR-Rage-Figma-v2.0
                          <span className="font-bold text-orange-500 uppercase tracking-tighter block mb-1">
                            AI Tactical Feedback
                          </span>
                          {ksc.STAR_Feedback}
                        </div>
                      </div>
                    )}

                    <div className="space-y-6">
                      <EditableField
                        label="Situational Architecture (S/T)"
                        value={ksc.Situation}
                        suggestion={ksc.Improvement_Suggestions.Situation}
                        multiline
                        onSave={(val: string) => handleKSCUpdate(ksc.KSC_ID, 'Situation', val)}
                      />

                      <EditableField
                        label="Tactical Result (R)"
                        value={ksc.Result}
                        suggestion={ksc.Improvement_Suggestions.Result}
                        multiline
                        onSave={(val: string) => handleKSCUpdate(ksc.KSC_ID, 'Result', val)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Vessel>
          )}
        </div>

        {/* Footer Validation */}
        <footer className="mt-20 pt-10 border-t border-white/5 flex justify-center pb-20">
<<<<<<< HEAD
          <div className="flex items-center gap-3 px-6 py-3 bg-[var(--color-eucalypt-smoke-base)]/10 text-[var(--color-eucalypt-smoke-base)] rounded-full text-xs uppercase tracking-[0.2em] border border-[var(--color-eucalypt-smoke-base)]/20 shadow-lg">
=======
          <div className="flex items-center gap-3 px-6 py-3 bg-[var(--color-concrete-grey-base)]/10 text-[var(--color-concrete-grey-base)] rounded-full text-xs uppercase tracking-[0.2em] border border-[var(--color-concrete-grey-base)]/20 shadow-lg">
>>>>>>> restoration-KR-Rage-Figma-v2.0
            <ShieldCheck className="w-4 h-4" />
            Professional Vector Validated and Production Ready
          </div>
        </footer>
      </div>
    </div>
  );
};
