import { ColorSwatch } from '@/components/style-guide/ColorSwatch';

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
    <div className="container mx-auto py-12 px-4">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Aurora Design System</h1>
        <p className="text-muted-foreground">
          A comprehensive guide to the Aurora design system colors and components
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Color Palette</h2>
        <div className="space-y-12">
          {colorGroups.map((group, index) => (
            <div key={index}>
              <h3 className="text-xl font-medium mb-4">{group.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Color Usage</h2>
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Text Colors</h3>
          <div className="space-y-4">
            <p className="text-primary">Primary Text (text-primary)</p>
            <p className="text-secondary">Secondary Text (text-secondary)</p>
            <p className="text-muted-foreground">Muted Text (text-muted-foreground)</p>
            <p className="text-destructive">Destructive Text (text-destructive)</p>
          </div>

          <h3 className="text-lg font-medium mt-8 mb-4">Backgrounds</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background p-4 rounded-lg border">
              <p>Background (bg-background)</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <p>Card (bg-card)</p>
            </div>
            <div className="bg-popover p-4 rounded-lg text-popover-foreground">
              <p>Popover (bg-popover)</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Accessibility</h2>
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Contrast Ratios</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">AA (Minimum):</span> 4.5:1 for normal text, 3:1 for
              large text
            </p>
            <p>
              <span className="font-medium">AAA (Enhanced):</span> 7:1 for normal text, 4.5:1 for
              large text
            </p>
            <div className="mt-4 p-4 bg-destructive/10 text-destructive-foreground rounded">
              <p className="font-medium">Note:</p>
              <p>Colors with contrast ratio below 4.5:1 will be marked with a warning indicator.</p>
              <p>Always test colors with real content and in context.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
