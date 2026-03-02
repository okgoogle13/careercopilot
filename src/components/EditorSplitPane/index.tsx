import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface EditorSplitPaneProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  initialSplit?: number; // percentage
  className?: string;
}

/**
 * EditorSplitPane
 * 
 * A high-interactivity component for side-by-side editing and preview.
 * Used in "The Workshop" for resume tuning and cover letter generation.
 * 
 * Design:
 * - Viscous divider bar (Agitprop aesthetics).
 * - Smooth resizing transitions.
 * - Blueprint-grid background option.
 */
export const EditorSplitPane: React.FC<EditorSplitPaneProps> = ({
  leftContent,
  rightContent,
  initialSplit = 50,
  className,
}) => {
  const [split, setSplit] = useState(initialSplit);

  // Note: True resizing would need mouse event listeners. 
  // For this design-first implementation, we focus on the structure and styling.

  return (
    <div className={cn("flex w-full h-full overflow-hidden bg-charcoal-void shadow-viscous", className)}>
      {/* Left Pane */}
      <div 
        style={{ width: `${split}%` }}
        className="h-full border-r border-white/10 overflow-auto custom-scrollbar"
      >
        {leftContent}
      </div>

      {/* Viscous Divider */}
      <div className="w-1 bg-wattle-gold/20 hover:bg-wattle-gold/50 cursor-col-resize transition-colors relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-charcoal-void border border-wattle-gold/30 rounded-full flex items-center justify-center pointer-events-none">
          <div className="w-0.5 h-4 bg-wattle-gold/50 rounded-full" />
        </div>
      </div>

      {/* Right Pane */}
      <div 
        style={{ width: `${100 - split}%` }}
        className="h-full overflow-auto custom-scrollbar bg-blueprint-grid/5"
      >
        {rightContent}
      </div>
    </div>
  );
};
