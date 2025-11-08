import {
  Error as AlertCircle,
  KeyboardArrowDown as ArrowDown,
  KeyboardArrowUp as ArrowUp,
  CheckCircle as CheckCircle2,
  ChevronRight,
  Refresh as RefreshCw,
  TrendingUp,
  Cancel as XCircle,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import { Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';

// Animated Modal Component
export function AnimatedModal({
  isOpen,
  onClose,
  title,
  children,
}: {
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
            sx={{}}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            sx={{
      width: "100%",
      maxWidth: "md"
    }}
          >
            <Card>
              <CardHeader title={<Typography variant="h3">{title}</Typography>}></CardHeader>
              <CardContent>{children}</CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={onClose}>Confirm</Button>
              </CardActions>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Animated Dropdown Component

interface AnimatedDropdownProps {
  trigger: React.ReactNode;
  items: { label: string; value: string; icon?: React.ReactNode }[];
  onSelect: (value: string) => void;
}

export function AnimatedDropdown({ trigger, items, onSelect }: AnimatedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div sx={{}}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            sx={{
      mt: 2,
      w: "200px",
      border: 1,
      borderRadius: "0.5rem",
      boxShadow: 4,}}
          >
            <div sx={{
      py: 1
    }}>
              {items.map((item, index) => (
                <motion.button
                  key={item.value}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  sx={{
      width: "100%",
      px: 3,
      py: 2,
      textAlign: "left",
      '&:hover': {},
      display: "flex",
      alignItems: "center",
      gap: 2
    }}
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
  children,
}: {
  tabs: Array<{ id: string; label: string; icon?: React.ReactNode }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div sx={{
      width: "100%"
    }}>
      <div sx={{}}>
        <div sx={{
      display: "flex",
      borderRadius: "0.5rem",
      p: 1
    }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              sx={{
      flex: 1,
      px: 3,
      py: 2,
      typography: "body1",
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      '&:hover': {},}}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  sx={{
      borderRadius: "0.375rem",
      boxShadow: 1
    }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                />
              )}
              <span sx={{
      display: "flex",
      alignItems: "center",
      gap: 2
    }}>
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div sx={{
      mt: 4
    }}>
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
  animated = true,
}: {
  value: number;
  max?: number;
  showPercentage?: boolean;
  animated?: boolean;
}) {
  const percentage = (value / max) * 100;

  return (
    <div sx={{
      width: "100%"
    }}>
      {showPercentage && (
        <div sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2
    }}>
          <span sx={{
      typography: "body1",
      fontWeight: 500
    }}>Progress</span>
          <span sx={{
      typography: "body1",}}>{Math.round(percentage)}%</span>
        </div>
      )}
      <div sx={{
      width: "100%",
      borderRadius: "9999px",
      overflow: "hidden"
    }}>
        <motion.div
          sx={{
      height: "100%",
      borderRadius: "9999px"
    }}
          initial={animated ? { width: '0%' } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { type: 'spring', damping: 30, stiffness: 100 } : { duration: 0 }}
        />
      </div>
    </div>
  );
}

// Animated Notification Component
export function AnimatedNotification({
  type,
  message,
  onClose,
}: {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
}) {
  const icons = {
    success: CheckCircle2,
    error: XCircle,
    info: AlertCircle,
    warning: AlertCircle,
  };

  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black',
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      px: 4,
      py: 3,
      borderRadius: "0.5rem",
      boxShadow: 4,
      w: "300px",}}
    >
      <Icon sx={{}} />
      <span sx={{
      typography: "body1",
      flex: 1
    }}>{message}</span>
      <button onClick={onClose} sx={{
      '&:hover': { opacity: 0.7 }
    }}>
        <XCircle sx={{}} />
      </button>
    </motion.div>
  );
}

// Animated Card Component
export function AnimatedCard({
  children,
  hover = true,
  tap = true,
  className = '',
}: {
  children: React.ReactNode;
  hover?: boolean;
  tap?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' } : {}}
      whileTap={tap ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated Button Component
export function AnimatedButton({
  children,
  variant = 'contained',
  animation = 'scale',
  className = '',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  animation?: 'scale' | 'lift' | 'glow' | 'shimmer';
  className?: string;
  [key: string]: any;
}) {
  const animations = {
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
    },
    lift: {
      whileHover: { y: -2 },
      whileTap: { y: 0 },
    },
    glow: {
      whileHover: {
        boxShadow: '0 0 0 8px rgba(124, 58, 237, 0.1)',
        transition: { duration: 0.2 },
      },
    },
    shimmer: {},
  };

  const MotionButton =
    animation === 'shimmer'
      ? ({ children, ...props }: any) => (
          <Button sx={{
      overflow: "hidden",}} {...props}>
            <motion.div
              sx={{}}
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span sx={{}}>{children}</span>
          </Button>
        )
      : motion(Button);

  return (
    <MotionButton
      variant={variant}
      className={className}
      {...(animation !== 'shimmer' ? animations[animation] : {})}
      transition={{ type: 'spring', stiffness: 300 }}
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
  icon,
}: {
  title: string;
  preview: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div layout sx={{
      border: 1,
      borderRadius: "0.5rem",
      overflow: "hidden"
    }}>
      <motion.button
        sx={{
      width: "100%",
      p: 4,
      textAlign: "left",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      '&:hover': {},}}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div sx={{
      display: "flex",
      alignItems: "center",
      gap: 3
    }}>
          {icon}
          <div>
            <h4 sx={{
      fontWeight: 500
    }}>{title}</h4>
            <p sx={{
      typography: "body1",}}>{preview}</p>
          </div>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight sx={{}} />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            sx={{
      overflow: "hidden"
    }}
          >
            <div sx={{
      p: 4,
      pt: 0,
      borderTop: 1,}}>{children}</div>
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
  className = '',
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
            staggerChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 },
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
    <div sx={{
      display: "flex",
      gap: 6,
      alignItems: "center"
    }}>
      {/* Spinning loader */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <RefreshCw sx={{}} />
      </motion.div>

      {/* Pulsing dot */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        sx={{
      borderRadius: "9999px"
    }}
      />

      {/* Bouncing dots */}
      <div sx={{
      display: "flex",
      gap: 1
    }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            sx={{
      borderRadius: "9999px"
    }}
          />
        ))}
      </div>

      {/* Gradient spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        sx={{
      borderRadius: "9999px",
      border: 2,
      borderColor: "transparent",}}
      />

      {/* Morphing loader */}
      <motion.div
        animate={{
          borderRadius: ['50%', '25%', '50%'],
          scale: [1, 0.8, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        sx={{}}
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
  icon,
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
    neutral: TrendingUp,
  };

  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-muted-foreground',
  };

  const TrendIcon = trendIcons[trend];

  return (
    <AnimatedCard>
      <Card>
        <CardContent sx={{
      p: 6
    }}>
          <div sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                sx={{
      typography: "body1",}}
              >
                {title}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                sx={{
      typography: "h4",
      fontWeight: 700
    }}
              >
                {value}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      typography: "body1",}}
              >
                <TrendIcon sx={{}} />
                {change}
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.4 }}
              sx={{
      p: 3,
      borderRadius: "0.5rem"
    }}
            >
              {icon}
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </AnimatedCard>
  );
}
