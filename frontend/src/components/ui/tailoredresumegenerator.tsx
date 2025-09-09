import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Editor } from "@/components/ui/editor"; // Assuming a custom rich text editor component
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React, { useState } from 'react';

export const TailoredResumeGenerator: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [generatedResume, setGeneratedResume] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerateResume = async () => {
    setIsGenerating(true);
    try {
      // Mock API call - replace with actual API
      const mockResumeGeneration = () => {
        return `
        <h1>Jane Doe</h1>
        <p>Professional Social Worker | Community Services Specialist</p>

        <h2>Professional Summary</h2>
        <p>Dedicated social worker with ${jobDescription.split(' ').slice(0, 10).join(' ')}...</p>

        <h2>Professional Experience</h2>
        <h3>Senior Support Coordinator | Community Care Solutions</h3>
        <ul>
          <li>Developed and implemented client-centered support strategies</li>
          <li>Collaborated with multidisciplinary teams to enhance service delivery</li>
        </ul>
        `;
      };

      const generatedContent = mockResumeGeneration();
      setGeneratedResume(generatedContent);
    } catch (error) {
      console.error('Resume generation failed', error);
    } finally {
      setIsGenerating(false);
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
          "grid md:grid-cols-2 gap-semantic-space-stack-lg",
          "max-w-6xl mx-auto"
        )}
      >
        {/* Left Panel: Job Description */}
        <Card
          className={cn(
            "bg-semantic-color-bg-surface",
            "border-semantic-color-border-subtle",
            "rounded-semantic-radius-lg",
            "p-semantic-space-inset-lg",
            "space-y-semantic-space-stack-md"
          )}
        >
          <h2
            className={cn(
              "text-semantic-typography-heading-md",
              "text-semantic-color-text-primary"
            )}
          >
            Job Description
          </h2>

          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to generate a tailored resume..."
            className={cn(
              "min-h-[500px]",
              "text-semantic-typography-body-md",
              "text-semantic-color-text-primary"
            )}
          />

          <Button
            onClick={handleGenerateResume}
            disabled={!jobDescription || isGenerating}
            className={cn(
              "w-full",
              "bg-semantic-color-action-primary-default",
              "hover:bg-semantic-color-action-primary-hover",
              "text-semantic-color-text-primary"
            )}
          >
            {isGenerating ? 'Generating Resume...' : 'Generate Tailored Resume'}
          </Button>
        </Card>

        {/* Right Panel: Generated Resume */}
        <Card
          className={cn(
            "bg-semantic-color-bg-surface",
            "border-semantic-color-border-subtle",
            "rounded-semantic-radius-lg",
            "p-semantic-space-inset-lg",
            "space-y-semantic-space-stack-md"
          )}
        >
          <h2
            className={cn(
              "text-semantic-typography-heading-md",
              "text-semantic-color-text-primary"
            )}
          >
            Tailored Resume
          </h2>

          <Editor
            value={generatedResume}
            onChange={setGeneratedResume}
            placeholder="Your tailored resume will appear here..."
            className={cn(
              "min-h-[500px]",
              "text-semantic-typography-body-md",
              "text-semantic-color-text-primary"
            )}
          />

          <div className="flex gap-semantic-space-stack-sm">
            <Button
              variant="secondary"
              className={cn(
                "flex-1",
                "bg-semantic-color-bg-elevated",
                "text-semantic-color-text-primary"
              )}
            >
              Download PDF
            </Button>
            <Button
              className={cn(
                "flex-1",
                "bg-semantic-color-action-primary-default",
                "hover:bg-semantic-color-action-primary-hover",
                "text-semantic-color-text-primary"
              )}
            >
              Save Version
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
