import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Pen, Trash2 } from 'lucide-react';

export interface ProfileCardProps {
    name: string;
    role: string;
    activeApplications: number;
    atsScore: number;
    lastUpdated: string;
    avatarUrl?: string;
    onEdit?: () => void;
    onDelete?: () => void;
    className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
    name,
    role,
    activeApplications,
    atsScore,
    lastUpdated,
    avatarUrl,
    onEdit,
    onDelete,
    className,
}) => {
    return (
        <Card className={cn("relative overflow-hidden bg-tertiary text-tertiary-foreground", className)}>
            <CardContent className="relative z-10 p-6 flex flex-col gap-6">
                {/* Header with Avatar and Actions */}
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <Avatar
                            className="h-16 w-16 border-2 border-white/20"
                            src={avatarUrl}
                            alt={name}
                            initials={name?.substring(0, 2).toUpperCase()}
                        />
                        <div>
                            <h3 className="font-heading text-xl font-bold">{name}</h3>
                            <p className="font-body text-sm opacity-90">{role}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onEdit}
                            className="h-8 w-8 text-tertiary-foreground hover:bg-white/20"
                        >
                            <Pen className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onDelete}
                            className="h-8 w-8 text-tertiary-foreground hover:bg-white/20 hover:text-red-300"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                            Active Apps
                        </p>
                        <div className="text-2xl font-black font-data">
                            {activeApplications}
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                            ATS Score
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black font-data">{atsScore}%</span>
                            <Progress value={atsScore} className="h-2 w-16 bg-white/20" />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-xs opacity-60 font-mono mt-2">
                    Last Updated: {lastUpdated}
                </div>

            </CardContent>

            {/* Decorative Botanical Layer */}
            <div className="absolute -bottom-5 -right-5 opacity-70 pointer-events-none">
                <svg
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                >
                    <path
                        d="M100 0 C155.228 0 200 44.7715 200 100 C200 155.228 155.228 200 100 200 C44.7715 200 0 155.228 0 100 C0 44.7715 44.7715 0 100 0 Z"
                        fill="currentColor"
                        fillOpacity="0.1"
                    />
                    <path d="M100 20 C140 20 180 60 180 100 S 140 180 100 180 S 20 140 20 100 S 60 20 100 20" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                    <path d="M100 40 C130 40 160 70 160 100 S 130 160 100 160 S 40 130 40 100 S 70 40 100 40" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                </svg>
            </div>
        </Card>
    );
};
