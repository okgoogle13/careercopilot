import React from "react";
import { ArrowLeft, Palette, Eye, Code, Layers, Zap, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { M3Card, M3CardHeader, M3CardTitle, M3CardDescription, M3CardContent } from "./ui/m3-card";
import { M3Button } from "./ui/m3-button";
import { Badge } from "./ui/badge";

interface StyleGuideShowcaseProps {
  onBack?: () => void;
}

export function StyleGuideShowcase({ onBack }: StyleGuideShowcaseProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              FML Career Copilot Style Guide
            </h1>
            <p className="text-muted-foreground mt-2">
              Complete design system with Material 3 foundations and career-focused components
            </p>
          </div>
        </div>

        <div className="space-y-12">
          {/* Design Philosophy */}
          <section>
            <h2 className="text-xl font-medium mb-6 text-foreground">Design Philosophy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <M3Card variant="default">
                <M3CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                      <Zap className="w-6 h-6 text-brand-primary" />
                    </div>
                    <M3CardTitle>AI-Powered</M3CardTitle>
                  </div>
                  <M3CardDescription>
                    Every component leverages AI to enhance user productivity and decision-making in
                    career development.
                  </M3CardDescription>
                </M3CardHeader>
              </M3Card>

              <M3Card variant="default">
                <M3CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10">
                      <Eye className="w-6 h-6 text-brand-secondary" />
                    </div>
                    <M3CardTitle>Accessibility First</M3CardTitle>
                  </div>
                  <M3CardDescription>
                    Material 3 compliance ensures excellent contrast ratios, focus management, and
                    screen reader support.
                  </M3CardDescription>
                </M3CardHeader>
              </M3Card>

              <M3Card variant="default">
                <M3CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-tertiary/10">
                      <Heart className="w-6 h-6 text-brand-tertiary" />
                    </div>
                    <M3CardTitle>User Empathy</M3CardTitle>
                  </div>
                  <M3CardDescription>
                    Designed with deep understanding of job seekers' stress, hope, and the emotional
                    journey of career growth.
                  </M3CardDescription>
                </M3CardHeader>
              </M3Card>
            </div>
          </section>

          {/* Color System */}
          <section>
            <h2 className="text-xl font-medium mb-6 text-foreground">Material 3 Color System</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Primary Colors */}
              <M3Card variant="default">
                <M3CardHeader>
                  <M3CardTitle>Primary Color Family</M3CardTitle>
                  <M3CardDescription>
                    Core brand colors for primary actions and key UI elements
                  </M3CardDescription>
                </M3CardHeader>
                <M3CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-brand-primary border border-outline-variant"></div>
                      <div className="text-sm">
                        <p className="font-medium text-foreground">Primary</p>
                        <p className="text-muted-foreground">#C8BFFF</p>
                        <code className="text-xs bg-surface-container px-1 rounded">--primary</code>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-brand-primary-container border border-outline-variant"></div>
                      <div className="text-sm">
                        <p className="font-medium text-foreground">Primary Container</p>
                        <p className="text-muted-foreground">#463F77</p>
                        <code className="text-xs bg-surface-container px-1 rounded">
                          --primary-container
                        </code>
                      </div>
                    </div>
                  </div>
                </M3CardContent>
              </M3Card>

              {/* Secondary Colors */}
              <M3Card variant="default">
                <M3CardHeader>
                  <M3CardTitle>Secondary Color Family</M3CardTitle>
                  <M3CardDescription>
                    Supporting colors for secondary actions and accents
                  </M3CardDescription>
                </M3CardHeader>
                <M3CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-brand-secondary border border-outline-variant"></div>
                      <div className="text-sm">
                        <p className="font-medium text-foreground">Secondary</p>
                        <p className="text-muted-foreground">#C9C3DC</p>
                        <code className="text-xs bg-surface-container px-1 rounded">
                          --secondary
                        </code>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-brand-secondary-container border border-outline-variant"></div>
                      <div className="text-sm">
                        <p className="font-medium text-foreground">Secondary Container</p>
                        <p className="text-muted-foreground">#474459</p>
                        <code className="text-xs bg-surface-container px-1 rounded">
                          --secondary-container
                        </code>
                      </div>
                    </div>
                  </div>
                </M3CardContent>
              </M3Card>

              {/* Surface Hierarchy */}
              <M3Card variant="default" className="lg:col-span-2">
                <M3CardHeader>
                  <M3CardTitle>Surface Hierarchy</M3CardTitle>
                  <M3CardDescription>
                    High-contrast surface layers that create visual depth and information hierarchy
                  </M3CardDescription>
                </M3CardHeader>
                <M3CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      {
                        name: "Surface Container Low",
                        class: "bg-surface-container-low",
                        token: "--surface-container-low",
                        hex: "#201E25",
                      },
                      {
                        name: "Surface Container",
                        class: "bg-surface-container",
                        token: "--surface-container",
                        hex: "#25232B",
                      },
                      {
                        name: "Surface Container High",
                        class: "bg-surface-container-high",
                        token: "--surface-container-high",
                        hex: "#302E36",
                      },
                      {
                        name: "Surface Container Highest",
                        class: "bg-surface-container-highest",
                        token: "--surface-container-highest",
                        hex: "#3C3A42",
                      },
                      {
                        name: "Surface Variant",
                        class: "bg-surface-variant",
                        token: "--surface-variant",
                        hex: "#48464F",
                      },
                    ].map((surface) => (
                      <div key={surface.name} className="space-y-2">
                        <div
                          className={`h-16 rounded-lg border border-outline-variant ${surface.class}`}
                        ></div>
                        <div className="text-xs">
                          <p className="font-medium text-foreground">{surface.name}</p>
                          <p className="text-muted-foreground">{surface.hex}</p>
                          <code className="text-xs bg-surface-container px-1 rounded">
                            {surface.token}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </M3CardContent>
              </M3Card>
            </div>
          </section>

          {/* Typography Scale */}
          <section>
            <h2 className="text-xl font-medium mb-6 text-foreground">Typography System</h2>
            <M3Card variant="default">
              <M3CardHeader>
                <M3CardTitle>Google Sans Typography Scale</M3CardTitle>
                <M3CardDescription>
                  Professional, clean typography optimized for career-focused content
                </M3CardDescription>
              </M3CardHeader>
              <M3CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border-b border-outline-variant pb-4">
                    <h1 className="text-4xl font-semibold text-foreground mb-2">Display Large</h1>
                    <p className="text-sm text-muted-foreground">
                      64px • font-semibold • For hero sections and major page headings
                    </p>
                  </div>
                  <div className="border-b border-outline-variant pb-4">
                    <h2 className="text-3xl font-semibold text-foreground mb-2">Display Medium</h2>
                    <p className="text-sm text-muted-foreground">
                      48px • font-semibold • For section headers and modal titles
                    </p>
                  </div>
                  <div className="border-b border-outline-variant pb-4">
                    <h3 className="text-2xl font-semibold text-foreground mb-2">Headline Large</h3>
                    <p className="text-sm text-muted-foreground">
                      32px • font-semibold • For card titles and important headers
                    </p>
                  </div>
                  <div className="border-b border-outline-variant pb-4">
                    <h4 className="text-xl font-medium text-foreground mb-2">Headline Medium</h4>
                    <p className="text-sm text-muted-foreground">
                      24px • font-medium • For subsection headers
                    </p>
                  </div>
                  <div className="border-b border-outline-variant pb-4">
                    <p className="text-lg font-regular text-foreground mb-2">Body Large</p>
                    <p className="text-sm text-muted-foreground">
                      18px • font-regular • For important body text and descriptions
                    </p>
                  </div>
                  <div className="border-b border-outline-variant pb-4">
                    <p className="text-base font-regular text-foreground mb-2">Body Medium</p>
                    <p className="text-sm text-muted-foreground">
                      16px • font-regular • Standard body text and form labels
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-regular text-muted-foreground mb-2">Body Small</p>
                    <p className="text-xs text-muted-foreground">
                      14px • font-regular • Helper text, captions, and metadata
                    </p>
                  </div>
                </div>
              </M3CardContent>
            </M3Card>
          </section>

          {/* Component States */}
          <section>
            <h2 className="text-xl font-medium mb-6 text-foreground">
              Component States & Interactions
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Button States */}
              <M3Card variant="default">
                <M3CardHeader>
                  <M3CardTitle>Button States</M3CardTitle>
                  <M3CardDescription>
                    Material 3 button variants with proper elevation and motion
                  </M3CardDescription>
                </M3CardHeader>
                <M3CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Filled (Primary)</p>
                      <div className="flex gap-3">
                        <M3Button variant="filled" size="medium">
                          Default
                        </M3Button>
                        <M3Button variant="filled" size="medium" className="hover:shadow-lg">
                          Hover
                        </M3Button>
                        <M3Button variant="filled" size="medium" disabled>
                          Disabled
                        </M3Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Outlined</p>
                      <div className="flex gap-3">
                        <M3Button variant="outlined" size="medium">
                          Default
                        </M3Button>
                        <M3Button
                          variant="outlined"
                          size="medium"
                          className="hover:bg-primary hover:bg-opacity-8"
                        >
                          Hover
                        </M3Button>
                        <M3Button variant="outlined" size="medium" disabled>
                          Disabled
                        </M3Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Text</p>
                      <div className="flex gap-3">
                        <M3Button variant="text" size="medium">
                          Default
                        </M3Button>
                        <M3Button
                          variant="text"
                          size="medium"
                          className="hover:bg-primary hover:bg-opacity-8"
                        >
                          Hover
                        </M3Button>
                        <M3Button variant="text" size="medium" disabled>
                          Disabled
                        </M3Button>
                      </div>
                    </div>
                  </div>
                </M3CardContent>
              </M3Card>

              {/* Card States */}
              <M3Card variant="default">
                <M3CardHeader>
                  <M3CardTitle>Card States</M3CardTitle>
                  <M3CardDescription>
                    Interactive cards with elevation and state management
                  </M3CardDescription>
                </M3CardHeader>
                <M3CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Default Card</p>
                      <M3Card variant="default" className="p-4">
                        <p className="text-sm text-foreground">Surface container background</p>
                      </M3Card>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Interactive Card</p>
                      <M3Card variant="interactive" className="p-4">
                        <p className="text-sm text-foreground">Hover for elevated state</p>
                      </M3Card>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Selected Card</p>
                      <M3Card variant="selected" className="p-4">
                        <p className="text-sm text-on-primary-container">
                          Primary container background
                        </p>
                      </M3Card>
                    </div>
                  </div>
                </M3CardContent>
              </M3Card>
            </div>
          </section>

          {/* Motion System */}
          <section>
            <h2 className="text-xl font-medium mb-6 text-foreground">Material 3 Motion System</h2>
            <M3Card variant="default">
              <M3CardHeader>
                <M3CardTitle>Animation Guidelines</M3CardTitle>
                <M3CardDescription>
                  Purposeful motion that enhances user understanding and creates delightful
                  interactions
                </M3CardDescription>
              </M3CardHeader>
              <M3CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Duration Tokens</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Micro-interactions</span>
                        <code className="bg-surface-container px-2 py-1 rounded text-xs">
                          50-100ms
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Simple transitions</span>
                        <code className="bg-surface-container px-2 py-1 rounded text-xs">
                          150-200ms
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Complex components</span>
                        <code className="bg-surface-container px-2 py-1 rounded text-xs">
                          250-400ms
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Screen transitions</span>
                        <code className="bg-surface-container px-2 py-1 rounded text-xs">
                          450-600ms
                        </code>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Easing Curves</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Standard</span>
                        <code className="bg-surface-container px-2 py-1 rounded text-xs">
                          cubic-bezier(0.2, 0, 0, 1.0)
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Decelerate</span>
                        <code className="bg-surface-container px-2 py-1 rounded text-xs">
                          cubic-bezier(0, 0, 0, 1)
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Accelerate</span>
                        <code className="bg-surface-container px-2 py-1 rounded text-xs">
                          cubic-bezier(0.3, 0, 1, 1)
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Emphasized</span>
                        <code className="bg-surface-container px-2 py-1 rounded text-xs">
                          cubic-bezier(0.05, 0.7, 0.1, 1.0)
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </M3CardContent>
            </M3Card>
          </section>

          {/* Design Tokens Usage */}
          <section>
            <h2 className="text-xl font-medium mb-6 text-foreground">Using Design Tokens</h2>
            <M3Card variant="default">
              <M3CardHeader>
                <M3CardTitle>Implementation Guidelines</M3CardTitle>
                <M3CardDescription>
                  Best practices for implementing the design system in components
                </M3CardDescription>
              </M3CardHeader>
              <M3CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">CSS Custom Properties</h4>
                    <div className="bg-surface-container-high rounded-lg p-4">
                      <pre className="text-xs text-foreground overflow-x-auto">
                        {`.my-component {
  background-color: var(--surface-container);
  color: var(--on-surface);
  border: 1px solid var(--outline-variant);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  transition: all var(--motion-duration-short4) 
              var(--motion-easing-standard);
}`}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Tailwind CSS Classes</h4>
                    <div className="bg-surface-container-high rounded-lg p-4">
                      <pre className="text-xs text-foreground overflow-x-auto">
                        {`<div className="
  bg-surface-container 
  text-on-surface 
  border border-outline-variant 
  rounded-lg 
  p-6 
  transition-short4 
  ease-standard
">
  Content
</div>`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4 text-brand-primary" />
                    <h4 className="font-medium text-brand-primary">Design Token Rules</h4>
                  </div>
                  <ul className="text-sm text-foreground space-y-1">
                    <li>• Always use design tokens instead of hardcoded values</li>
                    <li>• Prefer Material 3 surface hierarchy for backgrounds</li>
                    <li>• Use semantic color tokens (primary, secondary, error)</li>
                    <li>• Apply consistent motion duration and easing</li>
                    <li>• Maintain proper elevation levels for depth</li>
                  </ul>
                </div>
              </M3CardContent>
            </M3Card>
          </section>

          {/* Accessibility */}
          <section>
            <h2 className="text-xl font-medium mb-6 text-foreground">Accessibility Standards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <M3Card variant="default">
                <M3CardHeader>
                  <M3CardTitle>Color Contrast</M3CardTitle>
                  <M3CardDescription>
                    All color combinations meet WCAG 2.1 AA standards
                  </M3CardDescription>
                </M3CardHeader>
                <M3CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-primary rounded-lg">
                      <span className="text-on-primary font-medium">Primary / On Primary</span>
                      <Badge variant="secondary" className="bg-green-600">
                        AAA
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                      <span className="text-on-surface">Surface / On Surface</span>
                      <Badge variant="secondary" className="bg-green-600">
                        AAA
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-error rounded-lg">
                      <span className="text-on-error font-medium">Error / On Error</span>
                      <Badge variant="secondary" className="bg-green-600">
                        AAA
                      </Badge>
                    </div>
                  </div>
                </M3CardContent>
              </M3Card>

              <M3Card variant="default">
                <M3CardHeader>
                  <M3CardTitle>Focus Management</M3CardTitle>
                  <M3CardDescription>
                    Visible focus indicators and proper keyboard navigation
                  </M3CardDescription>
                </M3CardHeader>
                <M3CardContent className="space-y-3">
                  <div className="space-y-2">
                    <M3Button
                      variant="outlined"
                      className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Focusable Button
                    </M3Button>
                    <div className="p-3 bg-surface-container-high rounded-lg border border-outline-variant focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
                      <input
                        className="w-full bg-transparent text-on-surface focus:outline-none"
                        placeholder="Focus state example"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Focus rings use primary color with 2px width and 2px offset
                  </p>
                </M3CardContent>
              </M3Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
