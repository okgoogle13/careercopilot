import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming you have a class merger like clsx/twMerge

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof MotionProps> {
  variant?: 'default' | 'hero' | 'interactive';
  popOutGraphic?: React.ReactNode;
  children: React.ReactNode;
}

export const Card = ({ 
  children, 
  className, 
  variant = 'default', 
  popOutGraphic, 
  ...props 
}: CardProps) => {
  // Physics from the "Technical bible"
  const tactilePhysics = variant === 'interactive' ? {
    rest: { scale: 1 },
    hover: { scale: 0.98, transition: { type: "spring", stiffness: 400, damping: 25 } },
    tap: { scale: 0.95 }
  } : {};

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={tactilePhysics as any}
      className={cn(
        // Base Layout
        "relative overflow-hidden rounded-[28px] border border-outline-variant bg-surface-container-low",
        // Padding Logic (Add top padding if there is a pop-out graphic)
        popOutGraphic ? "pt-12 p-6" : "p-6",
        className
      )}
      {...props}
    >
      {/* LAYER 1: The Radial Grid Background (defined in globals.css) */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      
      {/* LAYER 2: The Noise Overlay (defined in globals.css) */}
      <div className="absolute inset-0 bg-noise opacity-5 mix-blend-overlay pointer-events-none" />
      
      {/* LAYER 3: The Pop-Out Graphic (If present) */}
      {popOutGraphic && (
        <motion.div 
          className="absolute -top-10 right-6 z-20 drop-shadow-xl"
          variants={{
            hover: { y: -15, rotate: 5, scale: 1.1 }
          }}
        >
          {popOutGraphic}
        </motion.div>
      )}
      
      {/* LAYER 4: Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};