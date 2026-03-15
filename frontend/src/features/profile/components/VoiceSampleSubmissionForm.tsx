/**
 * Voice Sample Submission Form
 *
 * Form component for submitting writing samples to extract voice profile.
 * Uses React Hook Form for validation and state management.
 */

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Validation schema
const voiceSampleSchema = z.object({
  writingSample: z
    .string()
    .min(50, 'Writing sample must be at least 50 characters')
    .max(5000, 'Writing sample must not exceed 5000 characters'),
});

type VoiceSampleFormData = z.infer<typeof voiceSampleSchema>;

export interface VoiceSampleSubmissionFormProps {
  onSubmit: (sample: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

/**
 * Form for submitting a writing sample for voice profile extraction.
 *
 * @param onSubmit - Callback when form is submitted with validated sample
 * @param loading - Whether submission is in progress
 * @param error - Error message to display if submission failed
 */
export function VoiceSampleSubmissionForm({
  onSubmit,
  loading = false,
  error = null,
}: VoiceSampleSubmissionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VoiceSampleFormData>({
    resolver: zodResolver(voiceSampleSchema),
    defaultValues: {
      writingSample: '',
    },
  });

  const onFormSubmit = useCallback(
    async (data: VoiceSampleFormData) => {
      try {
        await onSubmit(data.writingSample);
        reset();
      } catch (err) {
        // Error handled by parent component
      }
    },
    [onSubmit, reset]
  );

  const isProcessing = loading || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="w-full"
    >
      <div className="space-y-4">
        {/* Instructions */}
        <div
          className="text-sm leading-relaxed"
          style={{ color: 'var(--sys-color-paperWhite-base)' }}
        >
          <p className="opacity-80">
            Paste a writing sample (cover letter, email, or other professional text) to create your
            voice profile. This helps us understand your writing style for personalized content
            generation.
          </p>
        </div>

        {/* Textarea */}
        <textarea
          {...register('writingSample')}
          placeholder="Paste your writing sample here... (minimum 50 characters)"
          disabled={isProcessing}
          style={{
            backgroundColor: 'var(--sys-color-charcoalBackground-steps-2)',
            color: 'var(--sys-color-paperWhite-base)',
            borderColor: errors.writingSample
              ? 'var(--sys-color-kr-charcoalRed-base)'
              : 'var(--sys-color-concreteGrey-base)',
            borderRadius: 'var(--sys-shape-blockRiot02)',
          }}
          className="w-full p-4 border-2 transition-colors duration-200 min-h-[200px] font-primary text-base resize-none focus:outline-none focus:border-opacity-100"
        />

        {/* Character count */}
        <div
          className="text-xs text-right opacity-60"
          style={{ color: 'var(--sys-color-concreteGrey-base)' }}
        >
          {/* Character count would be dynamic in real usage */}
        </div>

        {/* Error message */}
        {errors.writingSample && (
          <div
            style={{ color: 'var(--sys-color-kr-charcoalRed-base)' }}
            className="text-sm font-medium"
          >
            {errors.writingSample.message}
          </div>
        )}

        {/* Submission error */}
        {error && (
          <div
            style={{
              backgroundColor: 'var(--sys-color-kr-charcoalRed-base)',
              color: 'var(--sys-color-paperWhite-base)',
              borderRadius: 'var(--sys-shape-blockRiot02)',
            }}
            className="p-4 text-sm"
          >
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isProcessing}
          style={{
            backgroundColor: isProcessing
              ? 'var(--sys-color-concreteGrey-base)'
              : 'var(--sys-color-solidarityRed-base)',
            color: 'var(--sys-color-charcoalBackground-base)',
            borderRadius: 'var(--sys-shape-blockRiot03)',
            opacity: isProcessing ? 0.6 : 1,
          }}
          className="w-full px-6 py-3 font-display font-bold text-sm uppercase tracking-wide transition-all duration-200 disabled:cursor-not-allowed hover:opacity-90"
        >
          {isProcessing ? 'Analyzing...' : 'Create Voice Profile'}
        </button>
      </div>
    </form>
  );
}
