/** Storybook stories for CreateGroupModal component. */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CreateGroupModal } from '@/components/groups/CreateGroupModal';

const meta: Meta<typeof CreateGroupModal> = {
  title: 'Groups/CreateGroupModal',
  component: CreateGroupModal,
};

export default meta;
type Story = StoryObj<typeof CreateGroupModal>;

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('close'),
    onSuccess: (group) => console.log('created', group),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log('close'),
    onSuccess: (group) => console.log('created', group),
  },
};
