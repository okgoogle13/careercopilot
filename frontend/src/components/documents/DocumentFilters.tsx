import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface FilterOption {
    label: string;
    value: string;
}

interface DocumentFiltersProps {
    onSearch: (query: string) => void;
    onFilterChange: (value: string) => void;
    activeFilter: string;
    className?: string;
}

const filterOptions: FilterOption[] = [
    { label: 'All Documents', value: 'all' },
    { label: 'Resumes', value: 'resume' },
    { label: 'Cover Letters', value: 'cover-letter' },
    { label: 'KSC Responses', value: 'ksc' },
];

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({
    onSearch,
    onFilterChange,
    activeFilter,
    className
}) => {
    return (
        <div className={cn("flex flex-col md:flex-row gap-4 items-center justify-between", className)}>
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search documents..."
                    className="pl-9 rounded-full bg-surface-container-high border-transparent focus-visible:ring-primary/20"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {filterOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onFilterChange(option.value)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                            activeFilter === option.value
                                ? "bg-primary/10 text-primary hover:bg-primary/20"
                                : "bg-surface-container-low text-muted-foreground hover:bg-surface-container hover:text-foreground"
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
