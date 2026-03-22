import { m3Toast } from '../../../utils/toast';
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Download,
  Redo2,
  ShieldCheck,
  Trophy,
  Undo2,
  User,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { EditableField } from '../../../components/shared/EditableField';
import { CareerDatabase, StructuredAchievement } from '../../../types/api';

import { ValidationStats } from './ValidationStats';
import { AuditLogList } from './AuditLogList';
import { SourceVerificationGrid } from './SourceVerificationGrid';
import { Placard } from '../../../components/ui/Placard';
import { Vessel } from '../../../components/ui/Vessel';
import { Strike } from '../../../components/ui/Strike';
import { cn } from '../../../lib/utils'; // Added cn

interface ValidationDashboardProps {
  data: CareerDatabase;
  onUpdate: (updatedData: CareerDatabase) => void;
}

export const ValidationDashboard: React.FC<ValidationDashboardProps> = ({ data, onUpdate }) => {
  const [localData, setLocalData] = useState<CareerDatabase>(data);
  const [history, setHistory] = useState<CareerDatabase[]>([data]);
  const [historyIndex, setHistoryIndex] = useState(0);

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

  const handleUpdate = (newData: CareerDatabase) => {
    setLocalData(newData);
    onUpdate(newData);
    addToHistory(newData);
  };

  const handleDownloadJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'validated_career_data.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    m3Toast.success('Export Initiated', 'Career data exported as JSON.');
  };

  return (
    <Vessel
      className="max-w-7xl mx-auto py-12 px-6 space-y-12 pb-32"
      title="AI STUDIO HARVEST"
      icon={<BrainCircuit className="w-6 h-6 text-ink-gold" />}
      defaultExpanded
    >
      <div className="space-y-12">
        {/* Actions Bar - Moved inside children since Vessel action prop is missing */}
        <div className="flex justify-end gap-3 border-b border-concrete-grey/10 pb-6 mb-6">
          <Strike
            variant="ghost"
            onClick={handleUndo}
            disabled={historyIndex === 0}
          >
            <div className="flex items-center gap-2">
              <Undo2 className="w-4 h-4" />
              <span>UNDO</span>
            </div>
          </Strike>
          <Strike
            variant="ghost"
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1}
          >
            <div className="flex items-center gap-2">
              <Redo2 className="w-4 h-4" />
              <span>REDO</span>
            </div>
          </Strike>
          <Strike
            variant="primary"
            onClick={handleDownloadJSON}
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>EXPORT CANON</span>
            </div>
          </Strike>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-12 space-y-12">
            {/* Stats Summary */}
            <ValidationStats
              passCount={
                localData.Structured_Achievements.filter((a) => !a.Needs_Review_Flag).length
              }
              reviewCount={
                localData.Structured_Achievements.filter((a) => a.Needs_Review_Flag).length
              }
              avgConfidence={0.92}
            />

            {/* Personal Information */}
            <Vessel
              title="VALIDATION DETAILS"
              icon={<ShieldCheck className="w-5 h-5 text-ink-gold" />}
              className="flex-1 flex flex-col overflow-hidden border-[var(--sys-color-concreteGrey-base)]/10"
            >
              <div className="flex-1 overflow-y-auto space-y-8 p-8">
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-[var(--sys-color-kr-activistSmokeGreen-base)] mb-2">
                    <Trophy className="w-5 h-5" />
                    <h3 className="font-bold tracking-tight">ACHIEVEMENTS</h3>
                  </div>

                  <div className="grid gap-6">
                    {localData.Structured_Achievements.map((achievement) => (
                      <Placard
                        key={achievement.Achievement_ID}
                        elevation="floating"
                        className="border-[var(--sys-color-concreteGrey-base)]/10"
                        header={
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-4 h-4 text-[var(--sys-color-kr-activistSmokeGreen-base)]" />
                              <span className="font-mono text-[10px] text-[var(--sys-color-inkGold-base)] tracking-widest">
                                ID: {achievement.Achievement_ID}
                              </span>
                            </div>
                            {achievement.Needs_Review_Flag && (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[var(--sys-color-stencilYellow-base)]/10 border border-[var(--sys-color-stencilYellow-base)]/20 rounded text-[9px] font-bold text-[var(--sys-color-stencilYellow-base)] tracking-wider">
                                <AlertTriangle className="w-3 h-3" />
                                NEEDS REVIEW
                              </div>
                            )}
                          </div>
                        }
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <EditableField
                            label="Outcome"
                            value={achievement.Outcome || ''}
                            onSave={(val: string) => {
                              const newData = { ...localData };
                              const achievementIndex = newData.Structured_Achievements.findIndex(
                                (a) => a.Achievement_ID === achievement.Achievement_ID
                              );
                              if (achievementIndex !== -1) {
                                newData.Structured_Achievements[achievementIndex].Outcome = val;
                                handleUpdate(newData);
                              }
                            }}
                          />
                          <EditableField
                            label="Original Text"
                            value={achievement.Original_Text || ''}
                            onSave={(val: string) => {
                              const newData = { ...localData };
                              const achievementIndex = newData.Structured_Achievements.findIndex(
                                (a) => a.Achievement_ID === achievement.Achievement_ID
                              );
                              if (achievementIndex !== -1) {
                                newData.Structured_Achievements[achievementIndex].Original_Text =
                                  val;
                                handleUpdate(newData);
                              }
                            }}
                          />
                          <EditableField
                            label="Needs Review Flag"
                            value={achievement.Needs_Review_Flag ? 'true' : 'false'}
                            onSave={(val: string) => {
                              const newData = { ...localData };
                              const achievementIndex = newData.Structured_Achievements.findIndex(
                                (a) => a.Achievement_ID === achievement.Achievement_ID
                              );
                              if (achievementIndex !== -1) {
                                newData.Structured_Achievements[
                                  achievementIndex
                                ].Needs_Review_Flag = val === 'true';
                                handleUpdate(newData);
                              }
                            }}
                          />
                        </div>
                      </Placard>
                    ))}
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-[var(--sys-color-kr-activistSmokeGreen-base)] mb-2">
                    <User className="w-5 h-5" />
                    <h3 className="font-bold tracking-tight">PERSONAL INFORMATION</h3>
                  </div>
                  <Placard
                    elevation="floating"
                    className="border-[var(--sys-color-concreteGrey-base)]/10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <EditableField
                        label="Full Name"
                        value={localData.Personal_Information.FullName}
                        onSave={(val: string) => {
                          const newData = { ...localData };
                          newData.Personal_Information.FullName = val;
                          handleUpdate(newData);
                        }}
                      />
                      <EditableField
                        label="Contact Email"
                        value={localData.Personal_Information.Email}
                        onSave={(val: string) => {
                          const newData = { ...localData };
                          newData.Personal_Information.Email = val;
                          handleUpdate(newData);
                        }}
                      />
                    </div>
                  </Placard>
                </section>
              </div>
            </Vessel>
            {/* Verification Grid */}
            <SourceVerificationGrid
              items={localData.Structured_Achievements.map((a) => ({
                id: a.Achievement_ID,
                field: 'Achievement',
                actual: a.Outcome,
                expected: a.Original_Text || 'N/A',
                status: a.Needs_Review_Flag ? 'flagged' : 'match',
                confidence: 0.95,
              }))}
            />

            {/* Audit Log */}
            <AuditLogList
              items={[
                {
                  id: '1',
                  timestamp: new Date().toISOString(),
                  status: 'pass',
                  message: 'AI Extraction validated against source successfully.',
                },
                {
                  id: '2',
                  timestamp: new Date().toISOString(),
                  status: 'warning',
                  message: 'Manual review required for low-confidence spans.',
                },
              ]}
            />
          </div>
        </div>
      </div>
    </Vessel>
  );
};
