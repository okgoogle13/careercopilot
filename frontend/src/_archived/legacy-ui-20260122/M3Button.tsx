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
                gallery: '',
                laboratory: '',
            },
        },
        compoundVariants: [
            // Gallery Mode
            {
                mode: 'gallery',
                variant: 'primary',
                class: 'bg-wattle-gold text-surface-specimen-night hover:bg-primary-wattle-glow border border-transparent',
            },
            {
                mode: 'gallery',
                variant: 'secondary',
                class: 'bg-surface-gallery-glass-medium text-secondary-flannel-flower border-glass-border hover:bg-surface-gallery-elevated',
            },
            // Laboratory Mode
            {
                mode: 'laboratory',
                variant: 'primary',
                class: 'bg-wattle-gold text-surface-specimen-night hover:bg-primary-wattle-glow rounded-sm',
            },
            {
                mode: 'laboratory',
                variant: 'secondary',
                class: 'bg-surface-laboratory-glass-medium text-secondary-flannel-flower border-glass-border rounded-sm hover:bg-surface-laboratory-elevated',
            },
        ],
        defaultVariants: {
            variant: 'primary',
            size: 'default',
            mode: 'gallery',
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

        // Shape logic: Gallery = Organic, Lab = Precise
        // We use inline styles for shape to avoid generic tailwind classes
        const shapeStyle = mode === 'gallery'
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
                    mode === 'gallery' ? 'font-field-note font-semibold tracking-wide' : 'font-annotation uppercase tracking-widest text-[11px]'
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
        const shapeClass = mode === 'gallery' ? 'rounded-[var(--radius-seed)]' : 'rounded-md';

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
