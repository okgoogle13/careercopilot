import React from 'react';

interface ThemePreviewProps {
  themeId: string;
  themeName: string;
  width?: number;
  height?: number;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({
  themeId,
  themeName,
  width = 150,
  height = 150,
}) => {
  // Define theme-specific colors and layouts
  const getThemeStyle = (id: string) => {
    switch (id) {
      case 'professional':
        return {
          backgroundColor: '#DDDBF7',
          textColor: '#8498B5',
          accent: '#6366f1',
        };
      case 'modern':
        return {
          backgroundColor: '#E8F4FD',
          textColor: '#1E40AF',
          accent: '#3B82F6',
        };
      case 'creative':
        return {
          backgroundColor: '#FEF3C7',
          textColor: '#92400E',
          accent: '#F59E0B',
        };
      default:
        return {
          backgroundColor: '#F3F4F6',
          textColor: '#6B7280',
          accent: '#9CA3AF',
        };
    }
  };

  const theme = getThemeStyle(themeId);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns='http://www.w3.org/2000/svg'
      className='rounded border'
    >
      {/* Background */}
      <rect width={width} height={height} fill={theme.backgroundColor} />

      {/* Header bar */}
      <rect x='0' y='0' width={width} height='30' fill={theme.accent} opacity='0.8' />

      {/* Content lines simulation */}
      <rect x='20' y='50' width='80' height='4' fill={theme.textColor} opacity='0.7' />
      <rect x='20' y='60' width='60' height='3' fill={theme.textColor} opacity='0.5' />
      <rect x='20' y='70' width='90' height='3' fill={theme.textColor} opacity='0.5' />

      <rect x='20' y='90' width='70' height='4' fill={theme.textColor} opacity='0.7' />
      <rect x='20' y='100' width='50' height='3' fill={theme.textColor} opacity='0.5' />

      {/* Theme name */}
      <text
        x={width / 2}
        y={height - 20}
        fontFamily='Arial, sans-serif'
        fontSize='12'
        fill={theme.textColor}
        textAnchor='middle'
        dominantBaseline='middle'
        fontWeight='600'
      >
        {themeName}
      </text>
    </svg>
  );
};

export default ThemePreview;
