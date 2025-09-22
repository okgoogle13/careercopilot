import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { 
  Sparkles, 
  Zap, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  Loader,
  Bell,
  Star,
  Heart,
  Bookmark,
  Share2,
  MoreHorizontal,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  Volume2,
  VolumeX
} from "lucide-react";

// Animated Modal Component
export function AnimatedModal({ isOpen, onClose, title, children }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode; 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <Card>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                {children}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={onClose}>Confirm</Button>
              </CardFooter>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Animated Dropdown Component
export function AnimatedDropdown({ 
  trigger, 
  items, 
  onSelect 
}: { 
  trigger: React.ReactNode; 
  items: Array<{ label: string; value: string; icon?: React.ReactNode }>; 
  onSelect: (value: string) => void; 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 min-w-[200px] bg-card border border-border rounded-lg shadow-lg z-10"
          >
            <div className="py-1">
              {items.map((item, index) => (
                <motion.button
                  key={item.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full px-3 py-2 text-left hover:bg-muted transition-colors flex items-center gap-2"
                  onClick={() => {
                    onSelect(item.value);
                    setIsOpen(false);
                  }}
                >
                  {item.icon}
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Animated Tabs Component
export function AnimatedTabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  children 
}: { 
  tabs: Array<{ id: string; label: string; icon?: React.ReactNode }>; 
  activeTab: string; 
  onTabChange: (tabId: string) => void; 
  children: React.ReactNode; 
}) {
  return (
    <div className="w-full">
      <div className="relative">
        <div className="flex bg-muted rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-card rounded-md shadow-sm"
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Animated Progress Component
export function AnimatedProgress({ 
  value, 
  max = 100, 
  showPercentage = true, 
  animated = true 
}: { 
  value: number; 
  max?: number; 
  showPercentage?: boolean; 
  animated?: boolean; 
}) {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full">
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={animated ? { width: "0%" } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { type: "spring", damping: 30, stiffness: 100 } : { duration: 0 }}
        />
      </div>
    </div>
  );
}

// Animated Notification Component
export function AnimatedNotification({ 
  type, 
  message, 
  onClose 
}: { 
  type: 'success' | 'error' | 'info' | 'warning'; 
  message: string; 
  onClose: () => void; 
}) {
  const icons = {
    success: CheckCircle2,
    error: XCircle,
    info: AlertCircle,
    warning: AlertCircle
  };

  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black'
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg min-w-[300px] ${colors[type]}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-70">
        <XCircle className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// Animated Card Component
export function AnimatedCard({ 
  children, 
  hover = true, 
  tap = true, 
  className = "" 
}: { 
  children: React.ReactNode; 
  hover?: boolean; 
  tap?: boolean; 
  className?: string; 
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" } : {}}
      whileTap={tap ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated Button Component
export function AnimatedButton({ 
  children, 
  variant = "default", 
  animation = "scale", 
  className = "",
  ...props 
}: { 
  children: React.ReactNode; 
  variant?: "default" | "outline" | "ghost" | "destructive"; 
  animation?: "scale" | "lift" | "glow" | "shimmer"; 
  className?: string; 
  [key: string]: any; 
}) {
  const animations = {
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 }
    },
    lift: {
      whileHover: { y: -2 },
      whileTap: { y: 0 }
    },
    glow: {
      whileHover: { 
        boxShadow: "0 0 0 8px rgba(124, 58, 237, 0.1)",
        transition: { duration: 0.2 }
      }
    },
    shimmer: {}
  };

  const MotionButton = animation === "shimmer" ? 
    ({ children, ...props }: any) => (
      <Button className={`relative overflow-hidden group ${className}`} {...props}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
        <span className="relative">{children}</span>
      </Button>
    ) :
    motion(Button);

  return (
    <MotionButton
      variant={variant}
      className={className}
      {...(animation !== "shimmer" ? animations[animation] : {})}
      transition={{ type: "spring", stiffness: 300 }}
      {...props}
    >
      {children}
    </MotionButton>
  );
}

// Expandable Card Component
export function ExpandableCard({ 
  title, 
  preview, 
  children, 
  icon 
}: { 
  title: string; 
  preview: string; 
  children: React.ReactNode; 
  icon?: React.ReactNode; 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="border border-border rounded-lg overflow-hidden"
    >
      <motion.button
        className="w-full p-4 text-left flex items-center justify-between hover:bg-muted transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground">{preview}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-border">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Staggered List Component
export function StaggeredList({ 
  items, 
  renderItem, 
  className = "" 
}: { 
  items: any[]; 
  renderItem: (item: any, index: number) => React.ReactNode; 
  className?: string; 
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
          }}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Loading Animations Component
export function LoadingAnimations() {
  return (
    <div className="flex gap-6 items-center">
      {/* Spinning loader */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <RefreshCw className="w-6 h-6 text-primary" />
      </motion.div>

      {/* Pulsing dot */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="w-6 h-6 bg-primary rounded-full"
      />

      {/* Bouncing dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -10, 0] }}
            transition={{ 
              duration: 0.6, 
              repeat: Infinity, 
              delay: i * 0.2 
            }}
            className="w-2 h-6 bg-primary rounded-full"
          />
        ))}
      </div>

      {/* Gradient spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-6 h-6 rounded-full border-2 border-transparent border-t-primary border-r-primary"
      />

      {/* Morphing loader */}
      <motion.div
        animate={{ 
          borderRadius: ["50%", "25%", "50%"],
          scale: [1, 0.8, 1]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-6 h-6 bg-primary"
      />
    </div>
  );
}

// Animated Statistics Card
export function AnimatedStatsCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon 
}: { 
  title: string; 
  value: string | number; 
  change: string; 
  trend: 'up' | 'down' | 'neutral'; 
  icon: React.ReactNode; 
}) {
  const trendIcons = {
    up: ArrowUp,
    down: ArrowDown,
    neutral: TrendingUp
  };

  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-muted-foreground'
  };

  const TrendIcon = trendIcons[trend];

  return (
    <AnimatedCard>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-muted-foreground"
              >
                {title}
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-2xl font-bold"
              >
                {value}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`flex items-center gap-1 text-sm ${trendColors[trend]}`}
              >
                <TrendIcon className="w-3 h-3" />
                {change}
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.4 }}
              className="p-3 bg-primary/10 rounded-lg"
            >
              {icon}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}