/** Storybook stories for GroupCard component. */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GroupCard } from '@/components/groups/GroupCard';

const meta: Meta<typeof GroupCard> = {
  title: 'Groups/GroupCard',
  component: GroupCard,
};

export default meta;
type Story = StoryObj<typeof GroupCard>;

const mockMembers = [
  { id: '1', role: 'trainer', user: { id: 'u1', username: 'trainer', displayName: 'Thomas Müller' } },
  { id: '2', role: 'player', user: { id: 'u2', username: 'max', displayName: 'Max Schneider' } },
  { id: '3', role: 'player', user: { id: 'u3', username: 'lisa', displayName: 'Lisa Weber' } },
];

const mockPlayers = [
  { id: 'u4', username: 'anna', displayName: 'Anna Schmidt', email: null, roles: ['player'], groups: [], teams: [] },
  { id: 'u5', username: 'peter', displayName: 'Peter Wagner', email: null, roles: ['player'], groups: [], teams: [] },
];

export const Default: Story = {
  args: {
    group: { id: 'g1', name: 'Erwachsene', description: 'Trainingsgruppe für Erwachsene' },
    members: mockMembers,
    allPlayers: mockPlayers,
    onEdit: () => console.log('edit'),
    onDelete: () => console.log('delete'),
    onAddMember: (userId) => console.log('add', userId),
    onRemoveMember: (userId) => console.log('remove', userId),
  },
};

export const Empty: Story = {
  args: {
    group: { id: 'g2', name: 'Schüler', description: null },
    members: [],
    allPlayers: mockPlayers,
    onEdit: () => console.log('edit'),
    onDelete: () => console.log('delete'),
    onAddMember: (userId) => console.log('add', userId),
    onRemoveMember: (userId) => console.log('remove', userId),
  },
};
