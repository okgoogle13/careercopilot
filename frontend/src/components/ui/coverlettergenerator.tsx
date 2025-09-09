import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/ui/editor"; // Assuming a custom rich text editor component

type ToneSetting = 'Formal' | 'Casual' | 'Enthusiastic';

export const CoverLetterGenerator: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [tone, setTone] = useState<ToneSetting>('Formal');

  const handleGenerateCoverLetter = async () => {
    setIsGenerating(true);
    try {
      // Mock API call - replace with actual API
      const mockCoverLetterGeneration = () => {
        const toneMap = {
          'Formal': 'I am writing to express my keen interest',
          'Casual': 'Hey there! I'm super excited about this role',
          'Enthusiastic': 'I am incredibly passionate and deeply committed'
        };

        return `
        <p>${toneMap[tone]} in the ${jobDescription.split(' ').slice(0, 5).join(' ')} role.</p>

        <p>With my background in community services and dedication to impactful work, I believe I am an exceptional candidate for this position.</p>

        <p>Thank you for your consideration.</p>
        `;
      };

      const generatedContent = mockCoverLetterGeneration();
      setGeneratedCoverLetter(generatedContent);
    } catch (error) {
      console.error('Cover letter generation failed', error);
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
            placeholder="Paste the job description here to generate a tailored cover letter..."
            className={cn(
              "min-h-[450px]",
              "text-semantic-typography-body-md",
              "text-semantic-color-text-primary"
            )}
          />

          <div className="flex items-center gap-semantic-space-stack-sm">
            <label
              className={cn(
                "text-semantic-typography-body-md",
                "text-semantic-color-text-secondary",
                "mr-semantic-space-stack-sm"
              )}
            >
              Tone:
            </label>
            <Select value={tone} onValueChange={(val: ToneSetting) => setTone(val)}>
              <SelectTrigger
                className={cn(
                  "w-[180px]",
                  "text-semantic-typography-body-md",
                  "text-semantic-color-text-primary"
                )}
              >
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {['Formal', 'Casual', 'Enthusiastic'].map((toneOption) => (
                  <SelectItem key={toneOption} value={toneOption}>
                    {toneOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerateCoverLetter}
            disabled={!jobDescription || isGenerating}
            className={cn(
              "w-full mt-semantic-space-stack-sm",
              "bg-semantic-color-action-primary-default",
              "hover:bg-semantic-color-action-primary-hover",
              "text-semantic-color-text-primary"
            )}
          >
            {isGenerating ? 'Generating Cover Letter...' : 'Generate Tailored Cover Letter'}
          </Button>
        </Card>

        {/* Right Panel: Generated Cover Letter */}
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
            Tailored Cover Letter
          </h2>

          <Editor
            value={generatedCoverLetter}
            onChange={setGeneratedCoverLetter}
            placeholder="Your tailored cover letter will appear here..."
            className={cn(
              "min-h-[450px]",
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
