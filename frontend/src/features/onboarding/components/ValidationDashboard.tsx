import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack,
    Divider,
    Alert,
    Button,
    Snackbar,
} from '@mui/material';
import {
    ExpandMore,
    Person,
    Work,
    EmojiEvents,
    Psychology,
    AutoAwesome,
    Download,
    Undo,
    Redo,
} from '@mui/icons-material';
import { CareerDatabase, StructuredAchievement, KSCResponse } from '../../types/api';
import { EditableField } from '../../components/shared/EditableField';
import { StatusChip } from '../../components/shared/StatusChip';

interface ValidationDashboardProps {
    data: CareerDatabase;
    onUpdate: (updatedData: CareerDatabase) => void;
}

export const ValidationDashboard: React.FC<ValidationDashboardProps> = ({ data, onUpdate }) => {
    const [localData, setLocalData] = useState<CareerDatabase>(data);
    const [history, setHistory] = useState<CareerDatabase[]>([data]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');

    const flaggedAchievements = localData.Structured_Achievements.filter((a) => a.Needs_Review_Flag);
    const flaggedKSCs = localData.KSC_Responses.filter((k) => k.Needs_Review_Flag);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Ctrl+Z: Undo
            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                handleUndo();
            }
            // Ctrl+Shift+Z or Ctrl+Y: Redo
            if ((e.ctrlKey && e.shiftKey && e.key === 'Z') || (e.ctrlKey && e.key === 'y')) {
                e.preventDefault();
                handleRedo();
            }
            // Ctrl+S: Download JSON
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                handleDownloadJSON();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [localData, historyIndex, history]);

    const addToHistory = useCallback((newData: CareerDatabase) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newData);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setLocalData(history[newIndex]);
            onUpdate(history[newIndex]);
            setSnackbarMessage('Undo applied');
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setLocalData(history[newIndex]);
            onUpdate(history[newIndex]);
            setSnackbarMessage('Redo applied');
        }
    };

    const handleAchievementUpdate = (achievementId: string, field: string, value: string) => {
        const updated = {
            ...localData,
            Structured_Achievements: localData.Structured_Achievements.map((ach) =>
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
            KSC_Responses: localData.KSC_Responses.map((ksc) =>
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

        // Apply all achievement suggestions
        updated.Structured_Achievements = updated.Structured_Achievements.map((ach) => {
            if (ach.Improvement_Suggestions) {
                appliedCount++;
                return {
                    ...ach,
                    Action_Verb: ach.Improvement_Suggestions.Action_Verb || ach.Action_Verb,
                    // Noun_Task: ach.Improvement_Suggestions.Noun_Task || ach.Noun_Task, // Noun_Task is not in the current type definition
                    Metric: ach.Improvement_Suggestions.Metric || ach.Metric,
                    // Strategy: ach.Improvement_Suggestions.Strategy || ach.Strategy, // Strategy is not in the current type definition
                    Outcome: ach.Improvement_Suggestions.Outcome || ach.Outcome,
                    Needs_Review_Flag: false, // Mark as reviewed after applying
                };
            }
            return ach;
        });

        // Apply all KSC suggestions
        updated.KSC_Responses = updated.KSC_Responses.map((ksc) => {
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
        setSnackbarMessage(`Applied ${appliedCount} AI suggestions`);
    };

    const handleDownloadJSON = () => {
        const dataStr = JSON.stringify(localData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `career-database-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setSnackbarMessage('Career database downloaded');
    };

    return (
        <Box
            sx={{
                maxWidth: 1400,
                margin: '0 auto',
                p: 3,
                bgcolor: 'var(--sys-color-background)',
                minHeight: '100vh',
            }}
        >
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
                <Box>
                    <Typography
                        variant="h3"
                        sx={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            color: 'var(--sys-color-primary)',
                            mb: 1,
                        }}
                    >
                        Career Database Validation
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                        Review and refine AI-extracted career data
                    </Typography>
                </Box>

                {/* Action Toolbar */}
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<Undo />}
                        onClick={handleUndo}
                        disabled={historyIndex === 0}
                        sx={{
                            borderColor: 'var(--sys-color-outline)',
                            color: 'var(--sys-color-on-surface)',
                            '&:hover': {
                                borderColor: 'var(--sys-color-primary)',
                                bgcolor: 'var(--sys-color-surface-container)',
                            },
                        }}
                    >
                        Undo
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Redo />}
                        onClick={handleRedo}
                        disabled={historyIndex === history.length - 1}
                        sx={{
                            borderColor: 'var(--sys-color-outline)',
                            color: 'var(--sys-color-on-surface)',
                            '&:hover': {
                                borderColor: 'var(--sys-color-primary)',
                                bgcolor: 'var(--sys-color-surface-container)',
                            },
                        }}
                    >
                        Redo
                    </Button>
                    {(flaggedAchievements.length > 0 || flaggedKSCs.length > 0) && (
                        <Button
                            variant="contained"
                            startIcon={<AutoAwesome />}
                            onClick={handleApplyAllSuggestions}
                            sx={{
                                bgcolor: 'var(--sys-color-tertiary-container)',
                                color: 'var(--sys-color-on-tertiary-container)',
                                fontWeight: 600,
                                '&:hover': {
                                    bgcolor: 'var(--sys-color-tertiary)',
                                    color: 'var(--sys-color-on-tertiary)',
                                },
                            }}
                        >
                            Apply All AI Suggestions
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={handleDownloadJSON}
                        sx={{
                            borderColor: 'var(--sys-color-primary)',
                            color: 'var(--sys-color-primary)',
                            fontWeight: 600,
                            '&:hover': {
                                borderColor: 'var(--sys-color-primary)',
                                bgcolor: 'var(--sys-color-primary-container)',
                            },
                        }}
                    >
                        Download JSON
                    </Button>
                </Stack>
            </Stack>

            {/* Summary Stats */}
            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                <Card
                    sx={{
                        flex: 1,
                        bgcolor: 'var(--sys-color-surface-container)',
                        borderRadius: 'var(--sys-shape-corner-large)',
                        border: '1px solid var(--sys-color-outline-variant)',
                    }}
                >
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <EmojiEvents sx={{ color: 'var(--sys-color-primary)' }} />
                            <Box>
                                <Typography variant="h5" sx={{ color: 'var(--sys-color-on-surface)', fontWeight: 600 }}>
                                    {localData.Structured_Achievements.length}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                                    Achievements
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                <Card
                    sx={{
                        flex: 1,
                        bgcolor: flaggedAchievements.length > 0 ? '#fbbf2420' : 'var(--sys-color-surface-container)',
                        borderRadius: 'var(--sys-shape-corner-large)',
                        border: '1px solid var(--sys-color-outline-variant)',
                    }}
                >
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Psychology sx={{ color: flaggedAchievements.length > 0 ? '#fbbf24' : 'var(--sys-color-secondary)' }} />
                            <Box>
                                <Typography variant="h5" sx={{ color: 'var(--sys-color-on-surface)', fontWeight: 600 }}>
                                    {flaggedAchievements.length}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                                    Need Review
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>

            {/* Flagged Items Alert */}
            {(flaggedAchievements.length > 0 || flaggedKSCs.length > 0) && (
                <Alert
                    severity="warning"
                    sx={{
                        mb: 3,
                        bgcolor: '#fbbf2410',
                        border: '1px solid #fbbf24',
                        '& .MuiAlert-icon': { color: '#fbbf24' },
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {flaggedAchievements.length + flaggedKSCs.length} items need review
                    </Typography>
                    <Typography variant="caption">
                        AI has flagged these for missing metrics, vague language, or insufficient detail.
                    </Typography>
                </Alert>
            )}

            {/* Personal Information */}
            <Accordion
                defaultExpanded
                sx={{
                    bgcolor: 'var(--sys-color-surface-container-low)',
                    borderRadius: 'var(--sys-shape-corner-large) !important',
                    mb: 2,
                    '&:before': { display: 'none' },
                    border: '1px solid var(--sys-color-outline-variant)',
                }}
            >
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'var(--sys-color-primary)' }} />}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Person sx={{ color: 'var(--sys-color-primary)' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--sys-color-on-surface)' }}>
                            Personal Information
                        </Typography>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    <EditableField
                        label="Full Name"
                        value={localData.Personal_Information.FullName}
                        onSave={(val) => {
                            const updated = { ...localData, Personal_Information: { ...localData.Personal_Information, FullName: val } };
                            setLocalData(updated);
                            onUpdate(updated);
                        }}
                    />
                    <EditableField
                        label="Email"
                        value={localData.Personal_Information.Email}
                        onSave={(val) => {
                            const updated = { ...localData, Personal_Information: { ...localData.Personal_Information, Email: val } };
                            setLocalData(updated);
                            onUpdate(updated);
                        }}
                    />
                </AccordionDetails>
            </Accordion>

            {/* Achievements */}
            <Accordion
                defaultExpanded
                sx={{
                    bgcolor: 'var(--sys-color-surface-container-low)',
                    borderRadius: 'var(--sys-shape-corner-large) !important',
                    mb: 2,
                    '&:before': { display: 'none' },
                    border: '1px solid var(--sys-color-outline-variant)',
                }}
            >
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'var(--sys-color-primary)' }} />}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <EmojiEvents sx={{ color: 'var(--sys-color-primary)' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--sys-color-on-surface)' }}>
                            Structured Achievements ({localData.Structured_Achievements.length})
                        </Typography>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack spacing={3} divider={<Divider sx={{ borderColor: 'var(--sys-color-outline-variant)' }} />}>
                        {localData.Structured_Achievements.map((achievement) => (
                            <Box key={achievement.Achievement_ID}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                                        {achievement.Achievement_ID}
                                    </Typography>
                                    <StatusChip needsReview={achievement.Needs_Review_Flag} />
                                </Stack>

                                <EditableField
                                    label="Original Text"
                                    value={achievement.Original_Text}
                                    multiline
                                    onSave={(val) => handleAchievementUpdate(achievement.Achievement_ID, 'Original_Text', val)}
                                />

                                <EditableField
                                    label="Action Verb"
                                    value={achievement.Action_Verb}
                                    suggestion={achievement.Improvement_Suggestions?.Action_Verb}
                                    onSave={(val) => handleAchievementUpdate(achievement.Achievement_ID, 'Action_Verb', val)}
                                />

                                <EditableField
                                    label="Metric"
                                    value={achievement.Metric}
                                    suggestion={achievement.Improvement_Suggestions?.Metric}
                                    onSave={(val) => handleAchievementUpdate(achievement.Achievement_ID, 'Metric', val)}
                                />

                                <EditableField
                                    label="Outcome"
                                    value={achievement.Outcome}
                                    suggestion={achievement.Improvement_Suggestions?.Outcome}
                                    multiline
                                    onSave={(val) => handleAchievementUpdate(achievement.Achievement_ID, 'Outcome', val)}
                                />
                            </Box>
                        ))}
                    </Stack>
                </AccordionDetails>
            </Accordion>

            {/* KSC Responses */}
            {localData.KSC_Responses.length > 0 && (
                <Accordion
                    sx={{
                        bgcolor: 'var(--sys-color-surface-container-low)',
                        borderRadius: 'var(--sys-shape-corner-large) !important',
                        mb: 2,
                        '&:before': { display: 'none' },
                        border: '1px solid var(--sys-color-outline-variant)',
                    }}
                >
                    <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'var(--sys-color-primary)' }} />}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Work sx={{ color: 'var(--sys-color-primary)' }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--sys-color-on-surface)' }}>
                                KSC/STAR Responses ({localData.KSC_Responses.length})
                            </Typography>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={3} divider={<Divider sx={{ borderColor: 'var(--sys-color-outline-variant)' }} />}>
                            {localData.KSC_Responses.map((ksc) => (
                                <Box key={ksc.KSC_ID}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ color: 'var(--sys-color-on-surface-variant)' }}>
                                            {ksc.KSC_Prompt.substring(0, 60)}...
                                        </Typography>
                                        <StatusChip needsReview={ksc.Needs_Review_Flag} />
                                    </Stack>

                                    {ksc.Needs_Review_Flag && ksc.STAR_Feedback && (
                                        <Alert severity="info" sx={{ mb: 2, bgcolor: 'var(--sys-color-primary-container)' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                AI Feedback:
                                            </Typography>
                                            <Typography variant="body2">{ksc.STAR_Feedback}</Typography>
                                        </Alert>
                                    )}

                                    <EditableField
                                        label="Situation"
                                        value={ksc.Situation}
                                        suggestion={ksc.Improvement_Suggestions.Situation}
                                        multiline
                                        onSave={(val) => handleKSCUpdate(ksc.KSC_ID, 'Situation', val)}
                                    />

                                    <EditableField
                                        label="Result"
                                        value={ksc.Result}
                                        suggestion={ksc.Improvement_Suggestions.Result}
                                        multiline
                                        onSave={(val) => handleKSCUpdate(ksc.KSC_ID, 'Result', val)}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            )}

            {/* Snackbar for user feedback */}
            <Snackbar
                open={!!snackbarMessage}
                autoHideDuration={3000}
                onClose={() => setSnackbarMessage('')}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{
                    '& .MuiSnackbarContent-root': {
                        bgcolor: 'var(--sys-color-inverse-surface)',
                        color: 'var(--sys-color-inverse-on-surface)',
                        borderRadius: 'var(--sys-shape-corner-small)',
                    },
                }}
            />
        </Box>
    );
};
