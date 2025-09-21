import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ArrowLeft, Palette, Eye, Copy, Check, ChevronRight, Lightbulb, Home, CheckCircle, WaterDrop, Leaf, Sun, Layers } from 'lucide-react';

interface M3ColorSystemShowcaseProps {
  onBack?: () => void;
}

// Material 3 Color System based on Figma reference
const M3_COLORS = {
  // Primary (Blue-Purple)
  primary: {
    100: '#F3F1FF',
    99: '#FEFBFF', 
    98: '#FDF9FF',
    95: '#F0EDFF',
    90: '#E1DEFF',
    80: '#C5BFFF',
    70: '#A99FFF',
    60: '#8E7FFF',
    50: '#7360FF',
    40: '#5941E6',
    35: '#4F39CE',
    30: '#4532B8',
    25: '#3B2BA2',
    20: '#31248C',
    15: '#271D76',
    10: '#1D1660',
    5: '#130F4A',
    0: '#000000'
  },
  
  // Secondary (Purple-Gray)  
  secondary: {
    100: '#FFFFFF',
    99: '#FEFBFF',
    98: '#FDF9FF', 
    95: '#F5F0FF',
    90: '#E9E3F4',
    80: '#CDC7DC',
    70: '#B1ABC0',
    60: '#9690A5',
    50: '#7C758A',
    40: '#625B71',
    35: '#584F66',
    30: '#4E4A5B',
    25: '#444050',
    20: '#3A3645',
    15: '#302C3A',
    10: '#26222F',
    5: '#1C1824',
    0: '#000000'
  },
  
  // Tertiary (Pink)
  tertiary: {
    100: '#FFFFFF',
    99: '#FFFBF9',
    98: '#FFF8F5',
    95: '#FFEBEF',
    90: '#FFD8E4',
    80: '#F0B7CE',
    70: '#D396B8',
    60: '#B775A3',
    50: '#9B548E',
    40: '#7F3475',
    35: '#722B69',
    30: '#65225D',
    25: '#581951',
    20: '#4B1045',
    15: '#3E0739',
    10: '#31002D',
    5: '#240021',
    0: '#000000'
  },
  
  // Error (Red)
  error: {
    100: '#FFFFFF',
    99: '#FFFBF9',
    98: '#FFF8F6',
    95: '#FFEDEA',
    90: '#FFDAD6',
    80: '#FFB4AB',
    70: '#FF8A80',
    60: '#FF6161',
    50: '#DE3730',
    40: '#BA1A1A',
    35: '#A31515',
    30: '#93000A',
    25: '#820005',
    20: '#690005',
    15: '#5F0003',
    10: '#410002',
    5: '#2D0001',
    0: '#000000'
  },
  
  // Neutral
  neutral: {
    100: '#FFFFFF',
    99: '#FFFBFF',
    98: '#FDF9FF',
    95: '#F5F0F5',
    90: '#E9E3E9',
    80: '#CEC7CE',
    70: '#B2ACB2',
    60: '#969197',
    50: '#7B777C',
    40: '#605D62',
    35: '#565357',
    30: '#4C4A4D',
    25: '#424043',
    20: '#383639',
    15: '#2E2C2F',
    10: '#242225',
    5: '#1A181B',
    0: '#000000'
  },
  
  // Neutral Variant (Surface colors)
  neutralVariant: {
    100: '#FFFFFF',
    99: '#FFFBFF',
    98: '#FDF9FF',
    95: '#F5F0F7',
    90: '#E9E3EB',
    80: '#CCC7D0',
    70: '#B0ACB5',
    60: '#95919A',
    50: '#7A7680',
    40: '#605D66',
    35: '#56535C',
    30: '#4C4952',
    25: '#424047',
    20: '#38363D',
    15: '#2E2C33',
    10: '#242229',
    5: '#1A181F',
    0: '#000000'
  }
};

// Precise Color Swatch Component
const ColorSwatch: React.FC<{
  colorName: string;
  hexValue: string;
  tone: string;
  role?: string;
  size?: 'sm' | 'md' | 'lg';
  showCopy?: boolean;
}> = ({ colorName, hexValue, tone, role, size = 'md', showCopy = true }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    if (showCopy) {
      navigator.clipboard.writeText(hexValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-xs', 
    lg: 'w-16 h-16 text-sm'
  };
  
  const textColor = parseInt(tone) > 50 ? '#000' : '#fff';
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={`${sizeClasses[size]} rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg relative group`}
        style={{ backgroundColor: hexValue }}
        onClick={handleCopy}
        title={`${colorName} ${tone}${role ? ` - ${role}` : ''}\nHEX: ${hexValue}`}
      >
        {showCopy && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {copied ? (
              <Check className="w-3 h-3" style={{ color: textColor }} />
            ) : (
              <Copy className="w-3 h-3" style={{ color: textColor }} />
            )}
          </div>
        )}
      </div>
      <div className="text-center">
        <div className="text-xs text-on-surface-variant font-mono">{tone}</div>
        {role && <div className="text-xs text-on-surface-variant opacity-75 mt-1">{role}</div>}
      </div>
    </div>
  );
};

// Complete Tonal Palette Display
const TonalPalette: React.FC<{
  title: string;
  colors: Record<string, string>;
  description: string;
  type: 'primary' | 'secondary' | 'tertiary' | 'error' | 'neutral' | 'neutralVariant';
}> = ({ title, colors, description, type }) => {
  const tones = Object.keys(colors).sort((a, b) => parseInt(b) - parseInt(a));
  
  return (
    <Card className="card-surface overflow-hidden">
      <div className="p-6 border-b border-outline-variant">
        <h3 className="text-lg font-medium text-on-surface mb-2">{title}</h3>
        <p className="text-sm text-on-surface-variant">{description}</p>
      </div>
      
      {/* Tonal Scale Display */}
      <div className="p-6">
        <div className="grid grid-cols-9 gap-2 mb-4">
          {tones.slice(0, 9).map((tone) => (
            <ColorSwatch
              key={tone}
              colorName={title}
              hexValue={colors[tone]}
              tone={tone}
              size="sm"
            />
          ))}
        </div>
        
        {tones.length > 9 && (
          <div className="grid grid-cols-9 gap-2 mb-4">
            {tones.slice(9).map((tone) => (
              <ColorSwatch
                key={tone}
                colorName={title}
                hexValue={colors[tone]}
                tone={tone}
                size="sm"
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Material 3 Role Assignments */}
      <div className="p-6 border-t border-outline-variant bg-surface-container-low/50">
        <h4 className="text-sm font-medium text-on-surface mb-3">Material 3 Role Assignments</h4>
        <div className="grid grid-cols-2 gap-4 text-xs">
          {type === 'primary' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['50'] }}></div>
                <span className="text-on-surface-variant">Primary: 50</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['40'] }}></div>
                <span className="text-on-surface-variant">Primary Container: 40</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['10'] }}></div>
                <span className="text-on-surface-variant">On Primary: 10</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['90'] }}></div>
                <span className="text-on-surface-variant">On Primary Container: 90</span>
              </div>
            </>
          )}
          {type === 'secondary' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['80'] }}></div>
                <span className="text-on-surface-variant">Secondary: 80</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['25'] }}></div>
                <span className="text-on-surface-variant">Secondary Container: 25</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['10'] }}></div>
                <span className="text-on-surface-variant">On Secondary: 10</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['90'] }}></div>
                <span className="text-on-surface-variant">On Secondary Container: 90</span>
              </div>
            </>
          )}
          {type === 'tertiary' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['80'] }}></div>
                <span className="text-on-surface-variant">Tertiary: 80</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['30'] }}></div>
                <span className="text-on-surface-variant">Tertiary Container: 30</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['20'] }}></div>
                <span className="text-on-surface-variant">On Tertiary: 20</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['90'] }}></div>
                <span className="text-on-surface-variant">On Tertiary Container: 90</span>
              </div>
            </>
          )}
          {type === 'error' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['80'] }}></div>
                <span className="text-on-surface-variant">Error: 80</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['30'] }}></div>
                <span className="text-on-surface-variant">Error Container: 30</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['20'] }}></div>
                <span className="text-on-surface-variant">On Error: 20</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['90'] }}></div>
                <span className="text-on-surface-variant">On Error Container: 90</span>
              </div>
            </>
          )}
          {type === 'neutralVariant' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['5'] }}></div>
                <span className="text-on-surface-variant">Surface: 5</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['15'] }}></div>
                <span className="text-on-surface-variant">Surface Container: 15</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['95'] }}></div>
                <span className="text-on-surface-variant">On Surface: 95</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors['60'] }}></div>
                <span className="text-on-surface-variant">Outline: 60</span>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

// Material 3 Dark Scheme Color Roles (matching Figma reference)
const M3ColorRolesDemo: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Primary Color Roles */}
      <Card className="card-surface overflow-hidden">
        <div className="p-4 border-b border-outline-variant">
          <h3 className="font-medium text-on-surface">Primary Colors</h3>
        </div>
        <div className="grid grid-cols-2 gap-0">
          <div className="p-4 flex flex-col items-center justify-center h-24" style={{ backgroundColor: M3_COLORS.primary[50] }}>
            <span className="text-sm font-medium" style={{ color: M3_COLORS.primary[10] }}>Primary</span>
            <span className="text-xs opacity-75" style={{ color: M3_COLORS.primary[10] }}>50</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center h-24" style={{ backgroundColor: M3_COLORS.primary[10] }}>
            <span className="text-sm font-medium" style={{ color: M3_COLORS.primary[90] }}>On Primary</span>
            <span className="text-xs opacity-75" style={{ color: M3_COLORS.primary[90] }}>10</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center h-24" style={{ backgroundColor: M3_COLORS.primary[40] }}>
            <span className="text-sm font-medium" style={{ color: M3_COLORS.primary[90] }}>Primary Container</span>
            <span className="text-xs opacity-75" style={{ color: M3_COLORS.primary[90] }}>40</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center h-24" style={{ backgroundColor: M3_COLORS.primary[90] }}>
            <span className="text-sm font-medium" style={{ color: M3_COLORS.primary[10] }}>On Primary Container</span>
            <span className="text-xs opacity-75" style={{ color: M3_COLORS.primary[10] }}>90</span>
          </div>
        </div>
      </Card>

      {/* Secondary Color Roles */}
      <Card className="card-surface overflow-hidden">
        <div className="p-4 border-b border-outline-variant">
          <h3 className="font-medium text-on-surface">Secondary Colors</h3>
        </div>
        <div className="grid grid-cols-2 gap-0">
          <div className="p-4 flex flex-col items-center justify-center h-24" style={{ backgroundColor: M3_COLORS.secondary[80] }}>
            <span className="text-sm font-medium" style={{ color: M3_COLORS.secondary[10] }}>Secondary</span>
            <span className="text-xs opacity-75" style={{ color: M3_COLORS.secondary[10] }}>80</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center h-24" style={{ backgroundColor: M3_COLORS.secondary[10] }}>
            <span className="text-sm font-medium" style={{ color: M3_COLORS.secondary[90] }}>On Secondary</span>
            <span className="text-xs opacity-75" style={{ color: M3_COLORS.secondary[90] }}>10</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center h-24" style={{ backgroundColor: M3_COLORS.secondary[25] }}>
            <span className="text-sm font-medium" style={{ color: M3_COLORS.secondary[90] }}>Secondary Container</span>
            <span className="text-xs opacity-75" style={{ color: M3_COLORS.secondary[90] }}>25</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center h-24" style={{ backgroundColor: M3_COLORS.secondary[90] }}>
            <span className="text-sm font-medium" style={{ color: M3_COLORS.secondary[10] }}>On Secondary Container</span>
            <span className="text-xs opacity-75" style={{ color: M3_COLORS.secondary[10] }}>90</span>
          </div>
        </div>
      </Card>

      {/* Tertiary Color Roles */}
      <Card className="card-surface overflow-hidden">
        <div className="p-4 border-b border-outline-variant">
          <h3 className="font-medium text-on-surface">Tertiary Colors</h3>
        </div>
        <div className="grid grid-cols-2 gap-0">
          <div className="p-4 flex flex-col items-center justify-center h-24" style={{ backgroundColor: M3_COLORS.tertiary[80] }}>
            <span className="text-sm font-medium" style={{ color: M3_COLORS.tertiary[20] }}>Tertiary</span>
            <span className="text-xs opacity-75" style={{ color: M3_COLORS.tertiary[20] }}>80</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center h-24" style={{ backgroundColor: M3_COLORS.tertiary[20] }}>
            <span className="text-sm font-medium" style={{ color: M3_COLORS.tertiary[90] }}>On Tertiary</span>
            <span className="text-xs opacity-75" style={{ color: M3_COLORS.tertiary[90] }}>20</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center h-24" style={{ backgroundColor: M3_COLORS.tertiary[30] }}>
            <span className="text-sm font-medium" style={{ color: M3_COLORS.tertiary[90] }}>Tertiary Container</span>
            <span className="text-xs opacity-75" style={{ color: M3_COLORS.tertiary[90] }}>30</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center h-24" style={{ backgroundColor: M3_COLORS.tertiary[90] }}>
            <span className="text-sm font-medium" style={{ color: M3_COLORS.tertiary[10] }}>On Tertiary Container</span>
            <span className="text-xs opacity-75" style={{ color: M3_COLORS.tertiary[10] }}>90</span>
          </div>
        </div>
      </Card>

      {/* Error Color Roles */}
      <Card className="card-surface overflow-hidden">
        <div className="p-4 border-b border-outline-variant">
          <h3 className="font-medium text-on-surface">Error Colors</h3>
        </div>
        <div className="grid grid-cols-2 gap-0">
          <div className="p-4 flex flex-col items-center justify-center h-24" style={{ backgroundColor: M3_COLORS.error[80] }}>
            <span className="text-sm font-medium" style={{ color: M3_COLORS.error[20] }}>Error</span>
            <span className="text-xs opacity-75" style={{ color: M3_COLORS.error[20] }}>80</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center h-24" style={{ backgroundColor: M3_COLORS.error[20] }}>
            <span className="text-sm font-medium" style={{ color: M3_COLORS.error[90] }}>On Error</span>
            <span className="text-xs opacity-75" style={{ color: M3_COLORS.error[90] }}>20</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center h-24" style={{ backgroundColor: M3_COLORS.error[30] }}>
            <span className="text-sm font-medium" style={{ color: M3_COLORS.error[90] }}>Error Container</span>
            <span className="text-xs opacity-75" style={{ color: M3_COLORS.error[90] }}>30</span>
          </div>
          <div className="p-4 flex flex-col items-center justify-center h-24" style={{ backgroundColor: M3_COLORS.error[90] }}>
            <span className="text-sm font-medium" style={{ color: M3_COLORS.error[10] }}>On Error Container</span>
            <span className="text-xs opacity-75" style={{ color: M3_COLORS.error[10] }}>90</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Surface Colors Demo (matching Figma neutral variant surface system)
const SurfaceColorsDemo: React.FC = () => {
  const surfaceColors = [
    { name: 'Surface Dim', tone: '5', color: M3_COLORS.neutralVariant[5] },
    { name: 'Surface', tone: '10', color: M3_COLORS.neutralVariant[10] },
    { name: 'Surface Bright', tone: '25', color: M3_COLORS.neutralVariant[25] },
    { name: 'Surf. Container Lowest', tone: '5', color: M3_COLORS.neutralVariant[5] },
    { name: 'Surf. Container Low', tone: '10', color: M3_COLORS.neutralVariant[10] },
    { name: 'Surf. Container', tone: '15', color: M3_COLORS.neutralVariant[15] },
    { name: 'Surf. Container High', tone: '20', color: M3_COLORS.neutralVariant[20] },
    { name: 'Surf. Container Highest', tone: '25', color: M3_COLORS.neutralVariant[25] }
  ];

  const textColors = [
    { name: 'On Surface', tone: '95', color: M3_COLORS.neutralVariant[95] },
    { name: 'On Surface Var.', tone: '80', color: M3_COLORS.neutralVariant[80] },
    { name: 'Outline', tone: '60', color: M3_COLORS.neutralVariant[60] },
    { name: 'Outline Variant', tone: '25', color: M3_COLORS.neutralVariant[25] }
  ];

  const inverseColors = [
    { name: 'Inverse Surface', tone: '90', color: M3_COLORS.neutral[90] },
    { name: 'Inverse On Surface', tone: '20', color: M3_COLORS.neutral[20] },
    { name: 'Inverse Primary', tone: '40', color: M3_COLORS.primary[40] }
  ];

  return (
    <div className="space-y-6">
      {/* Surface Colors */}
      <Card className="card-surface overflow-hidden">
        <div className="p-4 border-b border-outline-variant">
          <h3 className="font-medium text-on-surface">Surface & Container Colors</h3>
        </div>
        <div className="grid grid-cols-4 gap-0">
          {surfaceColors.map((surface, index) => (
            <div 
              key={index}
              className="p-4 flex flex-col items-center justify-center h-20 border-r border-outline-variant last:border-r-0"
              style={{ backgroundColor: surface.color }}
            >
              <span className="text-xs font-medium text-center" style={{ color: M3_COLORS.neutralVariant[90] }}>
                {surface.name}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Text & Outline Colors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-surface overflow-hidden">
          <div className="p-4 border-b border-outline-variant">
            <h3 className="font-medium text-on-surface">Text & Outline Colors</h3>
          </div>
          <div className="grid grid-cols-2 gap-0">
            {textColors.map((text, index) => (
              <div 
                key={index}
                className="p-4 flex flex-col items-center justify-center h-20"
                style={{ backgroundColor: M3_COLORS.neutralVariant[10] }}
              >
                <span className="text-sm font-medium" style={{ color: text.color }}>
                  {text.name}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="card-surface overflow-hidden">
          <div className="p-4 border-b border-outline-variant">
            <h3 className="font-medium text-on-surface">Inverse Colors</h3>
          </div>
          <div className="space-y-0">
            {inverseColors.map((inverse, index) => (
              <div 
                key={index}
                className="p-4 flex items-center justify-between border-b border-outline-variant last:border-b-0"
                style={{ backgroundColor: index === 0 ? inverse.color : M3_COLORS.neutralVariant[10] }}
              >
                <span className="text-sm font-medium" style={{ 
                  color: index === 0 ? M3_COLORS.neutral[20] : inverse.color 
                }}>
                  {inverse.name}
                </span>
                <div 
                  className="w-4 h-4 rounded-full border border-outline-variant"
                  style={{ backgroundColor: inverse.color }}
                ></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Plant Care App Example (inspired by Figma reference image 3)
const PlantCareAppExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');

  return (
    <Card className="card-surface overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-outline-variant" style={{ backgroundColor: M3_COLORS.neutralVariant[10] }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-serif" style={{ color: M3_COLORS.neutralVariant[95] }}>
            Today
          </h1>
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: M3_COLORS.neutralVariant[25] }}
          >
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: M3_COLORS.neutralVariant[80] }}></div>
          </div>
        </div>
        
        {/* Tip Card */}
        <div 
          className="p-4 rounded-2xl flex items-start gap-3"
          style={{ backgroundColor: M3_COLORS.tertiary[30] }}
        >
          <Lightbulb className="w-5 h-5 mt-0.5" style={{ color: M3_COLORS.tertiary[90] }} />
          <p className="text-sm leading-relaxed" style={{ color: M3_COLORS.tertiary[90] }}>
            During the winter your plants slow down and need less water.
          </p>
        </div>
      </div>

      {/* Plant Categories */}
      <div className="p-6 space-y-6" style={{ backgroundColor: M3_COLORS.neutralVariant[5] }}>
        {/* Living Room */}
        <div>
          <h2 className="text-lg font-serif mb-4" style={{ color: M3_COLORS.primary[80] }}>
            Living Room
          </h2>
          <div className="space-y-3">
            <div 
              className="p-4 rounded-2xl flex items-center gap-4"
              style={{ backgroundColor: M3_COLORS.neutralVariant[15] }}
            >
              <CheckCircle className="w-5 h-5" style={{ color: M3_COLORS.primary[80] }} />
              <div className="flex-1">
                <h4 className="font-medium" style={{ color: M3_COLORS.primary[80] }}>Water</h4>
                <p className="text-sm" style={{ color: M3_COLORS.neutralVariant[80] }}>hoya australis</p>
              </div>
              <div className="relative w-12 h-12">
                <Leaf className="w-full h-full" style={{ color: '#4ADE80' }} />
              </div>
            </div>
            
            <div 
              className="p-4 rounded-2xl flex items-center gap-4"
              style={{ backgroundColor: M3_COLORS.neutralVariant[15] }}
            >
              <CheckCircle className="w-5 h-5" style={{ color: M3_COLORS.primary[80] }} />
              <div className="flex-1">
                <h4 className="font-medium" style={{ color: M3_COLORS.primary[80] }}>Feed</h4>
                <p className="text-sm" style={{ color: M3_COLORS.neutralVariant[80] }}>monstera siltepecana</p>
              </div>
              <div className="relative w-12 h-12">
                <Leaf className="w-full h-full" style={{ color: '#10B981' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Kitchen */}
        <div>
          <h2 className="text-lg font-serif mb-4" style={{ color: M3_COLORS.primary[80] }}>
            Kitchen
          </h2>
          <div 
            className="p-4 rounded-2xl flex items-center gap-4"
            style={{ backgroundColor: M3_COLORS.neutralVariant[15] }}
          >
            <CheckCircle className="w-5 h-5" style={{ color: M3_COLORS.primary[80] }} />
            <div className="flex-1">
              <h4 className="font-medium" style={{ color: M3_COLORS.primary[80] }}>Water</h4>
              <p className="text-sm" style={{ color: M3_COLORS.neutralVariant[80] }}>pilea peperomioides</p>
            </div>
            <div className="relative w-12 h-12">
              <Leaf className="w-full h-full" style={{ color: '#059669' }} />
            </div>
          </div>
        </div>

        {/* Bedroom */}
        <div>
          <h2 className="text-lg font-serif mb-4" style={{ color: M3_COLORS.primary[80] }}>
            Bedroom
          </h2>
          <div 
            className="p-4 rounded-2xl flex items-center gap-4"
            style={{ backgroundColor: M3_COLORS.neutralVariant[15] }}
          >
            <CheckCircle className="w-5 h-5" style={{ color: M3_COLORS.primary[80] }} />
            <div className="flex-1">
              <h4 className="font-medium" style={{ color: M3_COLORS.primary[80] }}>Feed</h4>
              <p className="text-sm" style={{ color: M3_COLORS.neutralVariant[80] }}>monstera siltepecana</p>
            </div>
            <div className="relative w-12 h-12">
              <Leaf className="w-full h-full" style={{ color: '#047857' }} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const M3ColorSystemShowcase: React.FC<M3ColorSystemShowcaseProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'colors' | 'palettes' | 'application'>('overview');

  const palettes = [
    {
      title: 'Primary',
      colors: M3_COLORS.primary,
      description: 'High emphasis actions, key components, and active states',
      type: 'primary' as const
    },
    {
      title: 'Secondary', 
      colors: M3_COLORS.secondary,
      description: 'Less prominent actions and secondary information',
      type: 'secondary' as const
    },
    {
      title: 'Tertiary',
      colors: M3_COLORS.tertiary,
      description: 'Contrasting accent for balance and emphasis',
      type: 'tertiary' as const
    },
    {
      title: 'Error',
      colors: M3_COLORS.error,
      description: 'Error states and destructive actions',
      type: 'error' as const
    },
    {
      title: 'Neutral',
      colors: M3_COLORS.neutral,
      description: 'Text, icons, and subtle backgrounds',
      type: 'neutral' as const
    },
    {
      title: 'Neutral Variant',
      colors: M3_COLORS.neutralVariant,
      description: 'Surfaces, outlines, and disabled states',
      type: 'neutralVariant' as const
    }
  ];

  const navigationSections = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'colors', label: 'Color Roles', icon: Palette },
    { id: 'palettes', label: 'Tonal Palettes', icon: Layers },
    { id: 'application', label: 'Application Example', icon: Home }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: M3_COLORS.neutralVariant[5] }}>
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg border-b" 
           style={{ 
             backgroundColor: `${M3_COLORS.neutralVariant[5]}CC`, 
             borderColor: M3_COLORS.neutralVariant[25] 
           }}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBack}
                  className="hover:bg-surface-container"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-serif font-medium mb-1"
                    style={{ color: M3_COLORS.neutralVariant[95] }}>
                  Material 3 Color System
                </h1>
                <p style={{ color: M3_COLORS.neutralVariant[80] }}>
                  Complete Aurora theme following Material Design 3 Expressive specifications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 border-primary/20" style={{ color: M3_COLORS.primary[80] }}>
                <Palette className="w-3 h-3 mr-1" />
                M3 Expressive
              </Badge>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mt-4">
            {navigationSections.map((section) => {
              const Icon = section.icon;
              return (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveSection(section.id as any)}
                  className={
                    activeSection === section.id
                      ? 'bg-primary text-on-primary'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {section.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <Card className="card-surface overflow-hidden">
              <div className="p-6 border-b border-outline-variant">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${M3_COLORS.primary[50]}20` }}>
                    <Eye className="w-6 h-6" style={{ color: M3_COLORS.primary[80] }} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-medium mb-2" style={{ color: M3_COLORS.neutralVariant[95] }}>
                      Aurora Theme Implementation
                    </h2>
                    <p className="mb-4" style={{ color: M3_COLORS.neutralVariant[80] }}>
                      Built on Material 3's systematic approach to color, using scientifically-crafted tonal palettes 
                      that ensure consistent contrast ratios and accessibility compliance across all UI elements.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center"
                       style={{ backgroundColor: M3_COLORS.primary[50] }}>
                    <span className="text-lg font-medium" style={{ color: M3_COLORS.primary[10] }}>
                      P
                    </span>
                  </div>
                  <h4 className="font-medium mb-1" style={{ color: M3_COLORS.neutralVariant[95] }}>
                    Primary Color
                  </h4>
                  <p className="text-sm" style={{ color: M3_COLORS.neutralVariant[80] }}>
                    {M3_COLORS.primary[50]}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center"
                       style={{ backgroundColor: M3_COLORS.tertiary[80] }}>
                    <span className="text-lg font-medium" style={{ color: M3_COLORS.tertiary[20] }}>
                      T
                    </span>
                  </div>
                  <h4 className="font-medium mb-1" style={{ color: M3_COLORS.neutralVariant[95] }}>
                    Tertiary Accent
                  </h4>
                  <p className="text-sm" style={{ color: M3_COLORS.neutralVariant[80] }}>
                    {M3_COLORS.tertiary[80]}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center"
                       style={{ backgroundColor: M3_COLORS.neutralVariant[15] }}>
                    <span className="text-lg font-medium" style={{ color: M3_COLORS.neutralVariant[95] }}>
                      S
                    </span>
                  </div>
                  <h4 className="font-medium mb-1" style={{ color: M3_COLORS.neutralVariant[95] }}>
                    Surface System
                  </h4>
                  <p className="text-sm" style={{ color: M3_COLORS.neutralVariant[80] }}>
                    5-Level Elevation
                  </p>
                </div>
              </div>
            </Card>
            
            {/* Quick Color Roles Preview */}
            <SurfaceColorsDemo />
          </div>
        )}

        {/* Color Roles Section */}
        {activeSection === 'colors' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium mb-2" style={{ color: M3_COLORS.neutralVariant[95] }}>
                Material 3 Color Roles
              </h2>
              <p style={{ color: M3_COLORS.neutralVariant[80] }}>
                Semantic color assignments following Material Design 3 dark theme specifications.
              </p>
            </div>
            
            <M3ColorRolesDemo />
          </div>
        )}

        {/* Tonal Palettes Section */}
        {activeSection === 'palettes' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium mb-2" style={{ color: M3_COLORS.neutralVariant[95] }}>
                Complete Tonal Palettes
              </h2>
              <p style={{ color: M3_COLORS.neutralVariant[80] }}>
                Full tonal scales from 100 (lightest) to 0 (darkest) for each color family.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {palettes.map((palette) => (
                <TonalPalette 
                  key={palette.type}
                  title={palette.title}
                  colors={palette.colors}
                  description={palette.description}
                  type={palette.type}
                />
              ))}
            </div>
          </div>
        )}

        {/* Application Example Section */}
        {activeSection === 'application' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium mb-2" style={{ color: M3_COLORS.neutralVariant[95] }}>
                Practical Application Example
              </h2>
              <p style={{ color: M3_COLORS.neutralVariant[80] }}>
                Inspired by the Figma reference, this plant care app demonstrates proper color usage, 
                typography hierarchy, and Material 3 principles in action.
              </p>
            </div>
            
            <div className="flex justify-center">
              <PlantCareAppExample />
            </div>
            
            {/* Implementation Notes */}
            <Card className="card-surface">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4" style={{ color: M3_COLORS.neutralVariant[95] }}>
                  Implementation Guidelines
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-medium mb-2" style={{ color: M3_COLORS.neutralVariant[95] }}>
                      Color Usage
                    </h4>
                    <ul className="space-y-1" style={{ color: M3_COLORS.neutralVariant[80] }}>
                      <li>• Use semantic color tokens for consistency</li>
                      <li>• Maintain 4.5:1 contrast ratio minimum</li>
                      <li>• Apply tonal palettes systematically</li>
                      <li>• Test in both light and dark modes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2" style={{ color: M3_COLORS.neutralVariant[95] }}>
                      Typography
                    </h4>
                    <ul className="space-y-1" style={{ color: M3_COLORS.neutralVariant[80] }}>
                      <li>• Expressive serif for display text</li>
                      <li>• System fonts for body content</li>
                      <li>• Consistent hierarchy and spacing</li>
                      <li>• Proper line height and letterspacing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default M3ColorSystemShowcase;