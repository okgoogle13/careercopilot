import * as React from 'react';
import { cva } from 'class-variance-authority';
import { M3Card } from './M3Card';
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
            ? (mode === 'gallery' ? 'text-status-gallery-ghost-gum' : 'text-status-laboratory-clinical-sage')
            : trend?.direction === 'down'
                ? (mode === 'gallery' ? 'text-tertiary-waratah-crimson' : 'text-status-laboratory-clinical-alert')
                : 'text-secondary-flannel-flower';

        return (
            <M3Card
                ref={ref}
                className={cn('p-6 flex flex-col justify-between h-full min-h-[160px]', className)}
                {...props}
            >
                <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium opacity-70 uppercase tracking-wider">{label}</span>
                    {icon && <div className="text-secondary-flannel-flower opacity-80">{icon}</div>}
                </div>

                <div className="mt-auto">
                    <div className={cn(
                        "font-display leading-none mb-2",
                        mode === 'gallery' ? 'text-5xl font-bold tracking-tight' : 'text-4xl font-mono tracking-normal'
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
            </M3Card>
        );
    }
);
MetricCard.displayName = 'MetricCard';

export { MetricCard };
