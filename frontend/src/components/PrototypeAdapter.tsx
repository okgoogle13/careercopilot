import React from 'react';
import { Strike } from './ui/Strike';
import { Placard } from './ui/Placard';
import { ScaffoldInput, ScaffoldArea } from './ui/ScaffoldInput';
import { Megaphone } from './ui/Megaphone';
import { StatusBadge } from './ui/StatusBadge';
import { PageHeader } from './shared/PageHeader';
import { Loader2 } from 'lucide-react';

// --- Buttons ---
export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick: () => void;
  variant?: 'strike' | 'march' | 'tonal';
  disabled?: boolean;
  isLoading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onClick,
  variant = 'strike',
  disabled,
  isLoading,
  ...props
}) => {
  const mappedVariant =
    variant === 'strike' ? 'primary' : variant === 'march' ? 'secondary' : 'ghost';
  return (
    <Strike
      onClick={onClick}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      variant={mappedVariant}
      size="md"
      {...props}
    >
      {label}
    </Strike>
  );
};

// --- Cards ---
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  ...props
}) => {
  return (
    <Placard
      elevation={hoverEffect ? 'raised' : 'flat'}
      className={className}
      {...props}
    >
      {children}
    </Placard>
  );
};

// --- Inputs ---
export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  ...props
}) => {
  return (
    <ScaffoldInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type}
      error={!!error}
      errorMessage={error}
      fullWidth
      variant="filled"
      {...props}
    />
  );
};

export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'size'
> {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  ...props
}) => {
  return (
    <ScaffoldArea
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={!!error}
      errorMessage={error}
      fullWidth
      variant="filled"
      rows={6}
      {...props}
    />
  );
};

// --- Feedback & Modals ---
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Megaphone
      open={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="2xl"
    >
      {children}
    </Megaphone>
  );
};

export interface BadgeProps {
  label: string;
  variant?: 'default' | 'warning' | 'success' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default' }) => {
  const mappedVariant =
    variant === 'success'
      ? 'success'
      : variant === 'danger'
        ? 'error'
        : variant === 'warning'
          ? 'warning'
          : 'neutral';
  return (
    <StatusBadge
      label={label}
      variant={mappedVariant}
      showDot={variant !== 'default'}
    />
  );
};

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <PageHeader
        title={title}
        description={subtitle}
      />
    </div>
  );
};

export interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = 'Processing...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-[var(--sys-color-inkGold-base)]" />
      <h2 className="text-xl font-display font-bold text-[var(--sys-color-paperWhite-base)] uppercase tracking-tight">
        {message}
      </h2>
    </div>
  );
};
