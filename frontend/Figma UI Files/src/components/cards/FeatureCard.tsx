import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  ArrowRight, 
  ExternalLink, 
  Star, 
  Clock,
  Check,
  Lock,
  Sparkles,
  Info,
  ChevronRight
} from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ComponentType<any>;
  iconColor?: string;
  status?: 'available' | 'coming-soon' | 'premium' | 'new' | 'beta';
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  onClick?: () => void;
  onLearnMore?: () => void;
  href?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  features?: string[];
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  iconColor = 'text-brand-primary',
  status = 'available',
  variant = 'default',
  onClick,
  onLearnMore,
  href,
  badge,
  features = [],
  disabled = false,
  loading = false,
  className = '',
  children
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'coming-soon':
        return (
          <Badge variant="secondary" className="bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20">
            <Clock className="w-3 h-3 mr-1" />
            Coming Soon
          </Badge>
        );
      case 'premium':
        return (
          <Badge variant="secondary" className="bg-brand-tertiary/10 text-brand-tertiary border-brand-tertiary/20">
            <Star className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        );
      case 'new':
        return (
          <Badge variant="secondary" className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 pulse-ai">
            <Sparkles className="w-3 h-3 mr-1" />
            New
          </Badge>
        );
      case 'beta':
        return (
          <Badge variant="outline" className="border-brand-secondary text-brand-secondary">
            Beta
          </Badge>
        );
      case 'available':
      default:
        return null;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'coming-soon':
        return <Clock className="w-4 h-4 text-brand-secondary" />;
      case 'premium':
        return <Lock className="w-4 h-4 text-brand-tertiary" />;
      case 'new':
        return <Sparkles className="w-4 h-4 text-brand-primary" />;
      case 'beta':
        return <Info className="w-4 h-4 text-brand-secondary" />;
      case 'available':
      default:
        return <Check className="w-4 h-4 text-brand-primary" />;
    }
  };

  const isClickable = (onClick || href) && !disabled && status !== 'coming-soon';

  // Loading state
  if (loading) {
    return (
      <Card className={`
        p-4 animate-pulse 
        ${variant === 'compact' ? 'p-3' : ''}
        ${className}
      `}>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-surface-container-high rounded-lg shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface-container-high rounded w-3/4"></div>
              <div className="h-3 bg-surface-container-high rounded w-full"></div>
            </div>
          </div>
          {variant === 'detailed' && (
            <div className="space-y-2">
              <div className="h-3 bg-surface-container-high rounded w-5/6"></div>
              <div className="h-3 bg-surface-container-high rounded w-4/6"></div>
            </div>
          )}
          <div className="h-8 bg-surface-container-high rounded w-24"></div>
        </div>
      </Card>
    );
  }

  const cardClasses = `
    transition-all duration-300 group
    ${isClickable ? 'cursor-pointer card-interactive' : 'card-surface'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${variant === 'compact' ? 'p-3' : 'p-4'}
    ${variant === 'minimal' ? 'p-3 bg-transparent border-none shadow-none' : ''}
    ${className}
  `;

  const handleClick = () => {
    if (isClickable) {
      if (href) {
        window.open(href, '_blank');
      } else if (onClick) {
        onClick();
      }
    }
  };

  return (
    <Card className={cardClasses} onClick={handleClick}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          {Icon && (
            <div className={`
              flex items-center justify-center rounded-lg bg-surface-container-high shrink-0
              ${variant === 'compact' ? 'w-8 h-8' : 'w-10 h-10'}
              ${disabled ? 'opacity-50' : ''}
            `}>
              <Icon className={`
                ${iconColor}
                ${variant === 'compact' ? 'w-4 h-4' : 'w-5 h-5'}
              `} />
            </div>
          )}

          {/* Title and Badge */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className={`
                font-medium text-on-surface leading-tight
                ${variant === 'compact' ? 'text-sm' : 'text-base'}
              `}>
                {title}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                {badge && (
                  <Badge variant={badge.variant || 'secondary'}>
                    {badge.text}
                  </Badge>
                )}
                {getStatusBadge()}
              </div>
            </div>
            
            <p className={`
              text-on-surface-variant leading-relaxed
              ${variant === 'compact' ? 'text-xs' : 'text-sm'}
            `}>
              {description}
            </p>
          </div>
        </div>

        {/* Features List */}
        {features.length > 0 && variant === 'detailed' && (
          <div className="space-y-2">
            {features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-on-surface-variant">
                <Check className="w-3 h-3 text-brand-primary shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
            {features.length > 3 && (
              <p className="text-xs text-on-surface-variant ml-5">
                +{features.length - 3} more features
              </p>
            )}
          </div>
        )}

        {/* Additional Content */}
        {children && (
          <div className="border-t border-outline-variant pt-4">
            {children}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={`
              text-on-surface-variant capitalize
              ${variant === 'compact' ? 'text-xs' : 'text-sm'}
            `}>
              {status.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onLearnMore && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onLearnMore();
                }}
                className="text-xs hover:text-brand-primary hover:bg-brand-primary/10"
              >
                Learn More
              </Button>
            )}
            
            {isClickable && (
              <div className="flex items-center gap-1 text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                {href ? (
                  <>
                    <ExternalLink className="w-3 h-3" />
                    <span className="text-xs">Open</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs">
                      {variant === 'compact' ? 'Go' : 'Get Started'}
                    </span>
                    <ChevronRight className="w-3 h-3" />
                  </>
                )}
              </div>
            )}

            {status === 'coming-soon' && (
              <Button 
                size="sm" 
                variant="outline" 
                disabled
                className="text-xs opacity-50"
              >
                Coming Soon
              </Button>
            )}

            {status === 'premium' && isClickable && (
              <Button 
                size="sm" 
                className="text-xs btn-gradient"
              >
                Upgrade
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      {status === 'new' && variant !== 'minimal' && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
      )}
    </Card>
  );
};

// Pre-configured variants for common use cases
export const CompactFeatureCard: React.FC<Omit<FeatureCardProps, 'variant'>> = (props) => (
  <FeatureCard {...props} variant="compact" />
);

export const DetailedFeatureCard: React.FC<Omit<FeatureCardProps, 'variant'>> = (props) => (
  <FeatureCard {...props} variant="detailed" />
);

export const MinimalFeatureCard: React.FC<Omit<FeatureCardProps, 'variant'>> = (props) => (
  <FeatureCard {...props} variant="minimal" />
);

export default FeatureCard;