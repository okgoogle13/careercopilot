import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMode } from '@/hooks/use-mode';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:size-4] [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                primary: 'text-on-primary shadow-standard',
                secondary: 'shadow-subtle border',
                tertiary: 'hover:bg-accent hover:text-accent-foreground',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-5 py-2',
                sm: 'h-8 px-4 text-xs',
                lg: 'h-12 px-8 text-base',
                icon: 'size-10',
            },
            mode: {
                kr-dark: '',
                kr-dark: '',
            },
        },
        compoundVariants: [
            // kr-dark Mode
            {
                mode: 'kr-dark',
                variant: 'primary',
                class: 'bg-wattle-gold text-surface-asphalt-black hover:bg-primary-wattle-glow border border-transparent',
            },
            {
                mode: 'kr-dark',
                variant: 'secondary',
                class: 'bg-surface-kr-dark-glass-medium text-secondary-concrete-grey border-glass-border hover:bg-surface-kr-dark-elevated',
            },
            // kr-dark Mode
            {
                mode: 'kr-dark',
                variant: 'primary',
                class: 'bg-wattle-gold text-surface-asphalt-black hover:bg-primary-wattle-glow rounded-sm',
            },
            {
                mode: 'kr-dark',
                variant: 'secondary',
                class: 'bg-surface-kr-dark-glass-medium text-secondary-concrete-grey border-glass-border rounded-sm hover:bg-surface-kr-dark-elevated',
            },
        ],
        defaultVariants: {
            variant: 'primary',
            size: 'default',
            mode: 'kr-dark',
        },
    }
);

export interface M3ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const M3Button = React.forwardRef<HTMLButtonElement, M3ButtonProps>(
    ({ className, variant, size, asChild: _asChild = false, ...props }, ref) => {
        const { mode } = useMode();

        // Shape logic: kr-dark = Organic, Lab = Precise
        // We use inline styles for shape to avoid generic tailwind classes
        const shapeStyle = mode === 'kr-dark'
            ? { borderRadius: 'var(--radius-leaf)' }
            : { borderRadius: '4px' }; // Precise

        const MotionButton = motion.button;

        return (
            <MotionButton
                ref={ref}
                className={cn(buttonVariants({ variant, size, mode }), className)}
                style={shapeStyle}
                whileHover={{
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                whileTap={{ scale: 0.98 }}
                {...(props as any)}
            >
                <span className={cn(
                    "relative",
                    mode === 'kr-dark' ? 'font-field-note font-semibold tracking-wide' : 'font-annotation uppercase tracking-widest text-[11px]'
                )}>
                    {props.children}
                </span>
            </MotionButton>
        );
    }
);
M3Button.displayName = 'M3Button';

export interface M3IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    ariaLabel: string;
    size?: 'small' | 'medium';
    color?: 'primary' | 'secondary' | 'warning' | 'error';
}

export const M3IconButton = React.forwardRef<HTMLButtonElement, M3IconButtonProps>(
    ({ icon, ariaLabel, size = 'medium', color = 'primary', className, ...props }, ref) => {
        const { mode } = useMode();
        const sizeClass = size === 'small' ? 'h-8 w-8' : 'h-10 w-10';
        const colorClass =
            color === 'secondary'
                ? 'bg-secondary text-on-secondary'
                : color === 'warning'
                    ? 'bg-warning text-on-warning'
                    : color === 'error'
                        ? 'bg-error text-on-error'
                        : 'bg-primary text-on-primary';
        const shapeClass = mode === 'kr-dark' ? 'rounded-[var(--radius-seed)]' : 'rounded-md';

        return (
            <button
                ref={ref}
                type="button"
                aria-label={ariaLabel}
                className={cn(
                    'inline-flex items-center justify-center shadow-subtle transition-colors',
                    sizeClass,
                    colorClass,
                    shapeClass,
                    className
                )}
                {...props}
            >
                {icon}
            </button>
        );
    }
);
M3IconButton.displayName = 'M3IconButton';

export { M3Button, buttonVariants };
