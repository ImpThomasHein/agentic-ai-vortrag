import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, expect, within, userEvent } from 'storybook/test';
import { DeletePlayerDialog } from '@/components/players/DeletePlayerDialog';

const meta: Meta<typeof DeletePlayerDialog> = {
  title: 'Players/DeletePlayerDialog',
  component: DeletePlayerDialog,
  parameters: { layout: 'fullscreen' },
  args: {
    isOpen: true,
    onClose: fn(),
    onConfirm: fn().mockResolvedValue(undefined),
  },
};
export default meta;
type Story = StoryObj<typeof DeletePlayerDialog>;

export const Default: Story = {
  args: { playerName: 'Max Schneider' },
};

export const ConfirmTriggersCallback: Story = {
  args: {
    playerName: 'Anna Müller',
    onConfirm: fn().mockResolvedValue(undefined),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const deleteButton = canvas.getByRole('button', { name: /löschen/i });
    await userEvent.click(deleteButton);
    await expect(args.onConfirm).toHaveBeenCalled();
  },
};
