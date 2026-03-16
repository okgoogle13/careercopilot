import React from 'react';
import { render, screen } from '@testing-library/react';

(jest as any).unstable_mockModule('@careercopilot/ui', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />,
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
  Switch: ({
    checked,
    onCheckedChange,
  }: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  }) => <button onClick={() => onCheckedChange(!checked)}>{checked ? 'on' : 'off'}</button>,
}));

(jest as any).unstable_mockModule('@/screens/10_settings/SettingsControl', () => ({
  SettingsControl: ({
    children,
    title,
    subtitle,
  }: {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
  }) => (
    <section data-testid="settings-control">
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </section>
  ),
}));

const { Settings } = await import('../Settings');

describe('Settings', () => {
  it('renders inside the SettingsControl shell', () => {
    render(<Settings />);

    expect(screen.getByTestId('settings-control')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText(/Manage your account preferences and settings/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
  });
});
