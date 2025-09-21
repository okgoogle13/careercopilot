import { TextField } from '@mui/material';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
} from '@mui/material';

interface KscCriterionCardProps {
  criterion: string;
  onGenerate?: (criterion: string) => Promise<string>;
}

export const KscCriterionCard: React.FC<KscCriterionCardProps> = ({
  criterion,
  onGenerate = async () => 'Sample generated response for: ' + criterion,
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
        'bg-semantic-color-bg-surface',
        'border-semantic-color-border-subtle',
        'rounded-semantic-radius-lg',
        'p-semantic-space-inset-lg',
        'shadow-sm'
      )}
    >
      <CardHeader
        className={cn('p-0 mb-semantic-space-stack-sm')}
        title={<Typography variant='h3'>Key Selection Criterion
                  </Typography>}>

      </CardHeader>
      <CardContent className="p-0 space-y-semantic-space-stack-sm">
        <div
          className={cn(
            'bg-semantic-color-bg-elevated',
            'p-semantic-space-inset-sm',
            'rounded-semantic-radius-md',
            'text-semantic-color-text-secondary',
            'text-semantic-typography-body-md'
          )}
        >
          {criterion}
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className={cn(
            'w-full',
            'bg-semantic-color-action-primary-default',
            'hover:bg-semantic-color-action-primary-hover',
            'text-semantic-color-text-primary',
            'mb-semantic-space-stack-sm'
          )}
        >
          {isLoading ? 'Generating...' : 'Generate Response'}
        </Button>

        <TextField
          fullWidth
          multiline
          minRows={4}
          placeholder="Your generated response will appear here..."
          value={generatedText}
          onChange={(e) => setGeneratedText(e.target.value)}
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
};
