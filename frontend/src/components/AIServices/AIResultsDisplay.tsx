import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';
import {
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star,
  Copy,
  Download,
  Share2,
  BookmarkPlus,
  Eye,
  ThumbsUp,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AISuccessHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  score?: number;
  processingTime?: string;
}

export const AISuccessHeader: React.FC<AISuccessHeaderProps> = ({
  title,
  subtitle,
  icon,
  score,
  processingTime,
}) => {
  return (
    <Card className='p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='p-3 bg-green-100 rounded-full text-green-600'>{icon}</div>
          <div>
            <h3 className='text-xl font-bold text-gray-900'>{title}</h3>
            <p className='text-gray-600'>{subtitle}</p>
          </div>
        </div>

        <div className='text-right'>
          {score && <div className='text-2xl font-bold text-green-600 mb-1'>{score}%</div>}
          {processingTime && (
            <div className='text-sm text-gray-500 flex items-center'>
              <Clock className='h-3 w-3 mr-1' />
              {processingTime}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

interface ScoreDisplayProps {
  score: number;
  label: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  label,
  description,
  size = 'md',
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-500' };
    if (score >= 60)
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', ring: 'ring-yellow-500' };
    return { bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-500' };
  };

  const sizeClasses = {
    sm: { container: 'w-16 h-16', text: 'text-lg', ring: 'ring-2' },
    md: { container: 'w-20 h-20', text: 'text-xl', ring: 'ring-4' },
    lg: { container: 'w-24 h-24', text: 'text-2xl', ring: 'ring-4' },
  };

  const colors = getScoreColor(score);
  const sizes = sizeClasses[size];

  return (
    <div className='text-center'>
      <div
        className={`
        ${sizes.container} ${colors.bg} ${colors.ring}
        rounded-full flex items-center justify-center mx-auto mb-2
        transition-all duration-300 hover:scale-105
      `}
      >
        <span className={`${colors.text} ${sizes.text} font-bold`}>{score}</span>
      </div>
      <div className='text-sm font-medium text-gray-900'>{label}</div>
      {description && <div className='text-xs text-gray-500 mt-1'>{description}</div>}
    </div>
  );
};

interface SkillTagProps {
  skill: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  demand?: 'low' | 'medium' | 'high';
  verified?: boolean;
}

export const SkillTag: React.FC<SkillTagProps> = ({ skill, level, demand, verified }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'advanced':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'intermediate':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'beginner':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDemandIcon = (demand: string) => {
    switch (demand) {
      case 'high':
        return <TrendingUp className='h-3 w-3 text-green-500' />;
      case 'medium':
        return <TrendingUp className='h-3 w-3 text-yellow-500' />;
      case 'low':
        return <TrendingUp className='h-3 w-3 text-gray-400' />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`
      inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm border
      ${level ? getLevelColor(level) : 'bg-blue-50 text-blue-700 border-blue-200'}
    `}
    >
      <span>{skill}</span>
      {verified && <CheckCircle className='h-3 w-3 text-green-500' />}
      {demand && getDemandIcon(demand)}
    </div>
  );
};

interface ImprovementItemProps {
  type: string;
  original: string;
  improved: string;
  reason: string;
  impactScore: number;
}

export const ImprovementItem: React.FC<ImprovementItemProps> = ({
  type,
  original,
  improved,
  reason,
  impactScore,
}) => {
  return (
    <Card className='p-4 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between mb-3'>
        <Badge variant='secondary' className='flex-shrink-0'>
          {type}
        </Badge>
        <div className='flex items-center text-green-600 text-sm font-medium'>
          <TrendingUp className='h-3 w-3 mr-1' />+{impactScore} Impact
        </div>
      </div>

      <div className='space-y-3'>
        <div className='grid grid-cols-1 gap-2'>
          <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
            <div className='text-xs font-medium text-red-700 mb-1'>Before:</div>
            <div className='text-sm text-red-800 line-through'>{original}</div>
          </div>
          <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
            <div className='text-xs font-medium text-green-700 mb-1'>After:</div>
            <div className='text-sm text-green-800 font-medium'>{improved}</div>
          </div>
        </div>

        <div className='p-3 bg-blue-50 border border-blue-200 rounded-lg'>
          <div className='flex items-start'>
            <AlertCircle className='h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0' />
            <div className='text-sm text-blue-800'>{reason}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface ActionButtonsProps {
  onCopy?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onView?: () => void;
  copyText?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCopy,
  onDownload,
  onShare,
  onBookmark,
  onView,
  copyText,
}) => {
  const handleCopy = async () => {
    if (copyText) {
      try {
        await navigator.clipboard.writeText(copyText);
        toast.success('Copied to clipboard!');
      } catch {
        toast.error('Failed to copy to clipboard');
      }
    }
    onCopy?.();
  };

  return (
    <div className='flex flex-wrap gap-2'>
      {onCopy && (
        <Button variant='outline' size='sm' onClick={handleCopy}>
          <Copy className='h-4 w-4 mr-2' />
          Copy
        </Button>
      )}

      {onDownload && (
        <Button variant='outline' size='sm' onClick={onDownload}>
          <Download className='h-4 w-4 mr-2' />
          Download
        </Button>
      )}

      {onShare && (
        <Button variant='outline' size='sm' onClick={onShare}>
          <Share2 className='h-4 w-4 mr-2' />
          Share
        </Button>
      )}

      {onBookmark && (
        <Button variant='outline' size='sm' onClick={onBookmark}>
          <BookmarkPlus className='h-4 w-4 mr-2' />
          Save
        </Button>
      )}

      {onView && (
        <Button variant='outline' size='sm' onClick={onView}>
          <Eye className='h-4 w-4 mr-2' />
          View Details
        </Button>
      )}
    </div>
  );
};

interface ProgressIndicatorProps {
  steps: Array<{
    label: string;
    completed: boolean;
    current?: boolean;
  }>;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ steps }) => {
  return (
    <div className='flex items-center space-x-4 mb-6'>
      {steps.map((step, index) => (
        <React.Fragment key={step.label}>
          <div className='flex items-center'>
            <div
              className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${
                step.completed
                  ? 'bg-green-100 text-green-700 border-2 border-green-500'
                  : step.current
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-500 animate-pulse'
                    : 'bg-gray-100 text-gray-500 border-2 border-gray-300'
              }
            `}
            >
              {step.completed ? <CheckCircle className='h-4 w-4' /> : <span>{index + 1}</span>}
            </div>
            <span
              className={`
              ml-2 text-sm font-medium
              ${
                step.completed ? 'text-green-700' : step.current ? 'text-blue-700' : 'text-gray-500'
              }
            `}
            >
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`
              flex-1 h-0.5
              ${steps[index + 1].completed ? 'bg-green-500' : 'bg-gray-300'}
            `}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

interface FeedbackSectionProps {
  title: string;
  onFeedback: (rating: number, comment: string) => void;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ title, onFeedback }) => {
  const [rating, setRating] = React.useState<number>(0);
  const [comment, setComment] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = () => {
    if (rating > 0) {
      onFeedback(rating, comment);
      setSubmitted(true);
      toast.success('Thank you for your feedback!');
    }
  };

  if (submitted) {
    return (
      <Card className='p-4 bg-green-50 border-green-200'>
        <div className='flex items-center text-green-700'>
          <CheckCircle className='h-5 w-5 mr-2' />
          <span className='font-medium'>Thank you for your feedback!</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className='p-4'>
      <h4 className='font-medium text-gray-900 mb-3'>{title}</h4>

      <div className='space-y-3'>
        <div>
          <div className='text-sm text-gray-600 mb-2'>How helpful was this result?</div>
          <div className='flex space-x-1'>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-1 hover:scale-110 transition-transform ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                <Star className='h-5 w-5 fill-current' />
              </button>
            ))}
          </div>
        </div>

        <div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder='Any additional comments? (optional)'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none'
            rows={2}
          />
        </div>

        <div className='flex justify-end'>
          <Button size='sm' onClick={handleSubmit} disabled={rating === 0}>
            <ThumbsUp className='h-4 w-4 mr-2' />
            Submit Feedback
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default {
  AISuccessHeader,
  ScoreDisplay,
  SkillTag,
  ImprovementItem,
  ActionButtons,
  ProgressIndicator,
  FeedbackSection,
};
