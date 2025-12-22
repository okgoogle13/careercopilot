import React from 'react';
import { Card, Badge, Button } from '@/components/electric';
import { Building, Calendar, MapPin, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

export interface ApplicationCardProps {
    id: string;
    jobTitle: string;
    companyName: string;
    status: 'draft' | 'applied' | 'interview' | 'offer' | 'rejected' | 'accepted' | 'archived';
    location?: string;
    appliedDate?: string | Date;
    onView?: (id: string) => void;
    className?: string;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
    id,
    jobTitle,
    companyName,
    status,
    location,
    appliedDate,
    onView,
    className,
}) => {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'offer':
            case 'accepted':
                return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
            case 'interview':
                return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
            case 'rejected':
            case 'archived':
                return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
            case 'applied':
                return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
        }
    };

    return (
        <Card
            className={`p-5 transition-shadow hover:shadow-md ${className || ''}`}
            interactive={true}
            onClick={() => onView?.(id)}
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-bold text-on-surface mb-1 line-clamp-1">{jobTitle}</h3>
                    <div className="flex items-center text-on-surface-variant text-sm">
                        <Building className="w-4 h-4 mr-1.5" />
                        <span className="font-medium">{companyName}</span>
                    </div>
                </div>
                <Badge variant="default" className={`capitalize ${getStatusStyles(status)}`}>
                    {status}
                </Badge>
            </div>

            <div className="flex items-center justify-between mt-4 text-xs text-on-surface-variant">
                <div className="flex gap-4">
                    {location && (
                        <div className="flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            {location}
                        </div>
                    )}
                    {appliedDate && (
                        <div className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            {appliedDate instanceof Date ? format(appliedDate, 'MMM d, yyyy') : appliedDate}
                        </div>
                    )}
                </div>

                {/* Placeholder for future actions menu */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Add dropdown menu logic here
                    }}
                >
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    );
};
