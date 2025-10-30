import React, { useState } from 'react';
import {
  useDesignTokens,
  createTokenStyles,
  createGlassEffect,
  createAccessibleFocusStyle,
} from '../../hooks/useDesignTokens';
import { careerCopilotTokenMapper } from '../../mappings/design-tokens.mapper';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Sparkles, Zap, Star } from 'lucide-react';

// Example of creating styles with enhanced design tokens
const tokenStyles = createTokenStyles((tokens) => ({
  container: {
    padding: tokens.spacing.lg,
    background: tokens.colors.backgroundGradient,
    minHeight: '100vh',
    position: 'relative',
  },
  header: {
    fontSize: tokens.typography.size['2xl'],
    fontWeight: tokens.typography.weight.semibold,
    background: `linear-gradient(135deg, ${tokens.colors.accentBlue} 0%, ${tokens.colors.accentPurple} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: tokens.spacing.md,
    textShadow: '0 2px 4px rgba(96, 165, 250, 0.2)',
  },
  description: {
    fontSize: tokens.typography.size.base,
    color: tokens.colors.foregroundSecondary,
    lineHeight: tokens.typography.lineHeight.relaxed,
    marginBottom: tokens.spacing.lg,
  },
  tokenGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: tokens.spacing.lg,
  },
  glassCard: {
    ...createGlassEffect('medium'),
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    transition: `all ${tokens.animation.durationNormal} ${tokens.animation.ease}`,
  },
  glassCardHover: {
    ...createGlassEffect('strong'),
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    transform: 'translateY(-4px)',
    boxShadow: tokens.shadow.glassHover,
  },
}));

interface TokenDisplayProps {
  category: string;
  tokens: Record<string, string>;
}

function TokenDisplay({ category, tokens }: TokenDisplayProps) {
  const { styles } = useDesignTokens();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-brand-blue">{category}</h3>
      <div className="space-y-2">
        {Object.entries(tokens).map(([name, value]) => (
          <div
            key={name}
            className="flex items-center justify-between p-2 rounded border border-subtle hover:bg-surface-section transition-colors"
          >
            <span className="font-medium text-sm">{name}</span>
            <Badge variant="outline" className="font-mono text-xs">
              {value}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ColorSwatch({ colorName, colorValue }: { colorName: string; colorValue: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-opacity-10 hover:bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-10 h-10 rounded-lg border transition-all duration-300"
        style={{
          backgroundColor: colorValue,
          borderColor: isHovered ? colorValue : 'rgba(255, 255, 255, 0.1)',
          boxShadow: isHovered ? `0 0 16px ${colorValue}40` : 'none',
        }}
      />
      <div>
        <div className="font-medium text-sm text-foreground">{colorName}</div>
        <div className="text-xs text-foreground-secondary font-mono">{colorValue}</div>
      </div>
    </div>
  );
}

function GlassExample({
  title,
  intensity,
}: {
  title: string;
  intensity: 'light' | 'medium' | 'strong';
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={isHovered ? tokenStyles.glassCardHover : tokenStyles.glassCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h4 className="font-medium mb-2 text-foreground">{title}</h4>
      <p className="text-sm text-foreground-secondary">
        Glass morphism effect with {intensity} intensity and hover states.
      </p>
    </div>
  );
}

function AnimatedProgress() {
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">AI Processing</span>
        <Badge className="pulse-ai">AI</Badge>
      </div>
      <div className="relative">
        <Progress value={progress} className="h-2" />
        <div className="absolute inset-0 shimmer rounded-full overflow-hidden" />
      </div>
    </div>
  );
}

export function DesignTokenExample() {
  const { tokens, color, spacing, typography, styles, glass, animation } = useDesignTokens();

  // Example of using the token mapper
  const mappedPrimary = careerCopilotTokenMapper('primary');
  const mappedGlass = careerCopilotTokenMapper('glass-bg');
  const mappedAnimation = careerCopilotTokenMapper('animation-duration-normal');

  return (
    <div style={tokenStyles.container}>
      <div className="max-w-7xl mx-auto">
        <h1 style={tokenStyles.header}>Enhanced Design Token System</h1>
        <p style={tokenStyles.description}>
          Explore our comprehensive design token system featuring glass morphism effects, responsive
          design patterns, and accessibility-first components with smooth animations.
        </p>

        {/* Token Mapper Examples */}
        <div style={tokenStyles.glassCard} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gradient-blue">Enhanced Token Mapper</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">Primary Color:</span>
              <span className="font-mono text-xs bg-glass p-2 rounded border border-glass-border">
                {mappedPrimary}
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">Glass Background:</span>
              <span className="font-mono text-xs bg-glass p-2 rounded border border-glass-border">
                {mappedGlass}
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-foreground">Animation Duration:</span>
              <span className="font-mono text-xs bg-glass p-2 rounded border border-glass-border">
                {mappedAnimation}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Token Showcase */}
        <div style={tokenStyles.tokenGrid} className="mb-8">
          {/* Color Tokens */}
          <div style={tokenStyles.glassCard}>
            <h3 className="text-lg font-semibold mb-4 text-gradient-blue flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Enhanced Color Palette
            </h3>
            <div className="space-y-1">
              <ColorSwatch colorName="Primary Blue" colorValue={tokens.colors.primary} />
              <ColorSwatch colorName="Primary Light" colorValue={tokens.colors.primaryLight} />
              <ColorSwatch colorName="Accent Purple" colorValue={tokens.colors.accentPurple} />
              <ColorSwatch
                colorName="Accent Purple Light"
                colorValue={tokens.colors.accentPurpleLight}
              />
              <ColorSwatch colorName="Accent Green" colorValue={tokens.colors.accentGreen} />
              <ColorSwatch colorName="Accent Red" colorValue={tokens.colors.accentRed} />
            </div>
          </div>

          {/* Glass Morphism Examples */}
          <div style={tokenStyles.glassCard}>
            <h3 className="text-lg font-semibold mb-4 text-gradient-purple flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Glass Morphism Effects
            </h3>
            <div className="space-y-4">
              <GlassExample title="Light Glass" intensity="light" />
              <GlassExample title="Medium Glass" intensity="medium" />
              <GlassExample title="Strong Glass" intensity="strong" />
            </div>
          </div>

          {/* Interactive Components */}
          <div style={tokenStyles.glassCard}>
            <h3 className="text-lg font-semibold mb-4 text-gradient-blue flex items-center gap-2">
              <Star className="w-5 h-5" />
              Interactive Components
            </h3>
            <div className="space-y-6">
              <AnimatedProgress />

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Badge Effects</h4>
                <div className="flex gap-3 flex-wrap">
                  <Badge className="pulse-ai">AI Processing</Badge>
                  <Badge className="pulse-new">New Feature</Badge>
                  <Badge variant="outline" className="glow-hover">
                    Hover Me
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Gradient Text</h4>
                <p className="text-gradient-blue text-lg font-semibold">Blue Gradient Text</p>
                <p className="text-gradient-purple text-lg font-semibold">Purple Gradient Text</p>
              </div>
            </div>
          </div>

          {/* Animation Tokens */}
          <TokenDisplay category="Animation System" tokens={tokens.animation} />

          {/* Glass Tokens */}
          <TokenDisplay category="Glass Morphism" tokens={tokens.glass} />

          {/* Responsive Breakpoints */}
          <TokenDisplay category="Responsive Breakpoints" tokens={tokens.breakpoints} />
        </div>

        {/* Enhanced Style Examples */}
        <div style={tokenStyles.glassCard}>
          <h3 className="text-xl font-semibold mb-6 text-gradient-purple">
            Pre-built Component Styles
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3 text-foreground">Glass Card Styles:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div style={styles.card} className="p-4">
                  <p className="text-foreground-secondary">Standard glass card with blur effects</p>
                </div>
                <div style={styles.cardElevated} className="p-4">
                  <p className="text-foreground-secondary">Elevated card with enhanced glass</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-foreground">Button Variations:</h4>
              <div className="flex gap-4 flex-wrap">
                <button
                  style={styles.buttonPrimary}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:transform hover:scale-105"
                >
                  Gradient Button
                </button>
                <button
                  style={styles.buttonGlass}
                  className="px-4 py-2 rounded-lg font-medium hover:bg-glass-bg-hover"
                >
                  Glass Button
                </button>
                <Button
                  className="glow-hover focus-glow"
                  style={createAccessibleFocusStyle('primary')}
                >
                  Accessible Button
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-foreground">Typography Showcase:</h4>
              <div className="space-y-2">
                <p style={styles.textPrimary}>Primary text with perfect contrast</p>
                <p style={styles.textSecondary}>Secondary text with reduced opacity</p>
                <p style={styles.textGradientBlue}>Blue gradient text with shadow effects</p>
                <p style={styles.textGradientPurple}>Purple gradient text with shadow effects</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Usage Examples */}
        <div style={tokenStyles.glassCard} className="mt-8">
          <h3 className="text-xl font-semibold mb-6 text-gradient-blue">Advanced Usage Patterns</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3 text-foreground">React Hook Usage:</h4>
              <div className="bg-glass p-4 rounded-lg font-mono text-sm overflow-x-auto border border-glass-border">
                <pre className="text-foreground-secondary">{`// Enhanced hook with new features
const { tokens, glass, animation, styles } = useDesignTokens();

// Glass morphism effects
style={createGlassEffect('medium')}

// Responsive design
style={createResponsiveStyles(mobileStyles, tabletStyles, desktopStyles)}

// Accessibility focus
style={createAccessibleFocusStyle('primary')}`}</pre>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-foreground">CSS Class Usage:</h4>
              <div className="bg-glass p-4 rounded-lg font-mono text-sm overflow-x-auto border border-glass-border">
                <pre className="text-foreground-secondary">{`<!-- Glass morphism classes -->
<div className="glass">Glass effect</div>
<div className="card-surface">Enhanced card</div>

<!-- Animation classes -->
<div className="transition-normal glow-hover">Smooth animations</div>
<div className="shimmer">Shimmer effect</div>

<!-- Badge effects -->
<span className="pulse-ai">AI Badge</span>
<span className="pulse-new">New Badge</span>

<!-- Gradient text -->
<h1 className="text-gradient-blue">Blue gradient</h1>
<h2 className="text-gradient-purple">Purple gradient</h2>`}</pre>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-foreground">Responsive & Accessibility:</h4>
              <div className="bg-glass p-4 rounded-lg font-mono text-sm overflow-x-auto border border-glass-border">
                <pre className="text-foreground-secondary">{`<!-- Responsive utilities -->
<div className="mobile-only">Mobile only content</div>
<div className="tablet-up">Tablet and up</div>
<div className="desktop-up">Desktop only</div>

<!-- Touch optimization -->
<button className="touch-target">Touch friendly</button>

<!-- Accessibility -->
<button className="focus-glow">Accessible focus</button>
<div className="high-contrast">High contrast mode</div>`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
