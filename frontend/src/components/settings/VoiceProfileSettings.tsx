import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Button, Alert } from '../ui';

export interface VoiceProfile {
  tone: string[];
  common_phrases: string[];
  skill_keywords: string[];
}

interface VoiceProfileSettingsProps {
  voiceProfile: VoiceProfile | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

export const VoiceProfileSettings: React.FC<VoiceProfileSettingsProps> = ({
  voiceProfile,
  isGenerating,
  onGenerate,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Profile</CardTitle>
        <CardDescription>
          Generate a personalized voice profile to help tailor your documents to
          your writing style.
        </CardDescription>
      </CardHeader>
      <div className="p-6">
        {!voiceProfile ? (
          <div className="text-center py-8">
            <Alert variant="info" className="mb-6">
              No voice profile generated yet. Create one to personalize your
              document generation.
            </Alert>
            <Button onClick={onGenerate} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Voice Profile'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Voice Profile
                </h3>
                <p className="text-sm text-gray-600">
                  Personalized writing style analysis
                </p>
              </div>
              <Button
                onClick={onGenerate}
                disabled={isGenerating}
                variant="secondary"
                size="sm"
              >
                {isGenerating ? 'Regenerating...' : 'Regenerate'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Tone</h4>
                <div className="flex flex-wrap gap-1">
                  {voiceProfile.tone.map((item, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Common Phrases
                </h4>
                <div className="flex flex-wrap gap-1">
                  {voiceProfile.common_phrases.map((phrase, index) => (
                    <span
                      key={index}
                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Skill Keywords
                </h4>
                <div className="flex flex-wrap gap-1">
                  {voiceProfile.skill_keywords.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
