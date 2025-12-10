import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Building2, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export interface JobCardProps {
    id: string;
    title: string;
    company: string;
    location: string;
    aiMatchScore?: number;
    status: string;
    postedDate?: string;
    onClick?: () => void;
    className?: string;
    variant?: 'default' | 'compact' | 'featured';
}

export const JobCard: React.FC<JobCardProps> = ({
    title,
    company,
    location,
    aiMatchScore,
    status,
    postedDate,
    onClick,
    className,
    variant = 'default',
}) => {
    return (
        <Card
            className={cn(
                "cursor-pointer transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] hover:scale-[1.01] active:scale-98 transform-gpu subpixel-antialiased group relative hover:z-10",
                variant === 'compact' ? "p-4" : "p-6",
                variant === 'featured' && "border-2 border-primary/20 bg-primary/5",
                className
            )}
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className={cn("font-heading font-bold text-foreground group-hover:text-primary transition-colors", variant === 'compact' ? "text-sm" : "text-lg")}>
                        {title}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                        <Building2 className="h-3 w-3" />
                        <span>{company}</span>
                    </div>
                </div>
                {aiMatchScore !== undefined && (
                    <div className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-bold",
                        aiMatchScore > 80 ? "bg-green-500/10 text-green-500" : "bg-secondary/10 text-secondary-foreground"
                    )}>
                        {aiMatchScore}%
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2 mt-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate max-w-[150px]">{location}</span>
                </div>
                {postedDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{postedDate}</span>
                    </div>
                )}
            </div>

            {variant !== 'compact' && (
                <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
                    <Badge variant="outline" className="text-xs font-normal">
                        {status}
                    </Badge>
                </div>
            )}
        </Card>
    );
};
