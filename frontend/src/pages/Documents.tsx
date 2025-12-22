import React, { useState } from 'react';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DocumentFilters } from '@/components/documents/DocumentFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Mock Data
const mockDocuments = [
    { id: '1', title: 'Senior Software Engineer Resume', type: 'resume', updatedAt: '2 hours ago', status: 'completed' as const, thumbnailUrl: '' },
    { id: '2', title: 'Tech Corp Cover Letter', type: 'cover-letter', updatedAt: '1 day ago', status: 'draft' as const, thumbnailUrl: '' },
    { id: '3', title: 'Startup Inc KSC Response', type: 'ksc', updatedAt: '3 days ago', status: 'review' as const, thumbnailUrl: '' },
    { id: '4', title: 'Project Manager Resume', type: 'resume', updatedAt: '1 week ago', status: 'completed' as const, thumbnailUrl: '' },
    { id: '5', title: 'General Cover Letter', type: 'cover-letter', updatedAt: '2 weeks ago', status: 'draft' as const, thumbnailUrl: '' },
];

export default function Documents() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredDocs = mockDocuments.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || doc.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const handleEdit = (id: string) => console.log('Edit', id);
    const handleDelete = (id: string) => console.log('Delete', id);
    const handleDownload = (id: string) => console.log('Download', id);

    return (
        <div className="relative">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-2 text-[#E6E1E5] tracking-tight leading-[1.1]">
                    Your <span className="font-light italic text-[#D0BCFF]">Documents</span>
                </h1>
                <p className="text-[#CAC4D0]">Manage your career documents and generate tailored versions</p>
            </div>

            <div className="flex justify-between items-center mb-6">
                {/* Filters */}
                <div className="flex-1">
                    <DocumentFilters
                        onSearch={setSearchQuery}
                        onFilterChange={setActiveFilter}
                        activeFilter={activeFilter}
                    />
                </div>
                <Button className="ml-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New
                </Button>
            </div>

            {/* Grid */}
            {filteredDocs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDocs.map((doc) => (
                        <DocumentCard
                            key={doc.id}
                            {...doc}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onDownload={handleDownload}
                        />
                    ))}
                </div>
            ) : (
                <Card className="border-dashed py-12 text-center bg-surface-container/50">
                    <CardContent>
                        <p className="text-muted-foreground">No documents found matching your criteria.</p>
                        <Button variant="link" onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}>Clear filters</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
