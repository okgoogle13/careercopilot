import React, { useState } from 'react';
import { JobCard, JobCardProps } from './JobCard';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export interface KanbanColumn {
    id: string;
    title: string;
    status: string;
    items: JobCardProps[];
}

export interface KanbanBoardProps {
    columns: KanbanColumn[];
    onDragEnd?: (result: any) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ columns: initialColumns, onDragEnd }) => {
    const [columns, setColumns] = useState(initialColumns);
    const [draggedItem, setDraggedItem] = useState<{ id: string, sourceColId: string } | null>(null);

    const handleDragStart = (e: React.DragEvent, itemId: string, colId: string) => {
        setDraggedItem({ id: itemId, sourceColId: colId });
        // Set drag image or opacity if needed
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetColId: string) => {
        e.preventDefault();
        if (!draggedItem) return;

        const { id, sourceColId } = draggedItem;
        if (sourceColId === targetColId) {
            setDraggedItem(null);
            return;
        }

        // Find item and move it locally for UI responsiveness
        const newColumns = [...columns];
        const sourceCol = newColumns.find(c => c.id === sourceColId)!;
        const targetCol = newColumns.find(c => c.id === targetColId)!;

        const itemIndex = sourceCol.items.findIndex(i => i.id === id);
        if (itemIndex === -1) return;

        const [item] = sourceCol.items.splice(itemIndex, 1);
        // Update item status
        const updatedItem = { ...item, status: targetCol.status };
        targetCol.items.push(updatedItem);

        setColumns(newColumns);
        setDraggedItem(null);

        // Notify parent is needed
        if (onDragEnd) {
            onDragEnd({ itemId: id, sourceColId, targetColId });
        }
    };

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x min-h-[calc(100vh-200px)]">
            {columns.map((col) => (
                <div
                    key={col.id}
                    className="min-w-[320px] w-[320px] flex-shrink-0 flex flex-col gap-4 rounded-xl bg-surface-container-high/50 p-4"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-heading font-semibold text-foreground">{col.title}</h3>
                        <Badge variant="secondary" className="rounded-full">{col.items.length}</Badge>
                    </div>

                    <div className="flex flex-col gap-3 flex-1">
                        {col.items.map((item) => (
                            <div
                                key={item.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item.id, col.id)}
                                className={cn(
                                    "transition-[opacity,transform] duration-300 ease-out",
                                    draggedItem?.id === item.id ? "opacity-50 scale-95" : "opacity-100"
                                )}
                            >
                                <JobCard
                                    {...item}
                                    variant="compact"
                                    className="bg-surface shadow-sm hover:shadow-md"
                                />
                            </div>
                        ))}
                        {col.items.length === 0 && (
                            <div className="h-24 border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center text-muted-foreground/50 text-sm">
                                Drop here
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
