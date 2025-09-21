import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  SpinnerLoading, 
  ProgressLoading, 
  StateLoading, 
  EmptyState, 
  SkeletonCard, 
  SkeletonList 
} from "./StandardizedLoadingStates";
import { FileText, Sparkles } from "lucide-react";

interface StandardizedLoadingStatesDemoProps {
  onBack?: () => void;
}

export default function StandardizedLoadingStatesDemo({ onBack }: StandardizedLoadingStatesDemoProps) {
  const [progress, setProgress] = useState(45);
  const [currentState, setCurrentState] = useState<"loading" | "success" | "error" | "offline" | "processing" | "uploading" | "downloading">("loading");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev + 5) % 100);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gradient-blue mb-2">
              Standardized Loading States
            </h1>
            <p className="text-muted-foreground">
              Consistent loading patterns with Material 3 design principles
            </p>
          </div>
          {onBack && (
            <Button onClick={onBack} variant="outline" className="focus-glow">
              ← Back to Components
            </Button>
          )}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spinner Components */}
          <Card className="p-6 glass">
            <h3 className="text-lg font-semibold mb-4">Spinner Loading</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Small</h4>
                <SpinnerLoading size="sm" label="Loading..." />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Medium</h4>
                <SpinnerLoading size="md" label="Processing..." />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Large</h4>
                <SpinnerLoading size="lg" label="Analyzing..." />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Icon Only</h4>
                <SpinnerLoading size="md" showLabel={false} />
              </div>
            </div>
          </Card>

          {/* Progress Loading */}
          <Card className="p-6 glass">
            <h3 className="text-lg font-semibold mb-4">Progress Loading</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Document Upload</h4>
                <ProgressLoading 
                  progress={progress} 
                  label="Uploading resume.pdf"
                  showPercentage={true}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">AI Analysis</h4>
                <ProgressLoading 
                  progress={Math.min(100, progress + 20)} 
                  label="Analyzing job requirements"
                  showPercentage={true}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Without Percentage</h4>
                <ProgressLoading 
                  progress={progress} 
                  label="Processing..."
                  showPercentage={false}
                />
              </div>
            </div>
          </Card>

          {/* Skeleton Loading */}
          <Card className="p-6 glass">
            <h3 className="text-lg font-semibold mb-4">Skeleton Loading</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Profile Card</h4>
                <SkeletonCard />
              </div>
            </div>
          </Card>

          {/* Skeleton List */}
          <Card className="p-6 glass">
            <h3 className="text-lg font-semibold mb-4">Skeleton List</h3>
            <SkeletonList count={3} />
          </Card>

          {/* State Loading */}
          <Card className="p-6 glass col-span-1 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">State Loading</h3>
            <div className="flex gap-2 mb-4 flex-wrap">
              {(["loading", "success", "error", "offline", "processing", "uploading", "downloading"] as const).map((state) => (
                <Button
                  key={state}
                  variant={currentState === state ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentState(state)}
                  className="capitalize focus-glow"
                >
                  {state}
                </Button>
              ))}
            </div>
            <div className="min-h-48">
              <StateLoading 
                state={currentState}
                onRetry={() => console.log("Retry clicked")}
              />
            </div>
          </Card>

          {/* Empty State */}
          <Card className="p-6 glass">
            <h3 className="text-lg font-semibold mb-4">Empty State</h3>
            <EmptyState
              icon={<FileText className="h-12 w-12 text-muted-foreground" />}
              title="No Documents Yet"
              description="Start by creating your first resume or cover letter."
              action={{
                label: "Create Document",
                onClick: () => console.log("Create clicked")
              }}
            />
          </Card>

          {/* Loading Screen */}
          <Card className="p-6 glass">
            <h3 className="text-lg font-semibold mb-4">Loading Screen Components</h3>
            <div className="space-y-4">
              <div className="bg-background rounded-lg p-8 border border-border">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="h-8 w-8 text-primary animate-pulse">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z" />
                        <circle cx="9" cy="9" r="1" />
                        <circle cx="15" cy="9" r="1" />
                        <path d="M10 13h4v1h-4z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg text-gradient-blue font-semibold">FML Career Copilot</h4>
                    <p className="text-sm text-muted-foreground">Preparing your AI tools...</p>
                  </div>
                  <SpinnerLoading size="sm" showLabel={false} />
                  <Badge variant="secondary" className="bg-brand-purple/10 text-brand-purple">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Powered by Gemini AI
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Usage Examples */}
        <Card className="p-6 glass">
          <h3 className="text-lg font-semibold mb-4">Usage Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">React Component Usage</h4>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`import { 
  SpinnerLoading, 
  ProgressLoading, 
  StateLoading 
} from './StandardizedLoadingStates';

// Basic spinner
<SpinnerLoading size="md" label="Loading..." />

// Progress with percentage
<ProgressLoading 
  progress={75} 
  label="Uploading..." 
  showPercentage={true}
/>

// State-based loading
<StateLoading 
  state="processing" 
  message="AI is analyzing your resume..."
  onRetry={handleRetry}
/>`}
              </pre>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Material 3 Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Glass morphism backgrounds with blur effects</li>
                <li>• Consistent color tokens and spacing</li>
                <li>• Smooth animations with proper easing</li>
                <li>• Accessibility support for reduced motion</li>
                <li>• Touch-optimized for mobile devices</li>
                <li>• High contrast mode compatibility</li>
                <li>• Responsive design patterns</li>
                <li>• Focus indicators for keyboard navigation</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}