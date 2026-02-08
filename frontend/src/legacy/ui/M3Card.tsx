import { useMode } from '@/hooks/use-mode';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import * as React from 'react';

const cardVariants = cva(
    'relative overflow-hidden transition-all duration-300',
    {
        variants: {
            variant: {
                filled: 'border-0',
                outlined: 'border',
                glass: 'backdrop-blur-md border',
            },
            mode: {
                'KrDark': '',
                'KrLight': '',
            },
        },
        compoundVariants: [
            // KrDark Mode - Organic & Warm
            {
                mode: 'KrDark',
                variant: 'filled',
                class: 'bg-surface-KrDark-concrete-grey text-on-surface-KrDark-paper-white',
            },
            {
                mode: 'KrDark',
                variant: 'outlined',
                class: 'border-outline-KrDark-sandstone text-on-surface-KrDark-paper-white',
            },
            {
                mode: 'KrDark',
                variant: 'glass',
                class: 'bg-surface-KrDark-glass-medium border-white/10 text-on-surface-KrDark-paper-white',
            },
            // KrDark Mode - Precise & Cool
            {
                mode: 'KrDark',
                variant: 'filled',
                class: 'bg-surface-KrDark-deep-ocean text-on-surface-KrDark-paper-white',
            },
            {
                mode: 'KrDark',
                variant: 'outlined',
                class: 'border-outline-KrDark-steel text-on-surface-KrDark-paper-white',
            },
            {
                mode: 'KrDark',
                variant: 'glass',
                class: 'bg-surface-KrDark-glass-medium border-white/5 text-on-surface-KrDark-paper-white',
            },
        ],
        defaultVariants: {
            variant: 'filled',
            mode: 'KrDark',
        },
    }
);

export interface M3CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
    as?: React.ElementType;
    hoverEffect?: boolean;
}

const M3Card = React.forwardRef<HTMLDivElement, M3CardProps>(
    ({ className, variant, as: Component = 'div', hoverEffect = true, ...props }, ref) => {
        const { mode } = useMode();


        const MotionComponent = motion(Component);

        return (
            <MotionComponent
                ref={ref}
                className={cn(cardVariants({ variant, mode }), className)}
                style={{
                    borderRadius: mode === 'KrDark' || mode === 'KrLight' ? 'var(--radius-stone)' : '8px' // var(--radius-seed) check needed
                }}
                whileHover={hoverEffect ? {
                    y: -4,
                    transition: { type: "spring", stiffness: 500, damping: 27, mass: 1 }
                } : undefined}
                {...props}
            />
        );
    }
);
M3Card.displayName = 'M3Card';

export { cardVariants, M3Card };
export const Stone = M3Card;