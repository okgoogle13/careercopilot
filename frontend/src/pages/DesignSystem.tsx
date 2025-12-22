import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

const DesignSystem = () => {
    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h1 className="text-4xl font-display font-bold tracking-tight text-primary">Design System</h1>
                <p className="text-muted-foreground text-lg">
                    Electric Alchemist Theme | Component Kitchen Sink
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

                {/* Primary Column */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-border pb-2 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        Primary
                    </h2>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Button</h3>
                        <Button variant="default" className="w-full">Primary Button</Button>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Badge</h3>
                        <Badge variant="default">Primary Badge</Badge>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Input</h3>
                        <Input placeholder="Default Input" />
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Card</h3>
                        <Card>
                            <CardHeader>
                                <CardTitle>Primary Card</CardTitle>
                                <CardDescription>Default card style</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm">
                                Standard container for grouping related content and actions.
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Secondary Column */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-border pb-2 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-secondary"></div>
                        Secondary
                    </h2>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Button</h3>
                        <Button variant="secondary" className="w-full">Secondary Button</Button>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Badge</h3>
                        <Badge variant="secondary">Secondary Badge</Badge>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Input (Filled)</h3>
                        <Input className="bg-secondary/20 border-secondary focus-visible:ring-secondary" placeholder="Secondary Style" />
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Card</h3>
                        <Card className="bg-secondary/10 border-secondary">
                            <CardHeader>
                                <CardTitle>Secondary Card</CardTitle>
                                <CardDescription>Using secondary colors</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm">
                                Alternative card style for less prominent content sections.
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Destructive Column */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-border pb-2 text-destructive flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive"></div>
                        Destructive
                    </h2>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Button</h3>
                        <Button variant="destructive" className="w-full">Destructive Button</Button>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Badge</h3>
                        <Badge variant="destructive">Destructive Badge</Badge>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Input (Error)</h3>
                        <Input className="border-destructive text-destructive placeholder:text-destructive/50 focus-visible:ring-destructive" placeholder="Error State" />
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Card</h3>
                        <Card className="border-destructive/50 bg-destructive/5">
                            <CardHeader>
                                <CardTitle className="text-destructive">Destructive Card</CardTitle>
                                <CardDescription>Warning or critical alerts</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm">
                                Used for displaying errors, warnings, or destructive actions.
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Ghost / Outline Column */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-border pb-2 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border border-current"></div>
                        Ghost / Outline
                    </h2>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Button</h3>
                        <div className="flex flex-col gap-3">
                            <Button variant="outline" className="w-full">Outline Button</Button>
                            <Button variant="ghost" className="w-full">Ghost Button</Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Badge</h3>
                        <Badge variant="outline">Outline Badge</Badge>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Input (Disabled)</h3>
                        <Input disabled placeholder="Disabled Input" />
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Card</h3>
                        <Card className="bg-transparent border-dashed">
                            <CardHeader>
                                <CardTitle>Ghost Card</CardTitle>
                                <CardDescription>Outline / Dashed style</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm">
                                Used for placeholders or optional content areas.
                            </CardContent>
                        </Card>
                    </div>
                </section>

            </div>


            {/* Visual Alignment & Shape System */}
            <section className="space-y-8 pt-12 border-t border-border">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Shape System</h2>
                    <p className="text-muted-foreground">
                        Electric Alchemist v5.0 introduces a variable shape system ("The Leaf" vs "The Tech") to create visual tension.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* SHAPE 1: THE LEAF */}
                    <div className="flex flex-col gap-4">
                        <div className="h-64 w-full bg-surface-container-low border border-border relative overflow-hidden flex items-center justify-center p-8 rounded-leaf">
                            <div className="absolute inset-0 bg-primary/10 bg-noise opacity-50"></div>
                            <div className="relative z-10 text-center space-y-2">
                                <span className="text-xs font-data text-primary uppercase tracking-widest">Hero / Highlight</span>
                                <h3 className="text-2xl text-foreground">The Leaf</h3>
                                <div className="bg-background/50 px-3 py-1 rounded text-xs text-muted-foreground font-mono mt-2">
                                    24px 64px 24px 8px
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-semibold text-primary">Organic Contradiction</h4>
                            <p className="text-sm text-muted-foreground">
                                Used for "Hero" containers. An asymmetric shape that creates visual tension and growth.
                            </p>
                        </div>
                    </div>

                    {/* SHAPE 2: THE CONTAINER */}
                    <div className="flex flex-col gap-4">
                        <div className="h-64 w-full bg-surface-container border border-border flex items-center justify-center p-8 rounded-container-token shadow-sm">
                            <div className="text-center space-y-2">
                                <span className="text-xs font-data text-secondary uppercase tracking-widest">Main Panels</span>
                                <h3 className="text-2xl text-foreground">The Container</h3>
                                <div className="bg-background/50 px-3 py-1 rounded text-xs text-muted-foreground font-mono mt-2">
                                    28px (Stable)
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-semibold text-foreground">Foundation</h4>
                            <p className="text-sm text-muted-foreground">
                                The standard container shape for main content panels, cards, and modal dialogs.
                            </p>
                        </div>
                    </div>

                    {/* SHAPE 3: THE TECH */}
                    <div className="flex flex-col gap-4">
                        <div className="h-64 w-full bg-surface-container-high border border-border flex items-center justify-center p-8 rounded-tech">
                            <div className="text-center space-y-2">
                                <span className="text-xs font-data text-muted-foreground uppercase tracking-widest">Tools / Grid</span>
                                <h3 className="text-2xl text-foreground">The Tech</h3>
                                <div className="bg-background/50 px-3 py-1 rounded text-xs text-muted-foreground font-mono mt-2">
                                    12px (Precise)
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-semibold text-foreground">Utilitarian</h4>
                            <p className="text-sm text-muted-foreground">
                                A tighter radius for inner grid items, tools, and functional components. Provides contrast to the organic shapes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Component Specific Variants Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-border mt-12">
                <div className="space-y-4">

                    <div className="space-y-1">
                        <h2 className="text-xl font-bold">Button Sizes</h2>
                        <p className="text-muted-foreground text-sm">Available size variants for buttons</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 p-6 border rounded-[28px] bg-surface-container">
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                        <Button size="icon" aria-label="Icon">
                            <span className="text-lg">+</span>
                        </Button>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold">Badge Sizes</h2>
                        <p className="text-muted-foreground text-sm">Available size variants for badges</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 p-6 border rounded-[28px] bg-surface-container">
                        <Badge size="sm">Small</Badge>
                        <Badge size="md">Medium</Badge>
                        <Badge size="lg">Large</Badge>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesignSystem;
