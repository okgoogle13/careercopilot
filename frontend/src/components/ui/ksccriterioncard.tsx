import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React, { useState } from 'react';

interface KscCriterionCardProps {
  criterion: string;
  onGenerate?: (criterion: string) => Promise<string>;
}

export const KscCriterionCard: React.FC<KscCriterionCardProps> = ({
  criterion,
  onGenerate = async () => "Sample generated response for: " + criterion
}) => {
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await onGenerate(criterion);
      setGeneratedText(response);
    } catch (error) {
      console.error('Generation failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        "bg-semantic-color-bg-surface",
        "border-semantic-color-border-subtle",
        "rounded-semantic-radius-lg",
        "p-semantic-space-inset-lg",
        "shadow-sm"
      )}
    >
      <CardHeader
        className={cn(
          "p-0 mb-semantic-space-stack-sm"
        )}
      >
        <CardTitle
          className={cn(
            "text-semantic-typography-heading-md",
            "text-semantic-color-text-primary"
          )}
        >
          Key Selection Criterion
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-semantic-space-stack-sm">
        <div
          className={cn(
            "bg-semantic-color-bg-elevated",
            "p-semantic-space-inset-sm",
            "rounded-semantic-radius-md",
            "text-semantic-color-text-secondary",
            "text-semantic-typography-body-md"
          )}
        >
          {criterion}
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className={cn(
            "w-full",
            "bg-semantic-color-action-primary-default",
            "hover:bg-semantic-color-action-primary-hover",
            "text-semantic-color-text-primary",
            "mb-semantic-space-stack-sm"
          )}
        >
          {isLoading ? 'Generating...' : 'Generate Response'}
        </Button>

        <Textarea
          value={generatedText}
          onChange={(e) => setGeneratedText(e.target.value)}
          placeholder="Your generated response will appear here..."
          className={cn(
            "min-h-[150px]",
            "text-semantic-typography-body-md",
            "text-semantic-color-text-primary"
          )}
        />
      </CardContent>
    </Card>
  );
};
