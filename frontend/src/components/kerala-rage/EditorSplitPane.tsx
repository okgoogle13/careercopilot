import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EditorSplitPaneProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  initialSplit?: number;
  className?: string;
}

/**
 * EditorSplitPane
 * 
 * High-interactivity component for side-by-side editing.
 */
export const EditorSplitPane: React.FC<EditorSplitPaneProps> = ({
  leftContent,
  rightContent,
  initialSplit = 50,
  className,
}) => {
  const [split, setSplit] = useState(initialSplit);

  return (
    <div className={cn("flex w-full h-full overflow-hidden bg-asphalt-black shadow-viscous", className)}>
      <div 
        style={{ width: `${split}%` }}
        className="h-full border-r border-white/10 overflow-auto custom-scrollbar"
      >
        {leftContent}
      </div>

      <div className="w-1 bg-wattle-gold/20 hover:bg-wattle-gold/50 cursor-col-resize transition-colors relative z-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-asphalt-black border border-wattle-gold/30 rounded-full flex items-center justify-center pointer-events-none">
          <div className="w-0.5 h-4 bg-wattle-gold/50 rounded-full" />
        </div>
      </div>

      <div 
        style={{ width: `${100 - split}%` }}
        className="h-full overflow-auto custom-scrollbar"
      >
        {rightContent}
      </div>
    </div>
  );
};
