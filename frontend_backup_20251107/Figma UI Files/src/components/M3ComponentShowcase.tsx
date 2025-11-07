import React from 'react';
import {
  ArrowLeft,
  Settings,
  Plus,
  Search,
  User,
  Mail,
  Phone,
  Star,
  Filter,
  Tag,
  Download,
  ChevronDown,
} from 'lucide-react';
import { Button } from './ui/button';
import { M3Button } from './ui/m3-button';
import {
  M3Card,
  M3CardHeader,
  M3CardTitle,
  M3CardDescription,
  M3CardContent,
  M3CardFooter,
} from './ui/m3-card';
import { M3Input } from './ui/m3-input';
import { M3FAB } from './ui/m3-fab';
import { M3Chip } from './ui/m3-chip';
import { M3Select, M3SelectOption } from './ui/m3-select';
import { M3Checkbox } from './ui/m3-checkbox';

interface M3ComponentShowcaseProps {
  onBack?: () => void;
}

export function M3ComponentShowcase({ onBack }: M3ComponentShowcaseProps) {
  const [selectedCard, setSelectedCard] = React.useState<string | null>('option2');
  const [filterChips, setFilterChips] = React.useState<string[]>(['design', 'frontend']);
  const [selectValue, setSelectValue] = React.useState<string>('medium');
  const [checkboxStates, setCheckboxStates] = React.useState({
    notifications: true,
    marketing: false,
    analytics: true,
  });

  const selectOptions: M3SelectOption[] = [
    { value: 'small', label: 'Small', icon: <div className="w-3 h-3 bg-blue-400 rounded-full" /> },
    {
      value: 'medium',
      label: 'Medium',
      icon: <div className="w-3 h-3 bg-green-400 rounded-full" />,
    },
    { value: 'large', label: 'Large', icon: <div className="w-3 h-3 bg-red-400 rounded-full" /> },
    {
      value: 'xlarge',
      label: 'X-Large',
      icon: <div className="w-3 h-3 bg-purple-400 rounded-full" />,
    },
  ];

  const toggleFilterChip = (chipValue: string) => {
    setFilterChips((prev) =>
      prev.includes(chipValue) ? prev.filter((v) => v !== chipValue) : [...prev, chipValue]
    );
  };

  const removeInputChip = (chipValue: string) => {
    setFilterChips((prev) => prev.filter((v) => v !== chipValue));
  };

  return (
    <div className="min-h-screen bg-[var(--md-sys-color-background)] text-[var(--md-sys-color-on-background)]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-semibold text-[var(--md-sys-color-on-background)]">
              Material 3 Component Library
            </h1>
            <p className="text-[var(--md-sys-color-on-surface-variant)] mt-2">
              Complete Material 3 components following strict design token guidelines
            </p>
          </div>
        </div>

        <div className="space-y-12">
          {/* Buttons Section */}
          <section>
            <h2 className="text-xl font-medium mb-6 text-[var(--md-sys-color-on-surface)]">
              Buttons
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Button Variants */}
              <M3Card variant="default">
                <M3CardHeader>
                  <M3CardTitle>Button Variants</M3CardTitle>
                  <M3CardDescription>
                    Standard Material 3 button variants with proper elevation and motion
                  </M3CardDescription>
                </M3CardHeader>
                <M3CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <M3Button variant="filled" icon={<Plus className="w-4 h-4" />}>
                      Create Document
                    </M3Button>
                    <M3Button variant="outlined" icon={<Settings className="w-4 h-4" />}>
                      Settings
                    </M3Button>
                    <M3Button variant="text">Learn More</M3Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <M3Button variant="elevated" icon={<Download className="w-4 h-4" />}>
                      Download
                    </M3Button>
                    <M3Button variant="tonal" trailingIcon={<ChevronDown className="w-4 h-4" />}>
                      Options
                    </M3Button>
                  </div>
                </M3CardContent>
              </M3Card>

              {/* FAB Variants */}
              <M3Card variant="default">
                <M3CardHeader>
                  <M3CardTitle>Floating Action Buttons</M3CardTitle>
                  <M3CardDescription>
                    Material 3 FABs with elevation level 3 and proper motion
                  </M3CardDescription>
                </M3CardHeader>
                <M3CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <M3FAB variant="primary" size="small" icon={<Plus className="w-5 h-5" />} />
                    <M3FAB variant="primary" size="medium" icon={<Plus className="w-6 h-6" />} />
                    <M3FAB variant="primary" size="large" icon={<Plus className="w-7 h-7" />} />
                  </div>
                  <div className="flex items-center gap-4">
                    <M3FAB variant="secondary" extended icon={<Mail className="w-5 h-5" />}>
                      Compose
                    </M3FAB>
                    <M3FAB variant="surface" icon={<Settings className="w-5 h-5" />} />
                  </div>
                </M3CardContent>
              </M3Card>
            </div>
          </section>

          {/* Cards Section */}
          <section>
            <h2 className="text-xl font-medium mb-6 text-[var(--md-sys-color-on-surface)]">
              Cards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Default Card */}
              <M3Card variant="default">
                <M3CardHeader>
                  <M3CardTitle>Resume Template</M3CardTitle>
                  <M3CardDescription>
                    Modern professional template optimized for ATS systems
                  </M3CardDescription>
                </M3CardHeader>
                <M3CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">4.8/5 rating</span>
                    </div>
                    <div className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                      Used by 2,400+ professionals
                    </div>
                  </div>
                </M3CardContent>
              </M3Card>

              {/* Interactive Card */}
              <M3Card
                variant="interactive"
                onClick={() => setSelectedCard(selectedCard === 'option2' ? null : 'option2')}
              >
                <M3CardHeader>
                  <M3CardTitle>Cover Letter Builder</M3CardTitle>
                  <M3CardDescription>
                    AI-powered cover letter generation with job matching
                  </M3CardDescription>
                </M3CardHeader>
                <M3CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">Ready to use</span>
                    </div>
                    <div className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                      Click to select this option
                    </div>
                  </div>
                </M3CardContent>
              </M3Card>

              {/* Selected Card */}
              <M3Card variant="selected">
                <M3CardHeader>
                  <M3CardTitle>ATS Optimization</M3CardTitle>
                  <M3CardDescription>
                    Advanced resume analysis and keyword optimization
                  </M3CardDescription>
                </M3CardHeader>
                <M3CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm">Currently selected</span>
                    </div>
                    <div className="text-sm text-[var(--md-sys-color-on-primary-container)]">
                      This option is active
                    </div>
                  </div>
                </M3CardContent>
              </M3Card>
            </div>
          </section>

          {/* Form Components Section */}
          <section>
            <h2 className="text-xl font-medium mb-6 text-[var(--md-sys-color-on-surface)]">
              Form Components
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Text Fields */}
              <M3Card variant="default">
                <M3CardHeader>
                  <M3CardTitle>Text Fields</M3CardTitle>
                  <M3CardDescription>
                    Material 3 outlined text fields with floating labels
                  </M3CardDescription>
                </M3CardHeader>
                <M3CardContent className="space-y-6">
                  <M3Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    helperText="This will appear on your resume"
                    leadingIcon={<User className="w-4 h-4" />}
                  />
                  <M3Input
                    label="Email Address"
                    type="email"
                    placeholder="your.email@example.com"
                    leadingIcon={<Mail className="w-4 h-4" />}
                  />
                  <M3Input
                    label="Phone Number"
                    error
                    errorText="Please enter a valid phone number"
                    leadingIcon={<Phone className="w-4 h-4" />}
                  />
                </M3CardContent>
              </M3Card>

              {/* Select & Checkboxes */}
              <M3Card variant="default">
                <M3CardHeader>
                  <M3CardTitle>Select & Checkboxes</M3CardTitle>
                  <M3CardDescription>Dropdown selects and checkbox components</M3CardDescription>
                </M3CardHeader>
                <M3CardContent className="space-y-6">
                  <M3Select
                    label="Experience Level"
                    options={selectOptions}
                    value={selectValue}
                    onValueChange={setSelectValue}
                    helperText="Select your current experience level"
                  />

                  <div className="space-y-4">
                    <M3Checkbox
                      label="Email notifications"
                      checked={checkboxStates.notifications}
                      onChange={(e) =>
                        setCheckboxStates((prev) => ({
                          ...prev,
                          notifications: e.target.checked,
                        }))
                      }
                      helperText="Receive updates about new features"
                    />
                    <M3Checkbox
                      label="Marketing communications"
                      checked={checkboxStates.marketing}
                      onChange={(e) =>
                        setCheckboxStates((prev) => ({
                          ...prev,
                          marketing: e.target.checked,
                        }))
                      }
                    />
                    <M3Checkbox
                      label="Analytics and performance"
                      checked={checkboxStates.analytics}
                      indeterminate={checkboxStates.analytics}
                      onChange={(e) =>
                        setCheckboxStates((prev) => ({
                          ...prev,
                          analytics: e.target.checked,
                        }))
                      }
                    />
                  </div>
                </M3CardContent>
              </M3Card>
            </div>
          </section>

          {/* Chips Section */}
          <section>
            <h2 className="text-xl font-medium mb-6 text-[var(--md-sys-color-on-surface)]">
              Chips
            </h2>
            <M3Card variant="default">
              <M3CardHeader>
                <M3CardTitle>Chip Variants</M3CardTitle>
                <M3CardDescription>
                  Different chip types for various use cases including filters and tags
                </M3CardDescription>
              </M3CardHeader>
              <M3CardContent className="space-y-6">
                {/* Assist Chips */}
                <div>
                  <h4 className="font-medium mb-3 text-[var(--md-sys-color-on-surface)]">
                    Assist Chips
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <M3Chip variant="assist" icon={<Search className="w-4 h-4" />}>
                      Search Jobs
                    </M3Chip>
                    <M3Chip variant="assist" icon={<Settings className="w-4 h-4" />}>
                      Settings
                    </M3Chip>
                  </div>
                </div>

                {/* Filter Chips */}
                <div>
                  <h4 className="font-medium mb-3 text-[var(--md-sys-color-on-surface)]">
                    Filter Chips
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['design', 'frontend', 'backend', 'mobile'].map((skill) => (
                      <M3Chip
                        key={skill}
                        variant="filter"
                        selected={filterChips.includes(skill)}
                        onClick={() => toggleFilterChip(skill)}
                      >
                        {skill}
                      </M3Chip>
                    ))}
                  </div>
                </div>

                {/* Input Chips */}
                <div>
                  <h4 className="font-medium mb-3 text-[var(--md-sys-color-on-surface)]">
                    Input Chips
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {filterChips.map((skill) => (
                      <M3Chip
                        key={skill}
                        variant="input"
                        removable
                        onRemove={() => removeInputChip(skill)}
                        icon={<Tag className="w-4 h-4" />}
                      >
                        {skill}
                      </M3Chip>
                    ))}
                  </div>
                </div>

                {/* Suggestion Chips */}
                <div>
                  <h4 className="font-medium mb-3 text-[var(--md-sys-color-on-surface)]">
                    Suggestion Chips
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <M3Chip variant="suggestion">React</M3Chip>
                    <M3Chip variant="suggestion">TypeScript</M3Chip>
                    <M3Chip variant="suggestion">Node.js</M3Chip>
                  </div>
                </div>
              </M3CardContent>
            </M3Card>
          </section>

          {/* Usage Guidelines */}
          <section>
            <M3Card variant="default">
              <M3CardHeader>
                <M3CardTitle>Implementation Notes</M3CardTitle>
                <M3CardDescription>
                  Key points about using these Material 3 components
                </M3CardDescription>
              </M3CardHeader>
              <M3CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-[var(--md-sys-color-on-surface)]">
                      Design Tokens
                    </h4>
                    <ul className="space-y-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">
                      <li>• Uses exact CSS variable tokens from theme-tokens.css</li>
                      <li>• Follows Material 3 color semantics strictly</li>
                      <li>• Proper contrast ratios maintained</li>
                      <li>• Surface hierarchy correctly implemented</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-[var(--md-sys-color-on-surface)]">
                      Motion & Interaction
                    </h4>
                    <ul className="space-y-2 text-sm text-[var(--md-sys-color-on-surface-variant)]">
                      <li>• Material 3 duration and easing curves</li>
                      <li>• Proper elevation system (levels 0-5)</li>
                      <li>• Interactive state management</li>
                      <li>• Accessibility compliant focus states</li>
                    </ul>
                  </div>
                </div>
              </M3CardContent>
            </M3Card>
          </section>
        </div>
      </div>
    </div>
  );
}
