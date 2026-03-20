/**
 * CLASSIFICATION: Support Component Only
 * Prototype-only component.
 */
import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { PrimaryButton } from '../src/components/ui/PrimaryButton';
import { TextInput } from '../src/components/ui/TextInput';
import { SectionHeader } from '../src/components/ui/SectionHeader';

export function ImageStudio() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [baseImage, setBaseImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setBaseImage({
        data: base64Data,
        mimeType: file.type,
      });
      setImageUrl(result); // Preview the uploaded image
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('Gemini API key is missing.');

      const ai = new GoogleGenAI({ apiKey });

      const parts: any[] = [{ text: prompt }];

      if (baseImage) {
        parts.unshift({
          inlineData: {
            data: baseImage.data,
            mimeType: baseImage.mimeType,
          },
        });
      }

      const response = await ai.models.generateContent({
        model: baseImage ? 'gemini-2.5-flash-image' : 'gemini-3.1-flash-image-preview',
        contents: { parts },
        config: baseImage
          ? undefined
          : {
              imageConfig: {
                aspectRatio: '1:1',
                imageSize: '1K',
              },
            },
      });

      let foundImage = false;
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            setImageUrl(`data:image/png;base64,${base64EncodeString}`);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        throw new Error('No image was returned by the model.');
      }
    } catch (err: any) {
      console.error('Image generation failed:', err);
      setError(err.message || 'Failed to generate image.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className="p-8 bg-[var(--sys-color-charcoalBackground-steps-1)] border border-[var(--sys-color-outline-variant)] shadow-[var(--sys-shadow-elevation2Placard)]"
      style={{ borderRadius: 'var(--sys-shape-blockRiot02)' }}
    >
      <SectionHeader
        title="Image Studio"
        subtitle="Generate or edit images using Gemini Flash Image models."
      />

      <div className="space-y-6 mt-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-[var(--sys-color-worker-ash-base)] uppercase tracking-widest">
            Base Image (Optional for Editing)
          </label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="flex gap-4 items-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-[var(--sys-color-charcoalBackground-steps-3)] text-[var(--sys-color-paperWhite-base)] border border-[var(--sys-color-outline-variant)] hover:bg-[var(--sys-color-charcoalBackground-steps-4)] transition-colors text-sm font-bold uppercase tracking-wider"
              style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
            >
              Upload Image
            </button>
            {baseImage && (
              <button
                onClick={() => {
                  setBaseImage(null);
                  setImageUrl(null);
                }}
                className="text-xs text-[var(--sys-color-solidarityRed-base)] hover:underline uppercase tracking-wider font-bold"
              >
                Clear Image
              </button>
            )}
          </div>
        </div>

        <TextInput
          label="Image Prompt"
          placeholder="e.g. A futuristic city skyline at sunset, cyberpunk style..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="flex justify-end">
          <PrimaryButton
            label={isGenerating ? 'Generating...' : baseImage ? 'Edit Image' : 'Generate Image'}
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          />
        </div>

        {error && (
          <div
            className="p-4 bg-[color-mix(in_srgb,var(--sys-color-solidarityRed-base)_10%,transparent)] border border-[var(--sys-color-solidarityRed-base)] text-[var(--sys-color-solidarityRed-base)]"
            style={{ borderRadius: 'var(--sys-shape-blockRiot01)' }}
          >
            <p className="font-bold uppercase tracking-widest text-xs mb-1">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {imageUrl && (
          <div
            className="mt-8 border border-[var(--sys-color-outline-variant)] overflow-hidden"
            style={{ borderRadius: 'var(--sys-shape-blockRiot02)' }}
          >
            <img
              src={imageUrl}
              alt={prompt}
              className="w-full h-auto object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>
    </div>
  );
}
