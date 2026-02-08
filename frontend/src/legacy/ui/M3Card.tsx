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
                kr-dark: '',
                kr-dark: '',
            },
        },
        compoundVariants: [
            // kr-dark Mode - Organic & Warm
            {
                mode: 'kr-dark',
                variant: 'filled',
                class: 'bg-surface-kr-dark-concrete-grey text-on-surface-kr-dark-paper-white',
            },
            {
                mode: 'kr-dark',
                variant: 'outlined',
                class: 'border-outline-kr-dark-sandstone text-on-surface-kr-dark-paper-white',
            },
            {
                mode: 'kr-dark',
                variant: 'glass',
                class: 'bg-surface-kr-dark-glass-medium border-white/10 text-on-surface-kr-dark-paper-white',
            },
            // kr-dark Mode - Precise & Cool
            {
                mode: 'kr-dark',
                variant: 'filled',
                class: 'bg-surface-kr-dark-deep-ocean text-on-surface-kr-dark-paper-white',
            },
            {
                mode: 'kr-dark',
                variant: 'outlined',
                class: 'border-outline-kr-dark-steel text-on-surface-kr-dark-paper-white',
            },
            {
                mode: 'kr-dark',
                variant: 'glass',
                class: 'bg-surface-kr-dark-glass-medium border-white/5 text-on-surface-kr-dark-paper-white',
            },
        ],
        defaultVariants: {
            variant: 'filled',
            mode: 'kr-dark',
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
                    borderRadius: mode === 'kr-dark' ? 'var(--radius-stone)' : '8px' // var(--radius-seed) check needed
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
