import { ColorSwatch } from '@/components/style-guide/ColorSwatch';
import { Box } from '@mui/material';

export default function StyleGuidePage() {
  const colorGroups = [
    {
      title: 'Primary Colors',
      colors: [
        { name: 'Primary', value: 'var(--color-primary)', text: 'var(--color-on-primary)' },
        {
          name: 'Primary Container',
          value: 'var(--color-primary-container)',
          text: 'var(--color-on-primary-container)',
        },
        { name: 'Primary 10%', value: 'var(--color-primary-10)' },
        { name: 'Primary 20%', value: 'var(--color-primary-20)' },
        { name: 'Primary 30%', value: 'var(--color-primary-30)' },
      ],
    },
    {
      title: 'Secondary Colors',
      colors: [
        { name: 'Secondary', value: 'var(--color-secondary)', text: 'var(--color-on-secondary)' },
        {
          name: 'Secondary Container',
          value: 'var(--color-secondary-container)',
          text: 'var(--color-on-secondary-container)',
        },
      ],
    },
    {
      title: 'Tertiary Colors',
      colors: [
        { name: 'Tertiary', value: 'var(--color-tertiary)', text: 'var(--color-on-tertiary)' },
        {
          name: 'Tertiary Container',
          value: 'var(--color-tertiary-container)',
          text: 'var(--color-on-tertiary-container)',
        },
      ],
    },
    {
      title: 'Semantic Colors',
      colors: [
        { name: 'Error', value: 'var(--color-error)', text: 'var(--color-on-error)' },
        {
          name: 'Error Container',
          value: 'var(--color-error-container)',
          text: 'var(--color-on-error-container)',
        },
        { name: 'Success', value: 'var(--color-success)', text: 'var(--color-on-success)' },
        { name: 'Warning', value: 'var(--color-warning)', text: 'var(--color-on-warning)' },
      ],
    },
    {
      title: 'Surface Colors',
      colors: [
        {
          name: 'Background',
          value: 'var(--color-background)',
          text: 'var(--color-on-background)',
        },
        { name: 'Surface', value: 'var(--color-surface)', text: 'var(--color-on-surface)' },
        {
          name: 'Surface Variant',
          value: 'var(--color-surface-variant)',
          text: 'var(--color-on-surface-variant)',
        },
      ],
    },
    {
      title: 'Surface Containers',
      colors: [
        { name: 'Surface Lowest', value: 'var(--color-surface-container-lowest)' },
        { name: 'Surface Low', value: 'var(--color-surface-container-low)' },
        { name: 'Surface', value: 'var(--color-surface-container)' },
        { name: 'Surface High', value: 'var(--color-surface-container-high)' },
        { name: 'Surface Highest', value: 'var(--color-surface-container-highest)' },
      ],
    },
  ];

  return (
    <div sx={{
      "container": true,
      "mx-auto": true,
      py: 12,
      px: 4
    }}>
      <header sx={{
      mb: 12
    }}>
        <h1 sx={{
      typography: h2,
      fontWeight: 700,
      mb: 2
    }}>Aurora Design System</h1>
        <p sx={{
      "text-muted-foreground": true
    }}>
          A comprehensive guide to the Aurora design system colors and components
        </p>
      </header>

      <section sx={{
      mb: 16
    }}>
        <h2 sx={{
      typography: h4,
      fontWeight: 600,
      mb: 6
    }}>Color Palette</h2>
        <div sx={{
      "space-y-12": true
    }}>
          {colorGroups.map((group, index) => (
            <div key={index}>
              <h3 sx={{
      typography: h5,
      fontWeight: 500,
      mb: 4
    }}>{group.title}</h3>
              <div sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('xs')]: { "grid-cols-2": true },
      [theme.breakpoints.up('sm')]: { "grid-cols-3": true },
      [theme.breakpoints.up('md')]: { "grid-cols-4": true },
      [theme.breakpoints.up('lg')]: { "grid-cols-5": true },
      gap: 4
    }}>
                {group.colors.map((color, colorIndex) => (
                  <ColorSwatch
                    key={colorIndex}
                    name={color.name}
                    color={color.value}
                    textColor={color.text || 'auto'}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section sx={{
      mb: 16
    }}>
        <h2 sx={{
      typography: h4,
      fontWeight: 600,
      mb: 6
    }}>Color Usage</h2>
        <div sx={{
      "bg-card": true,
      p: 6,
      borderRadius: 0.5rem,
      boxShadow: 1
    }}>
          <h3 sx={{
      typography: h6,
      fontWeight: 500,
      mb: 4
    }}>Text Colors</h3>
          <div sx={{
      "space-y-4": true
    }}>
            <p sx={{
      "text-primary": true
    }}>Primary Text (text-primary)</p>
            <p sx={{
      "text-secondary": true
    }}>Secondary Text (text-secondary)</p>
            <p sx={{
      "text-muted-foreground": true
    }}>Muted Text (text-muted-foreground)</p>
            <p sx={{
      "text-destructive": true
    }}>Destructive Text (text-destructive)</p>
          </div>

          <h3 sx={{
      typography: h6,
      fontWeight: 500,
      mt: 8,
      mb: 4
    }}>Backgrounds</h3>
          <div sx={{
      "grid": true,
      "grid-cols-1": true,
      [theme.breakpoints.up('sm')]: { "grid-cols-2": true },
      gap: 4
    }}>
            <div sx={{
      "bg-background": true,
      p: 4,
      borderRadius: 0.5rem,
      border: 1
    }}>
              <p>Background (bg-background)</p>
            </div>
            <div sx={{
      "bg-card": true,
      p: 4,
      borderRadius: 0.5rem,
      border: 1
    }}>
              <p>Card (bg-card)</p>
            </div>
            <div sx={{
      "bg-popover": true,
      p: 4,
      borderRadius: 0.5rem,
      "text-popover-foreground": true
    }}>
              <p>Popover (bg-popover)</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 sx={{
      typography: h4,
      fontWeight: 600,
      mb: 6
    }}>Accessibility</h2>
        <div sx={{
      "bg-card": true,
      p: 6,
      borderRadius: 0.5rem,
      boxShadow: 1
    }}>
          <h3 sx={{
      typography: h6,
      fontWeight: 500,
      mb: 4
    }}>Contrast Ratios</h3>
          <div sx={{
      "space-y-2": true
    }}>
            <p>
              <span sx={{
      fontWeight: 500
    }}>AA (Minimum):</span> 4.5:1 for normal text, 3:1 for
              large text
            </p>
            <p>
              <span sx={{
      fontWeight: 500
    }}>AAA (Enhanced):</span> 7:1 for normal text, 4.5:1 for
              large text
            </p>
            <div sx={{
      mt: 4,
      p: 4,
      "bg-destructive/10": true,
      "text-destructive-foreground": true,
      borderRadius: 0.25rem
    }}>
              <p sx={{
      fontWeight: 500
    }}>Note:</p>
              <p>Colors with contrast ratio below 4.5:1 will be marked with a warning indicator.</p>
              <p>Always test colors with real content and in context.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
