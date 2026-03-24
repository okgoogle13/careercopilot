/**
 * Voice Sample Submission Form
 *
 * Form for submitting a writing sample used to establish the user's voice profile.
 */

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const voiceSampleSchema = z.object({
  writingSample: z
    .string()
    .min(50, 'At least 50 characters needed — a short paragraph is enough.')
    .max(5000, 'Writing sample must not exceed 5000 characters'),
});

type VoiceSampleFormData = z.infer<typeof voiceSampleSchema>;

export interface VoiceSampleSubmissionFormProps {
  onSubmit: (sample: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

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
        // Error surfaced via the error prop from the parent
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
        {/* Prompt — Reflection register */}
        <div
          className="text-sm leading-relaxed"
          style={{ color: 'var(--sys-color-paperWhite-base)' }}
        >
          <p className="opacity-80">
            Paste anything you have written — a cover letter, an email, a short reflection. A
            paragraph is enough. We will take it from there.
          </p>
        </div>

        {/* Textarea */}
        <textarea
          {...register('writingSample')}
          placeholder="Your words go here..."
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

        {/* Validation error */}
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

        {/* Submit */}
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
          {isProcessing ? 'Reading your voice...' : 'Record My Voice'}
        </button>
      </div>
    </form>
  );
}
