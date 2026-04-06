/**
 * Stories for the GruppenChips group selector component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GruppenChips } from '@/components/training/GruppenChips';

const meta: Meta<typeof GruppenChips> = {
  title: 'Training/GruppenChips',
  component: GruppenChips,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof GruppenChips>;

const mockGroups = [
  { id: '1', name: 'Jugend', description: null, myRole: 'trainer' as const },
  { id: '2', name: 'Erwachsene', description: null, myRole: 'trainer' as const },
];

export const TrainerBlue: Story = {
  args: {
    groups: mockGroups,
    selectedGroupId: '1',
    onSelectGroup: () => {},
    accentColor: 'blue',
  },
};

export const PlayerGreen: Story = {
  args: {
    groups: mockGroups,
    selectedGroupId: '2',
    onSelectGroup: () => {},
    accentColor: 'green',
  },
};

export const SingleGroup: Story = {
  args: {
    groups: [mockGroups[0]],
    selectedGroupId: '1',
    onSelectGroup: () => {},
  },
};
