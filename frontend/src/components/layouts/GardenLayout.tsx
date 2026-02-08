import React from 'react';

interface GardenLayoutProps {
    children: React.ReactNode;
}

/**
 * GardenLayout - The "Deep Garden" Page Wrapper
 * 
 * Creates an atmospheric background with:
 * - Deep black base (#050505)
 * - Dual gradient blobs (Primary Sage + Tertiary Lavender)
 * - SVG noise texture overlay
 * - Centered content container
 * 
 * @component
 * @example
 * <GardenLayout>
 *   <NativeAnchor variant="gum" anchor="hanging-right" />
 *   <div>Your content here</div>
 * </GardenLayout>
 */
export const GardenLayout: React.FC<GardenLayoutProps> = ({ children }) => {
    return (
        <div className="relative min-h-screen bg-[#050505] overflow-hidden">
            {/* Atmospheric Blobs */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Top-Left: Primary Sage Blob */}
                <div
                    className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-[#B4D8AE] rounded-full blur-[120px] opacity-10 mix-blend-screen"
                    aria-hidden="true"
                />

                {/* Bottom-Right: Tertiary Lavender Blob */}
                <div
                    className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-[#E2D0F7] rounded-full blur-[120px] opacity-10 mix-blend-screen"
                    aria-hidden="true"
                />
            </div>

            {/* SVG Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.04]" aria-hidden="true">
                <svg width="100%" height="100%">
                    <filter id="garden-noise">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.8"
                            numOctaves="4"
                            stitchTiles="stitch"
                        />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#garden-noise)" />
                </svg>
            </div>

            {/* Content Container */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </div>
    );
};

export default GardenLayout;