
import React from 'react';
import { cn } from '../../lib/utils';

export interface LeafProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The structural role of this text block.
     * - Hero: The kr-flower Composition (Vine + Trunk)
     * - Title: Section headers (Bloom)
     * - Body: Standard content (Leaf)
     * - Data: Monospace metrics (JetBrains)
     */
    role?: 'hero' | 'title' | 'body' | 'data';

    /**
     * The primary text content.
     */
    children: React.ReactNode;

    /**
     * Optional decorative label overlay (for kr-flower).
     */
    label?: string;

    /**
    * The semantic HTML tag to use.
    * Defaults to appropriate tag for role (h1, h2, p, code).
    */
    as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div' | 'code';
}

/**
 * **THE LEAF**
 * 
 * The fundamental unit of content.
 * Encapsulates the Federation Typography Stack (Vine, Trunk, Bloom, Leaf, Mono).
 */
export const Leaf = React.forwardRef<HTMLDivElement, LeafProps>(
    ({ className, role = 'body', label, children, as, ...props }, ref) => {

        // kr-flower Composition Logic (Hero)
        if (role === 'hero') {
            return (
                <div ref={ref} className={cn("kr-flower-composition relative py-4", className)} {...props}>
                    {/* The Trunk (Base) */}
                    <h1 className="kr-flower-trunk text-7xl md:text-9xl tracking-tight text-white mb-2 z-10 relative">
                        {children}
                    </h1>

                    {/* The Vine (Overlay) */}
                    {label && (
                        <span className="kr-flower-vine absolute -top-2 -left-4 text-4xl md:text-6xl text-primary mix-blend-exclusion z-20">
                            {label}
                        </span>
                    )}
                </div>
            );
        }

        // Determine default tag
        const Component = as || (role === 'title' ? 'h2' : role === 'data' ? 'code' : 'p');

        // Mapped Styles
        const styles = {
            title: "text-bloom text-2xl md:text-4xl text-text-primary mb-4",
            body: "text-leaf text-base md:text-lg text-text-secondary leading-relaxed max-w-prose",
            data: "text-mono text-sm tracking-widest text-primary/80 uppercase bg-surface-elevated/50 px-2 py-1 rounded-seed",
            hero: "", // Handled above
        };

        return (
            <Component
                ref={ref as any}
                className={cn(styles[role], className)}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

Leaf.displayName = "Leaf";
