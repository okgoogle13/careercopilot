import React, { forwardRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  showHandle?: boolean;
  snapPoints?: number[];
  initialSnap?: number;
  className?: string;
}

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    {
      open,
      onOpenChange,
      children,
      title,
      description,
      showHandle = true,
      snapPoints = [0.9, 0.5],
      initialSnap = 0,
      className = '',
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [currentSnap, setCurrentSnap] = useState(initialSnap);
    const [startY, setStartY] = useState(0);
    const [translateY, setTranslateY] = useState(0);

    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [open]);

    const handleDragStart = (clientY: number) => {
      setIsDragging(true);
      setStartY(clientY);
    };

    const handleDragMove = (clientY: number) => {
      if (!isDragging) return;
      const diff = clientY - startY;
      if (diff > 0) {
        setTranslateY(diff);
      }
    };

    const handleDragEnd = () => {
      setIsDragging(false);

      // If dragged down more than 100px, close
      if (translateY > 100) {
        onOpenChange(false);
      } else {
        // Snap to nearest point
        const windowHeight = window.innerHeight;
        const currentPosition = translateY / windowHeight;

        let nearestSnap = currentSnap;
        let minDiff = Infinity;

        snapPoints.forEach((snap, index) => {
          const diff = Math.abs((1 - snap) * windowHeight - translateY);
          if (diff < minDiff) {
            minDiff = diff;
            nearestSnap = index;
          }
        });

        setCurrentSnap(nearestSnap);
      }

      setTranslateY(0);
      setStartY(0);
    };

    if (!open) return null;

    const height = `${snapPoints[currentSnap] * 100}%`;

    return (
      <>
        {/* Backdrop */}
        <div
          onClick={() => onOpenChange(false)}
          className={`
            fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
            transition-opacity duration-300
            ${open ? 'opacity-100' : 'opacity-0'}
          `}
        />

        {/* Bottom Sheet */}
        <div
          ref={ref}
          className={`
            fixed bottom-0 left-0 right-0 z-50
            bg-[var(--surface-container-high)] backdrop-blur-[var(--glass-blur)]
            rounded-t-[var(--radius-lg)]
            border-t-2 border-l-2 border-r-2 border-[var(--glass-border)]
            shadow-[var(--shadow-glow-aurora)]
            transition-all duration-300 ease-out
            ${className}
          `}
          style={{
            height,
            transform: `translateY(${translateY}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out, height 0.3s ease-out',
          }}
          onMouseDown={(e) => handleDragStart(e.clientY)}
          onMouseMove={(e) => handleDragMove(e.clientY)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
          onTouchEnd={handleDragEnd}
        >
          {/* Handle */}
          {showHandle && (
            <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1 rounded-full bg-[var(--on-surface-variant)]/30" />
            </div>
          )}

          {/* Header */}
          {(title || description) && (
            <div className="px-6 pb-4 border-b border-[var(--glass-border)]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {title && <h3 className="text-lg text-[var(--on-surface)]">{title}</h3>}
                  {description && (
                    <p className="text-sm text-[var(--on-surface-variant)] mt-1">{description}</p>
                  )}
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="text-[var(--on-surface-variant)] hover:text-[var(--on-surface)] transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="overflow-y-auto" style={{ maxHeight: `calc(${height} - 80px)` }}>
            {children}
          </div>
        </div>
      </>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';
