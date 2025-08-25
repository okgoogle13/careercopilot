import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui';
import { ThemePreview } from '../ThemePreview';

const THEMES = [
  { id: 'professional', name: 'Professional' },
  { id: 'modern', name: 'Modern' },
  { id: 'creative', name: 'Creative' },
];

interface ThemeSettingsProps {
  selectedTheme: string;
  onSelectTheme: (themeId: string) => void;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({
  selectedTheme,
  onSelectTheme,
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>PDF Theme</CardTitle>
        <CardDescription>
          Choose the visual style for your generated PDF documents.
        </CardDescription>
      </CardHeader>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {THEMES.map(theme => (
            <div
              key={theme.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedTheme === theme.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectTheme(theme.id)}
            >
              <div className="mb-3">
                <ThemePreview
                  themeId={theme.id}
                  themeName={theme.name}
                  width={150}
                  height={120}
                />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">{theme.name}</h3>
                {selectedTheme === theme.id && (
                  <span className="text-blue-500 text-sm font-medium">
                    ✓ Selected
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
