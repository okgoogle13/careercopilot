import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateProfileCardProps {
    onClick?: () => void;
    className?: string;
}

export const CreateProfileCard: React.FC<CreateProfileCardProps> = ({ onClick, className }) => {
    return (
        <Card
            className={cn(
                "relative overflow-hidden border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group flex flex-col items-center justify-center min-h-[280px]",
                className
            )}
            onClick={onClick}
        >
            <CardContent className="flex flex-col items-center gap-4 p-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Plus className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                    <h3 className="font-heading text-xl font-bold text-primary mb-1">Create New Profile</h3>
                    <p className="font-body text-sm text-muted-foreground">Tailor your resume for a new role</p>
                </div>
            </CardContent>
        </Card>
    );
};
