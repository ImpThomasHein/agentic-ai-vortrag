/** Storybook stories for GroupMemberList component. */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GroupMemberList } from '@/components/groups/GroupMemberList';

const meta: Meta<typeof GroupMemberList> = {
  title: 'Groups/GroupMemberList',
  component: GroupMemberList,
};

export default meta;
type Story = StoryObj<typeof GroupMemberList>;

export const WithMembers: Story = {
  args: {
    members: [
      { id: '1', role: 'trainer', user: { id: 'u1', username: 'trainer', displayName: 'Thomas Müller' } },
      { id: '2', role: 'player', user: { id: 'u2', username: 'max', displayName: 'Max Schneider' } },
      { id: '3', role: 'player', user: { id: 'u3', username: 'lisa', displayName: 'Lisa Weber' } },
    ],
    onRemoveMember: (userId) => console.log('remove', userId),
  },
};

export const Empty: Story = {
  args: {
    members: [],
    onRemoveMember: (userId) => console.log('remove', userId),
  },
};
