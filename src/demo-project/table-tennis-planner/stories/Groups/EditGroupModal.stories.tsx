/** Storybook stories for EditGroupModal component. */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EditGroupModal } from '@/components/groups/EditGroupModal';

const meta: Meta<typeof EditGroupModal> = {
  title: 'Groups/EditGroupModal',
  component: EditGroupModal,
};

export default meta;
type Story = StoryObj<typeof EditGroupModal>;

export const Open: Story = {
  args: {
    isOpen: true,
    group: { id: 'g1', name: 'Erwachsene', description: 'Trainingsgruppe für Erwachsene' },
    onClose: () => console.log('close'),
    onSuccess: (group) => console.log('updated', group),
  },
};

export const NoDescription: Story = {
  args: {
    isOpen: true,
    group: { id: 'g2', name: 'Schüler', description: null },
    onClose: () => console.log('close'),
    onSuccess: (group) => console.log('updated', group),
  },
};
