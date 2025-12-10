import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    MapPin,
    DollarSign,
    Clock,
    Briefcase,
    Heart,
    ExternalLink,
    Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface JobMatchCardProps {
    id: string;
    title: string;
    company: string;
    location: string;
    matchPercentage: number;
    salaryRange: string;
    postedDate: string;
    description: string;
    tags: string[];
    isRemote: boolean;
    isFavorited?: boolean;
    onView?: () => void;
    onSave?: () => void;
    className?: string;
}

export const JobMatchCard: React.FC<JobMatchCardProps> = ({
    title,
    company,
    location,
    matchPercentage,
    salaryRange,
    postedDate,
    description,
    tags,
    isRemote,
    isFavorited,
    onView,
    onSave,
    className,
}) => {
    // Helper to determine match color
    const getMatchColor = (percentage: number) => {
        if (percentage >= 90) return 'text-primary';
        if (percentage >= 75) return 'text-secondary';
        return 'text-tertiary';
    };

    return (
        <Card className={cn("overflow-hidden hover:shadow-md transition-shadow duration-300", className)}>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-[1fr_200px] gap-6">

                {/* Main Content */}
                <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div>
                        <div className="flex items-center justify-between md:justify-start gap-4 mb-1">
                            <h3 className="text-xl font-heading font-bold text-foreground">{title}</h3>
                            {isFavorited && <Heart className="h-5 w-5 fill-red-500 text-red-500 md:hidden" />}
                        </div>
                        <div className="text-lg font-body text-muted-foreground mb-4">{company}</div>

                        {/* Meta Tags */}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-body">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {location}
                            </div>
                            <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {salaryRange}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {postedDate}
                            </div>
                            {isRemote && (
                                <Badge variant="secondary" className="rounded-full px-3">Remote Available</Badge>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground font-body line-clamp-2 md:line-clamp-3">
                        {description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="font-normal">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Match Score & Actions */}
                <div className="flex flex-col gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">

                    {/* Match Score */}
                    <div className="bg-surface-container-high/50 rounded-2xl p-4 text-center">
                        <div className={cn("text-4xl font-heading font-black mb-1", getMatchColor(matchPercentage))}>
                            {matchPercentage}%
                        </div>
                        <div className="text-sm font-semibold text-muted-foreground mb-2">Match Score</div>
                        <Progress value={matchPercentage} className="h-2" />
                    </div>

                    <div className="flex flex-col gap-2 mt-auto">
                        <Button onClick={onView} className="w-full">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Listing
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onSave}
                            className={cn("w-full hover:bg-surface-container", isFavorited && "text-red-500 hover:text-red-600")}
                        >
                            <Heart className={cn("mr-2 h-4 w-4", isFavorited && "fill-current")} />
                            {isFavorited ? "Saved" : "Save Job"}
                        </Button>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
};
