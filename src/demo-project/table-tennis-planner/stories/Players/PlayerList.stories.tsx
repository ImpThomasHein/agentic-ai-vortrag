import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { PlayerList } from '@/components/players/PlayerList';
import { mockPlayers, mockGroups } from '../mocks/mockData';

const meta: Meta<typeof PlayerList> = {
  title: 'Players/PlayerList',
  component: PlayerList,
  parameters: { layout: 'padded' },
  args: {
    groups: mockGroups,
    onResetPassword: fn(),
    onAddToGroup: fn(),
    onRemoveFromGroup: fn(),
    onEditPlayer: fn(),
    onDeletePlayer: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof PlayerList>;

export const Default: Story = {
  args: { players: mockPlayers },
};

export const Empty: Story = {
  args: { players: [] },
};

export const SinglePlayer: Story = {
  args: { players: [mockPlayers[1]] }, // Ben Schmidt – keine Gruppen
};

export const ManyGroups: Story = {
  args: { players: [mockPlayers[2]] }, // Clara Koch – mehrere Gruppen
};
