import { KscCriterionCard } from "@/components/KSC/KscCriterionCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React, { useState } from 'react';

const mockDetectKsc = async (jobDescription: string): Promise<string[]> => {
  // Simulating KSC detection
  return [
    "Demonstrated ability to develop and maintain effective working relationships",
    "Experience in delivering high-quality client-centered services",
    "Strong communication and interpersonal skills"
  ];
};

const mockGenerateResponse = async (criterion: string): Promise<string> => {
  // Simulating AI generation
  return `In my previous role as a support coordinator, I consistently demonstrated ${criterion.toLowerCase()} by:
1. Building rapport with diverse client groups
2. Actively listening and responding to individual needs
3. Collaborating effectively with multi-disciplinary teams`;
};

export const KscGeneratorPage: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [detectedKsc, setDetectedKsc] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const kscList = await mockDetectKsc(jobDescription);
      setDetectedKsc(kscList);
    } catch (error) {
      console.error('KSC Detection failed', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      className={cn(
        "container mx-auto p-semantic-space-inset-lg",
        "bg-semantic-color-bg-canvas",
        "min-h-screen"
      )}
    >
      <div
        className={cn(
          "max-w-4xl mx-auto",
          "space-y-semantic-space-stack-lg"
        )}
      >
        <h1
          className={cn(
            "text-semantic-typography-display-md",
            "text-semantic-color-text-primary",
            "text-center"
          )}
        >
          Key Selection Criteria Generator
        </h1>

        <Textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste your job description here to detect Key Selection Criteria..."
          className={cn(
            "min-h-[200px]",
            "text-semantic-typography-body-lg",
            "text-semantic-color-text-primary"
          )}
        />

        <Button
          onClick={handleAnalyze}
          disabled={!jobDescription || isAnalyzing}
          className={cn(
            "w-full",
            "bg-semantic-color-action-primary-default",
            "hover:bg-semantic-color-action-primary-hover",
            "text-semantic-color-text-primary"
          )}
        >
          {isAnalyzing ? 'Analyzing...' : 'Detect Key Selection Criteria'}
        </Button>

        {detectedKsc.length > 0 && (
          <div
            className={cn(
              "space-y-semantic-space-stack-md"
            )}
          >
            <h2
              className={cn(
                "text-semantic-typography-heading-lg",
                "text-semantic-color-text-primary"
              )}
            >
              Detected Key Selection Criteria
            </h2>

            <div
              className={cn(
                "grid md:grid-cols-2 gap-semantic-space-stack-md"
              )}
            >
              {detectedKsc.map((criterion, index) => (
                <KscCriterionCard
                  key={index}
                  criterion={criterion}
                  onGenerate={mockGenerateResponse}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
