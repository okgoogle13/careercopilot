import type { Meta, StoryObj } from '@storybook/react';
import { Briefcase, Star } from 'lucide-react';
<<<<<<< HEAD
import { KeralaRageButton } from '../components/ui/KeralaRageButton';
=======
import { KeralaRageButton } from '../components/ui/KeralaRageButton';
>>>>>>> restoration-KR-Rage-Figma-v2.0
import { Stone } from '../components/ui/Stone';

const meta: Meta<typeof Stone> = {
  title: 'Components/UI/Stone',
  component: Stone,
  tags: ['autodocs'],
  argTypes: {
<<<<<<< HEAD
    mode: {
      control: 'select',
      options: ['gallery', 'laboratory'],
    },
=======
>>>>>>> restoration-KR-Rage-Figma-v2.0
    elevation: {
      control: 'select',
      options: ['flat', 'raised', 'floating'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stone>;

export const Default: Story = {
  args: {
<<<<<<< HEAD
    mode: 'gallery',
=======
>>>>>>> restoration-KR-Rage-Figma-v2.0
    elevation: 'raised',
    header: (
      <div className="flex items-center gap-3">
        <Briefcase className="text-primary w-5 h-5" />
        <div>
          <h3 className="text-on-surface font-bold">Job Description</h3>
          <p className="text-on-surface-variant text-sm">Senior Software Engineer</p>
        </div>
      </div>
    ),
    children: (
      <p className="text-on-surface">
        Full-stack development using React, Node.js and GCP. Experience with distributed systems and
        high-scale applications required.
      </p>
    ),
    footer: (
      <div className="flex justify-end gap-3">
<<<<<<< HEAD
        <KeralaRageButton
          variant="text"
          size="sm"
        >
          Later
        </KeralaRageButton>
        <KeralaRageButton size="sm">Apply Now</KeralaRageButton>
=======
        <KeralaRageButton
          variant="tertiary"
          size="sm"
        >
          Later
        </KeralaRageButton>
        <KeralaRageButton size="sm">Apply Now</KeralaRageButton>
>>>>>>> restoration-KR-Rage-Figma-v2.0
      </div>
    ),
  },
};

<<<<<<< HEAD
export const Laboratory: Story = {
  args: {
    mode: 'laboratory',
=======
export const Floating: Story = {
  args: {
>>>>>>> restoration-KR-Rage-Figma-v2.0
    elevation: 'floating',
    header: (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Star className="text-tertiary w-5 h-5" />
          <span className="font-bold">Analytical Report</span>
        </div>
        <span className="bg-tertiary/20 text-tertiary px-2 py-0.5 rounded text-xs font-bold">
          Match Score: 92%
        </span>
      </div>
    ),
    children: (
      <div className="space-y-4">
        <p className="text-sm">
          Your profile is highly compatible with this role. Recommended areas to highlight:
        </p>
        <ul className="list-disc list-inside text-sm opacity-80">
          <li>Microservices architecture</li>
          <li>Kubernetes orchestration</li>
        </ul>
      </div>
    ),
  },
};

export const Minimal: Story = {
  args: {
    children: <p>Just a simple stone with some content inside it.</p>,
  },
};
