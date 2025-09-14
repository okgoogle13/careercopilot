import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Check, Eye, Star } from 'lucide-react';

interface TemplateCardProps {
  template_name: string;
  ats_score: number;
  preview_image?: string;
  is_recommended?: boolean;
  is_selected?: boolean;
  best_for_tags?: string[];
  onSelect?: () => void;
  onPreview?: () => void;
}

export function TemplateCard({
  template_name,
  ats_score,
  preview_image,
  is_recommended = false,
  is_selected = false,
  best_for_tags = [],
  onSelect,
  onPreview,
}: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-accent-green';
    if (score >= 90) return 'text-brand-light';
    if (score >= 85) return 'text-accent-orange';
    return 'text-content-muted';
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 cursor-pointer group card-surface hover:border-brand-primary ${
        is_selected ? 'ring-2 ring-brand-primary glow-primary' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* Recommended Badge */}
      {is_recommended && (
        <div className='absolute top-3 left-3 z-10'>
          <Badge className='bg-accent-green text-white gap-1 shadow-lg font-semibold'>
            <Star className='w-3 h-3' />
            Recommended
          </Badge>
        </div>
      )}

      {/* Selection Indicator */}
      {is_selected && (
        <div className='absolute top-3 right-3 z-10'>
          <div className='w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center shadow-lg'>
            <Check className='w-4 h-4 text-white' />
          </div>
        </div>
      )}

      {/* Preview Image */}
      <div className='relative h-48 bg-surface-section overflow-hidden rounded-t-2xl'>
        {preview_image ? (
          <img
            src={preview_image}
            alt={`${template_name} preview`}
            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-section to-surface-card'>
            <div className='text-content-muted'>
              <Eye className='w-12 h-12 mx-auto mb-2 opacity-50' />
              <p className='text-sm'>Preview</p>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 flex items-center justify-center ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Button
            variant='outline'
            size='sm'
            onClick={e => {
              e.stopPropagation();
              onPreview?.();
            }}
            className='border-brand-primary text-white hover:bg-brand-primary hover:text-white font-semibold'
          >
            <Eye className='w-4 h-4 mr-2' />
            Preview
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className='p-6 space-y-4'>
        <div className='flex items-start justify-between'>
          <h3 className='font-semibold text-content-primary group-hover:text-brand-light transition-colors text-lg'>
            {template_name}
          </h3>
          <div className='text-right'>
            <div className={`text-xl font-bold ${getScoreColor(ats_score)}`}>{ats_score}%</div>
            <div className='text-xs text-content-secondary'>ATS Score</div>
          </div>
        </div>

        {/* Tags */}
        {best_for_tags.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {best_for_tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant='outline'
                className='text-xs border-brand-primary/30 text-content-secondary hover:border-brand-primary hover:text-brand-light transition-colors px-2 py-1'
              >
                {tag}
              </Badge>
            ))}
            {best_for_tags.length > 3 && (
              <Badge
                variant='outline'
                className='text-xs border-brand-primary/30 text-content-secondary px-2 py-1'
              >
                +{best_for_tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          className={`w-full transition-all duration-300 font-semibold rounded-3xl py-3 ${
            is_selected
              ? 'btn-gradient'
              : 'border-2 border-brand-primary text-brand-primary hover:btn-gradient hover:text-white'
          }`}
          onClick={e => {
            e.stopPropagation();
            onSelect?.();
          }}
        >
          {is_selected ? 'Selected' : 'Select Template'}
        </Button>
      </div>
    </Card>
  );
}
