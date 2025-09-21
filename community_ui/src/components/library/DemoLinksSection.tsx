import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ComponentSection } from "./ComponentDemo";
import { Sparkles, Play, Kanban, Layers, Palette } from "lucide-react";

interface DemoLinksSectionProps {
  onNavigateToAnimated?: () => void;
  onNavigateToComplex?: () => void;
  onNavigateToM3Colors?: () => void;
}

export function DemoLinksSection({ onNavigateToAnimated, onNavigateToComplex, onNavigateToM3Colors }: DemoLinksSectionProps) {
  return (
    <ComponentSection 
      title="Interactive Demos" 
      description="Explore advanced component functionality with interactive demonstrations."
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="interactive">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Animated Components</h3>
                  <p className="text-muted-foreground text-sm">
                    Explore smooth animations and micro-interactions
                  </p>
                </div>
              </div>
              <Button onClick={onNavigateToAnimated} size="sm">
                Explore
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="interactive">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-tertiary/10 rounded-lg">
                  <Kanban className="w-6 h-6 text-tertiary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Complex Components</h3>
                  <p className="text-muted-foreground text-sm">
                    Kanban boards, timelines, activity feeds & more
                  </p>
                </div>
              </div>
              <Button onClick={onNavigateToComplex} className="btn-gradient" size="sm">
                Explore
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="interactive">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-primary/10 rounded-lg">
                  <Palette className="w-6 h-6 text-brand-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Material 3 Colors</h3>
                  <p className="text-muted-foreground text-sm">
                    Complete color system with tonal palettes
                  </p>
                </div>
              </div>
              <Button onClick={onNavigateToM3Colors} size="sm" className="btn-gradient-secondary">
                Explore
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="interactive">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Play className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">State Management Demo</h3>
                  <p className="text-muted-foreground text-sm">
                    Simulate loading states and error scenarios
                  </p>
                </div>
              </div>
              <Button size="sm">
                Launch Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ComponentSection>
  );
}