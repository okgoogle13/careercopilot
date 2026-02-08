import * as React from 'react';
import { Stone } from './M3Card';
import { cn } from '@/lib/utils';
import { useMode } from '@/hooks/use-mode';

interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    value: string | number;
    trend?: {
        value: number;
        direction: 'up' | 'down' | 'neutral';
        label?: string;
    };
    icon?: React.ReactNode;
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
    ({ className, label, value, trend, icon, ...props }, ref) => {
        const { mode } = useMode();

        const trendColor = trend?.direction === 'up'
            ? (mode === 'KrDark' || mode === 'KrLight' ? 'text-status-KrDark-ghost-gum' : 'text-status-KrDark-clinical-sage')
            : trend?.direction === 'down'
                ? (mode === 'KrDark' || mode === 'KrLight' ? 'text-tertiary-waratah-red' : 'text-status-KrDark-clinical-alert')
                : 'text-secondary-concrete-grey';

        return (
            <Stone
                ref={ref}
                className={cn('p-6 flex flex-col justify-between h-full min-h-[160px]', className)}
                {...props}
            >
                <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium opacity-70 uppercase tracking-wider">{label}</span>
                    {icon && <div className="text-secondary-concrete-grey opacity-80">{icon}</div>}
                </div>

                <div className="mt-auto">
                    <div className={cn(
                        "font-display leading-none mb-2",
                        mode === 'KrDark' || mode === 'KrLight' ? 'text-5xl font-bold tracking-tight' : 'text-4xl font-mono tracking-normal'
                    )}>
                        {value}
                    </div>

                    {trend && (
                        <div className={cn("text-xs flex items-center gap-1", trendColor)}>
                            <span>{trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}</span>
                            <span className="font-bold">{Math.abs(trend.value)}%</span>
                            {trend.label && <span className="opacity-70 ml-1">{trend.label}</span>}
                        </div>
                    )}
                </div>
            </Stone>
        );
    }
);
MetricCard.displayName = 'MetricCard';

export { MetricCard };