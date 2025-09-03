import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from './input';
import { Button } from './Button';
import { Progress } from './progress';

export interface PasswordStrength {
  score: number;
  feedback: string[];
  requirements: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  showStrength?: boolean;
  showRequirements?: boolean;
  showToggle?: boolean;
  minLength?: number;
  requireLowercase?: boolean;
  requireUppercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
  className?: string;
}

function calculatePasswordStrength(
  password: string,
  minLength = 8,
  requireLowercase = true,
  requireUppercase = true,
  requireNumbers = true,
  requireSpecialChars = true
): PasswordStrength {
  const requirements = {
    length: password.length >= minLength,
    lowercase: requireLowercase ? /[a-z]/.test(password) : true,
    uppercase: requireUppercase ? /[A-Z]/.test(password) : true,
    number: requireNumbers ? /\d/.test(password) : true,
    special: requireSpecialChars ? /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) : true,
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;
  const totalRequirements = Object.values(requirements).length;

  let score = 0;
  const feedback: string[] = [];

  // Base score from meeting requirements
  score = (metRequirements / totalRequirements) * 60;

  // Bonus points for length
  if (password.length >= 12) score += 15;
  else if (password.length >= 10) score += 10;
  else if (password.length >= 8) score += 5;

  // Bonus for complexity
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.8) score += 10;
  else if (uniqueChars >= password.length * 0.6) score += 5;

  // Bonus for mixed case and special patterns
  if (/[a-z].*[A-Z]|[A-Z].*[a-z]/.test(password)) score += 5;
  if (/\d.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]|[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*\d/.test(password)) score += 5;

  // Generate feedback
  if (!requirements.length) {
    feedback.push(`Use at least ${minLength} characters`);
  }
  if (!requirements.lowercase && requireLowercase) {
    feedback.push('Add lowercase letters');
  }
  if (!requirements.uppercase && requireUppercase) {
    feedback.push('Add uppercase letters');
  }
  if (!requirements.number && requireNumbers) {
    feedback.push('Add numbers');
  }
  if (!requirements.special && requireSpecialChars) {
    feedback.push('Add special characters');
  }

  if (password.length < 8) {
    feedback.push('Password is too short');
  } else if (score >= 80) {
    feedback.push('Strong password');
  } else if (score >= 60) {
    feedback.push('Good password - consider adding more complexity');
  } else if (score >= 40) {
    feedback.push('Fair password - needs improvement');
  } else if (password.length > 0) {
    feedback.push('Weak password - please strengthen');
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    feedback,
    requirements,
  };
}

export function PasswordInput({
  value = '',
  onChange,
  showStrength = false,
  showRequirements = false,
  showToggle = true,
  minLength = 8,
  requireLowercase = true,
  requireUppercase = true,
  requireNumbers = true,
  requireSpecialChars = true,
  className,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const strength = useMemo(() =>
    calculatePasswordStrength(
      value,
      minLength,
      requireLowercase,
      requireUppercase,
      requireNumbers,
      requireSpecialChars
    ),
    [value, minLength, requireLowercase, requireUppercase, requireNumbers, requireSpecialChars]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const getStrengthColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStrengthText = (score: number) => {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    if (score > 0) return 'Weak';
    return '';
  };

  const shouldShowStrengthIndicator = showStrength && (isFocused || value.length > 0);
  const shouldShowRequirementsList = showRequirements && (isFocused || value.length > 0);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <Input
          {...props}
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            showToggle && 'pr-10',
            className
          )}
        />

        {showToggle && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={toggleVisibility}
            tabIndex={-1}
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>

      {shouldShowStrengthIndicator && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Progress value={strength.score} className="flex-1 h-2" />
            <span className={cn(
              'text-sm font-medium min-w-[60px]',
              strength.score >= 80 && 'text-green-600',
              strength.score >= 60 && strength.score < 80 && 'text-yellow-600',
              strength.score >= 40 && strength.score < 60 && 'text-orange-600',
              strength.score < 40 && strength.score > 0 && 'text-red-600',
              strength.score === 0 && 'text-muted-foreground'
            )}>
              {getStrengthText(strength.score)}
            </span>
          </div>

          {strength.feedback.length > 0 && (
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                {strength.feedback.join('. ')}
              </div>
            </div>
          )}
        </div>
      )}

      {shouldShowRequirementsList && (
        <div className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">Password requirements:</div>
          <div className="space-y-1">
            <RequirementItem
              met={strength.requirements.length}
              text={`At least ${minLength} characters`}
            />
            {requireLowercase && (
              <RequirementItem
                met={strength.requirements.lowercase}
                text="One lowercase letter"
              />
            )}
            {requireUppercase && (
              <RequirementItem
                met={strength.requirements.uppercase}
                text="One uppercase letter"
              />
            )}
            {requireNumbers && (
              <RequirementItem
                met={strength.requirements.number}
                text="One number"
              />
            )}
            {requireSpecialChars && (
              <RequirementItem
                met={strength.requirements.special}
                text="One special character"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface RequirementItemProps {
  met: boolean;
  text: string;
}

function RequirementItem({ met, text }: RequirementItemProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground" />
      )}
      <span className={cn(
        met ? 'text-green-700' : 'text-muted-foreground'
      )}>
        {text}
      </span>
    </div>
  );
}