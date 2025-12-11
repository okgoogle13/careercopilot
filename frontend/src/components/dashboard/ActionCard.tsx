import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActionCardProps {
    title: string;
    description: string;
    count?: number;
    icon: React.ReactNode;
    actionLabel: string;
    onAction: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'tertiary';
}

export const ActionCard: React.FC<ActionCardProps> = ({
    title,
    description,
    count,
    icon,
    actionLabel,
    onAction,
    className,
    variant = 'primary',
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary': return 'bg-primary/5 border border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/30 transition-colors';
            case 'secondary': return 'bg-secondary/5 border border-secondary/20 text-secondary hover:bg-secondary/10 hover:border-secondary/30 transition-colors';
            case 'tertiary': return 'bg-tertiary/5 border border-tertiary/20 text-tertiary hover:bg-tertiary/10 hover:border-tertiary/30 transition-colors';
            default: return 'bg-primary/5 border border-primary/20 text-primary';
        }
    };

    return (
        <Card className={cn("relative hover:z-10 p-6 flex flex-col h-full", className)}>
            <div className="flex items-start justify-between mb-4">
                <div className={cn("p-3 rounded-xl", getVariantStyles())}>
                    {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6" })}
                </div>
                {count !== undefined && (
                    <span className="text-3xl font-black font-data opacity-20">{count}</span>
                )}
            </div>

            <div className="flex-1 mb-6">
                <h3 className="text-lg font-heading font-bold mb-2">{title}</h3>
                <p className="font-body text-sm text-muted-foreground">{description}</p>
            </div>

            <Button
                variant="outline"
                onClick={onAction}
                className="w-full justify-between group transition-all duration-200 ease-in-out active:scale-[0.98]"
            >
                {actionLabel}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
        </Card>
    );
};
