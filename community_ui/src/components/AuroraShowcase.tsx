import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AuroraButton } from "./ui/button-aurora";
import { aurora, auroraStyles } from "./ui/aurora-utils";
import { M3Input } from "./ui/m3-input";
import { 
  Sparkles, 
  Target, 
  Brain, 
  TrendingUp, 
  BarChart3, 
  CheckCircle, 
  Plus,
  Eye,
  Download,
  User
} from "lucide-react";

interface AuroraShowcaseProps {
  onBack?: () => void;
}

export function AuroraShowcase({ onBack }: AuroraShowcaseProps) {
  return (
    <div className="flex-1 p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={aurora.text('aurora', 'text-4xl font-bold mb-2')}>Aurora Theme Showcase</h1>
          <p className="text-muted-foreground">Experience the vibrant, glowing Aurora design system</p>
        </div>
        {onBack && (
          <Button onClick={onBack} variant="ghost">
            Back to Components
          </Button>
        )}
      </div>

      {/* Color Palette Section */}
      <Card className={aurora.card("p-6")}>
        <h2 className={aurora.text('primary', 'text-2xl font-semibold mb-4')}>Aurora Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="w-full h-20 bg-brand-primary rounded-lg shadow-glow-primary"></div>
            <p className="text-sm font-medium text-center">Primary Purple</p>
            <p className="text-xs text-muted-foreground text-center">#A78BFA</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-brand-tertiary rounded-lg shadow-glow-tertiary"></div>
            <p className="text-sm font-medium text-center">Tertiary Pink</p>
            <p className="text-xs text-muted-foreground text-center">#F472B6</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-aurora-full rounded-lg shadow-glow-aurora"></div>
            <p className="text-sm font-medium text-center">Aurora Gradient</p>
            <p className="text-xs text-muted-foreground text-center">Primary → Tertiary</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-surface-container-high rounded-lg border border-outline-variant"></div>
            <p className="text-sm font-medium text-center">Surface High</p>
            <p className="text-xs text-muted-foreground text-center">#262629</p>
          </div>
        </div>
      </Card>

      {/* Interactive Cards Section */}
      <Card className={aurora.card("p-6")}>
        <h2 className={aurora.text('primary', 'text-2xl font-semibold mb-4')}>Interactive Aurora Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-aurora glass p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/15 rounded-xl shadow-glow-primary">
                <Target className={aurora.icon("w-6 h-6 text-brand-primary")} />
              </div>
              <div>
                <h3 className="font-semibold">ATS Analysis</h3>
                <p className="text-sm text-muted-foreground">Score optimization</p>
              </div>
            </div>
            <Badge className="bg-primary/10 text-brand-primary border-primary/20 pulse-ai">
              AI Powered
            </Badge>
          </Card>

          <Card className="card-aurora glass p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-tertiary/15 rounded-xl shadow-glow-tertiary">
                <Brain className={aurora.icon("w-6 h-6 text-brand-tertiary")} />
              </div>
              <div>
                <h3 className="font-semibold">Smart Insights</h3>
                <p className="text-sm text-muted-foreground">Career intelligence</p>
              </div>
            </div>
            <Badge className="bg-tertiary/10 text-brand-tertiary border-tertiary/20 pulse-tertiary">
              New Feature
            </Badge>
          </Card>

          <Card className="card-create-profile glass p-6 space-y-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-tertiary/30 rounded-2xl flex items-center justify-center mb-4">
                <Plus className={aurora.icon("w-8 h-8 text-brand-primary")} />
              </div>
              <h3 className="font-semibold">Create New</h3>
              <p className="text-sm text-muted-foreground">Start building</p>
            </div>
          </Card>
        </div>
      </Card>

      {/* Buttons Section */}
      <Card className={aurora.card("p-6")}>
        <h2 className={aurora.text('primary', 'text-2xl font-semibold mb-4')}>Aurora Button Variants</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <AuroraButton variant="aurora">
              <Sparkles className="w-4 h-4" />
              Aurora Primary
            </AuroraButton>
            <Button className="btn-gradient">
              <Target className="w-4 h-4" />
              Gradient Button
            </Button>
            <Button className="btn-primary-cta">
              <CheckCircle className="w-4 h-4" />
              CTA Button
            </Button>
            <AuroraButton variant="outline">
              <Eye className="w-4 h-4" />
              Outline Aurora
            </AuroraButton>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button className="btn-gradient-secondary">
              <User className="w-4 h-4" />
              Secondary
            </Button>
            <Button className="btn-gradient-tertiary">
              <TrendingUp className="w-4 h-4" />
              Tertiary
            </Button>
            <AuroraButton variant="ghost">
              <BarChart3 className="w-4 h-4" />
              Ghost Aurora
            </AuroraButton>
            <AuroraButton variant="link">
              <Download className="w-4 h-4" />
              Link Aurora
            </AuroraButton>
          </div>
        </div>
      </Card>

      {/* Typography Section */}
      <Card className={aurora.card("p-6")}>
        <h2 className={aurora.text('primary', 'text-2xl font-semibold mb-4')}>Aurora Typography</h2>
        <div className="space-y-4">
          <h1 className={aurora.text('aurora', 'text-4xl font-bold')}>
            Aurora Display Text
          </h1>
          <h2 className={aurora.text('primary', 'text-2xl font-semibold')}>
            Primary Gradient Heading
          </h2>
          <h3 className={aurora.text('tertiary', 'text-xl font-medium')}>
            Tertiary Accent Text
          </h3>
          <p className="text-base text-on-surface">
            This is regular body text with proper contrast for readability. 
            The Aurora theme maintains accessibility while providing stunning visual appeal.
          </p>
          <p className="text-sm text-muted-foreground">
            Muted text for secondary information and descriptions.
          </p>
        </div>
      </Card>

      {/* Form Elements Section */}
      <Card className={aurora.card("p-6")}>
        <h2 className={aurora.text('primary', 'text-2xl font-semibold mb-4')}>Aurora Form Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <M3Input 
              label="Enhanced Aurora Input" 
              placeholder="Enter your text"
              helperText="This input uses Aurora theme enhancements"
            />
            <M3Input 
              label="Email Address"
              type="email" 
              placeholder="user@example.com"
              leadingIcon={<User className="w-4 h-4" />}
            />
          </div>
          <div className="space-y-4">
            <M3Input 
              label="Password"
              type="password" 
              placeholder="••••••••"
              trailingIcon={<Eye className="w-4 h-4" />}
            />
            <M3Input 
              label="Error State"
              error
              errorText="This field is required"
              placeholder="Enter required information"
            />
          </div>
        </div>
      </Card>

      {/* Glass Morphism Section */}
      <Card className="glass-aurora p-6">
        <h2 className={aurora.text('aurora', 'text-2xl font-semibold mb-4')}>Glass Aurora Effect</h2>
        <p className="text-muted-foreground mb-4">
          This card demonstrates the Aurora glass morphism effect with gradient borders and enhanced blur.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass p-4 rounded-lg">
            <h4 className="font-medium mb-2">Standard Glass</h4>
            <p className="text-sm text-muted-foreground">Regular glass morphism effect</p>
          </div>
          <div className="glass-aurora p-4 rounded-lg">
            <h4 className="font-medium mb-2">Aurora Glass</h4>
            <p className="text-sm text-muted-foreground">Enhanced with gradient borders</p>
          </div>
        </div>
      </Card>

      {/* Animation Section */}
      <Card className={aurora.card("p-6")}>
        <h2 className={aurora.text('primary', 'text-2xl font-semibold mb-4')}>Aurora Animations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto pulse-ai">
              <Sparkles className="w-8 h-8 text-brand-primary" />
            </div>
            <h4 className="font-medium">Pulse AI</h4>
            <p className="text-sm text-muted-foreground">AI-powered feature indicator</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-tertiary/20 rounded-full flex items-center justify-center mx-auto pulse-tertiary">
              <TrendingUp className="w-8 h-8 text-brand-tertiary" />
            </div>
            <h4 className="font-medium">Pulse Tertiary</h4>
            <p className="text-sm text-muted-foreground">New feature highlight</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-tertiary/20 rounded-full flex items-center justify-center mx-auto">
              <div className="text-6xl font-bold ats-score-pulse text-brand-primary">87</div>
            </div>
            <h4 className="font-medium">Score Pulse</h4>
            <p className="text-sm text-muted-foreground">Animated ATS score display</p>
          </div>
        </div>
      </Card>

      {/* Glow Effects Section */}
      <Card className={aurora.card("p-6")}>
        <h2 className={aurora.text('primary', 'text-2xl font-semibold mb-4')}>Aurora Glow Effects</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-brand-primary rounded-lg shadow-glow-primary mx-auto"></div>
            <p className="text-xs">Primary Glow</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-brand-tertiary rounded-lg shadow-glow-tertiary mx-auto"></div>
            <p className="text-xs">Tertiary Glow</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-aurora-full rounded-lg shadow-glow-aurora mx-auto"></div>
            <p className="text-xs">Aurora Glow</p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-brand-secondary rounded-lg shadow-glow-secondary mx-auto"></div>
            <p className="text-xs">Secondary Glow</p>
          </div>
        </div>
      </Card>
    </div>
  );
}