import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, MoreHorizontal, Calendar, Building2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const ApplicationTracker = () => {
    const [view, setView] = useState('kanban'); // 'kanban' or 'list'

    const applications = [
        {
            id: 1,
            role: "Senior Frontend Engineer",
            company: "TechCorp",
            status: "Interview",
            date: "2024-03-20",
            location: "Remote"
        },
        {
            id: 2,
            role: "Product Designer",
            company: "DesignHub",
            status: "Applied",
            date: "2024-03-18",
            location: "San Francisco, CA"
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Application Tracker</h1>
                    <p className="text-muted-foreground">Manage and track your job applications across different stages.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setView('list')} className={view === 'list' ? 'bg-accent' : ''}>List</Button>
                    <Button variant="outline" size="sm" onClick={() => setView('kanban')} className={view === 'kanban' ? 'bg-accent' : ''}>Board</Button>
                    <Button className="gap-2">
                        <Plus size={16} /> New Application
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <Card className="p-4 bg-surface-container-low border-border/50">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input placeholder="Search applications..." className="pl-10 bg-background border-border" />
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Filter size={16} /> Filters
                    </Button>
                </div>
            </Card>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((app) => (
                    <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer group bg-card">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                    <Building2 size={24} />
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                    <MoreHorizontal size={16} />
                                </Button>
                            </div>

                            <div className="space-y-2 mb-4">
                                <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">{app.role}</h3>
                                <p className="text-muted-foreground font-medium">{app.company}</p>
                            </div>

                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} />
                                    <span>{app.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    <span>Applied: {app.date}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary`}>
                                    {app.status}
                                </span>
                                <span className="text-xs text-muted-foreground">Updated 2d ago</span>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ApplicationTracker;
