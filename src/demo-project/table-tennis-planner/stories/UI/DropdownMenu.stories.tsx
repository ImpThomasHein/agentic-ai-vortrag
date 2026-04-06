import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { DropdownMenu, MenuTriggerButton } from '@/components/ui/DropdownMenu';
import Badge from '@/components/ui/Badge';

const meta: Meta<typeof DropdownMenu> = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    // fullscreen für Portal-Rendering
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '48px', paddingRight: '48px', minHeight: '300px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof DropdownMenu>;

const baseItems = [
  { label: 'Bearbeiten', onClick: fn() },
  { label: 'Kopieren', onClick: fn() },
  { type: 'separator' as const },
  { label: 'Löschen', variant: 'danger' as const, onClick: fn() },
];

export const Default: Story = {
  args: {
    trigger: <MenuTriggerButton />,
    items: baseItems,
    align: 'right',
  },
};

export const WithHeader: Story = {
  args: {
    trigger: <MenuTriggerButton />,
    items: baseItems,
    align: 'right',
    header: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', fontWeight: 500 }}>Zum Training hinzufügen</span>
        <Badge variant="info" size="sm">3 Votes</Badge>
      </div>
    ),
  },
};

export const WithTrainingDays: Story = {
  args: {
    trigger: <MenuTriggerButton />,
    items: [
      { label: 'Montag, 23.02.', onClick: fn() },
      { label: 'Mittwoch, 25.02.', onClick: fn() },
      { label: 'Freitag, 27.02.', onClick: fn() },
      { type: 'separator' as const },
      { label: 'Übung bearbeiten', onClick: fn() },
    ],
    align: 'right',
    header: (
      <span style={{ fontSize: '12px' }}>Zum Training hinzufügen</span>
    ),
  },
};

export const AlignLeft: Story = {
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: '48px', paddingLeft: '48px', minHeight: '300px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    trigger: <MenuTriggerButton />,
    items: baseItems,
    align: 'left',
  },
};

export const WithDisabledItem: Story = {
  args: {
    trigger: <MenuTriggerButton />,
    items: [
      { label: 'Verfügbar', onClick: fn() },
      { label: 'Nicht verfügbar', disabled: true },
      { label: 'Löschen', variant: 'danger' as const, onClick: fn() },
    ],
    align: 'right',
  },
};
