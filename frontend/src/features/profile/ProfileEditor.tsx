/**
 * ELECTRIC ALCHEMIST: PROFILE EDITOR
 *
 * Profile editor form using Electric Alchemist Design System v4.4.
 * PERFORMANCE OPTIMIZED: Memoized handlers and functional state updates
 */

import React, { useState, useCallback } from 'react';
import { Person, Briefcase, ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Container, Card, Button, Input, Textarea, Grid } from '@/components';
import { cn } from '@/lib/utils';

export interface ProfileEditorProps {
  profile?: any;
  onNext: () => void;
  onBack: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onNext, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || 'Nishant Dougall',
    email: profile?.email || 'nishant.dougall@email.com',
    phone: profile?.phone || '+61 4XX XXX XXX',
    summary: profile?.summary || '',
  });

  // Memoize field change handler using functional updates
  const handleFieldChange = useCallback((field: keyof typeof formData) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }, []);

  // Memoize AI generation handler
  const handleGenerateSummary = useCallback(async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        summary: 'Experienced professional with a strong background in...',
      }));
      setIsGenerating(false);
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen bg-surface py-8 flex items-center">
      <Container size="lg">
        <div className="text-center mb-8">
          <h1 className="text-hero text-3xl font-semibold mb-2">Review Your Profile</h1>
          <p className="text-human text-base text-on-surface-variant">
            AI-extracted information from your uploaded documents. Review and enhance below.
          </p>
        </div>

        <Grid cols={2} gap="lg" className="mb-6">
          <Card variant="default" className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary-container/20">
                <Person className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-hero text-lg font-semibold">Personal Information</h2>
            </div>
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={handleFieldChange('fullName')}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleFieldChange('email')}
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={handleFieldChange('phone')}
              />
            </div>
          </Card>

          <Card variant="default" className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-secondary-container/20">
                <Briefcase className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="text-hero text-lg font-semibold">Experience</h2>
            </div>
            <div className="space-y-4">
              <Textarea
                label="Professional Summary"
                placeholder="Your summary..."
                rows={4}
                value={formData.summary}
                onChange={handleFieldChange('summary')}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateSummary}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>
            </div>
          </Card>
        </Grid>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button variant="default" onClick={onNext}>
            Save & Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default ProfileEditor;
