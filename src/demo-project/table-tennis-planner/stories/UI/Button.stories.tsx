import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Button from '@/components/ui/Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['glass', 'glass-accent', 'primary', 'secondary', 'ghost'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: { children: 'Speichern', variant: 'glass', size: 'md' },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Glass: Story = { args: { variant: 'glass' } };

export const GlassAccent: Story = {
  args: { variant: 'glass-accent', children: 'Bestätigen' },
};

export const Primary: Story = {
  args: { variant: 'primary', children: 'Training starten' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Abbrechen' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Schließen' },
};

export const Small: Story = {
  args: { size: 'sm', children: 'Filter' },
};

export const Large: Story = {
  args: { size: 'lg', children: 'Trainingsplan anzeigen' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Gespeichert' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
      <Button variant="glass">Glass</Button>
      <Button variant="glass-accent">Glass Accent</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
};
