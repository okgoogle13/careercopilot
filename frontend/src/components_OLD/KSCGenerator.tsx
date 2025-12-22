import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Sparkles, FileText, ArrowRight, Wand2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const KSCGenerator = () => {
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setStep(3); // Mock completion
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-2">
                    <Sparkles size={24} />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">KSC Generator</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Transform your key selection criteria responses into persuasive, evidence-based statements using AI.
                </p>
            </div>

            <Card className="p-8 bg-surface-container border-border/50 relative overflow-hidden">
                {isGenerating && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-lg font-medium animate-pulse">Generating your responses...</p>
                    </div>
                )}

                {step === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
                                Paste the Criteria
                            </h2>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Selection Criteria Text</label>
                                <Textarea
                                    placeholder="Paste the key selection criteria from the job description here..."
                                    className="min-h-[150px] bg-background border-border text-base"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button size="lg" onClick={() => setStep(2)} className="gap-2">
                                Next Step <ArrowRight size={18} />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
                                Add Your Experience
                            </h2>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Relevant Experience / Notes</label>
                                <Textarea
                                    placeholder="Briefly describe a situation where you demonstrated these skills (STAR method)..."
                                    className="min-h-[150px] bg-background border-border text-base"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                            <Button size="lg" onClick={handleGenerate} className="gap-2 bg-gradient-to-r from-primary to-primary-sage hover:opacity-90 transition-opacity">
                                <Wand2 size={18} /> Generate Response
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-2">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-2xl font-bold">Content Generated!</h3>
                            <p className="text-muted-foreground">Your KSC response is ready for review.</p>

                            <div className="w-full bg-background rounded-lg border border-border p-6 text-left mt-6">
                                <h4 className="font-semibold mb-2 text-primary">Generated Response:</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                    In my recent role as Senior Software Engineer at TechCorp, I demonstrated advanced capability in [Criteria] when I led the migration of a legacy system...
                                    [Mock generated text would appear here demonstrating the user's skills aligned with the STAR method]
                                </p>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <Button variant="outline" onClick={() => setStep(1)}>Start Over</Button>
                                <Button>Copy to Clipboard</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </Card>
        </div>
    );
};

export default KSCGenerator;
