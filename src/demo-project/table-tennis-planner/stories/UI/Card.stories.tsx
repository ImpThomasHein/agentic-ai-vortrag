import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Card from '@/components/ui/Card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['glass', 'glass-dark', 'default'] },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
  },
  args: {
    variant: 'glass',
    padding: 'md',
    children: 'Karteninhalt',
    style: { minWidth: '240px' },
  },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Glass: Story = { args: { variant: 'glass' } };

export const GlassDark: Story = { args: { variant: 'glass-dark' } };

export const Default: Story = { args: { variant: 'default' } };

export const PaddingNone: Story = {
  args: { padding: 'none', children: <div style={{ padding: '16px' }}>Kein Card-Padding</div> },
};

export const PaddingSmall: Story = { args: { padding: 'sm' } };

export const PaddingLarge: Story = { args: { padding: 'lg' } };

export const WithContent: Story = {
  args: {
    variant: 'glass',
    padding: 'md',
    children: (
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>Trainingseinheit</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Montag, 23. Februar 2026 · 5 Übungen geplant
        </p>
      </div>
    ),
  },
};
