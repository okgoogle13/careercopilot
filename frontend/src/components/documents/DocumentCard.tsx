import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, FileText, Download, Trash2, Edit } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface DocumentCardProps {
    id: string;
    title: string;
    type: string;
    updatedAt: string;
    status: 'completed' | 'draft' | 'review';
    thumbnailUrl?: string;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onDownload?: (id: string) => void;
    className?: string;
}

const statusStyles = {
    completed: 'bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20',
    draft: 'bg-muted text-muted-foreground border-border',
    review: 'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 border-yellow-500/20',
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
    id,
    title,
    type,
    updatedAt,
    status,
    thumbnailUrl,
    onEdit,
    onDelete,
    onDownload,
    className,
}) => {
    return (
        <Card
            className={cn(
                "group hover:scale-[1.01] transition-transform duration-200 cursor-pointer overflow-hidden relative hover:z-10",
                className
            )}
        >
            <div className="relative aspect-[3/4] bg-muted w-full border-b border-border">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
                        <FileText className="h-12 w-12 opacity-20" />
                    </div>
                )}

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-sm bg-white/80 backdrop-blur hover:bg-white">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit?.(id)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDownload?.(id)}>
                                <Download className="mr-2 h-4 w-4" /> Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onDelete?.(id)} className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="absolute top-2 left-2">
                    <Badge variant="outline" className={cn("capitalize backdrop-blur-md bg-white/50", statusStyles[status])}>
                        {status}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-4">
                <h3 className="font-heading font-semibold text-lg truncate mb-1" title={title}>{title}</h3>
                <div className="flex justify-between items-center text-xs text-muted-foreground font-body">
                    <span className="capitalize">{type}</span>
                    <span>{updatedAt}</span>
                </div>
            </CardContent>
        </Card>
    );
};
