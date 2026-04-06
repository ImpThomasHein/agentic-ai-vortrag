// Storybook stories for EditPlayerModal – covers default, no-email, save callback, and validation states.

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, expect, within, userEvent } from 'storybook/test';
import { EditPlayerModal } from '@/components/players/EditPlayerModal';

const meta: Meta<typeof EditPlayerModal> = {
  title: 'Players/EditPlayerModal',
  component: EditPlayerModal,
  parameters: { layout: 'fullscreen' },
  args: {
    isOpen: true,
    onClose: fn(),
    onSave: fn().mockResolvedValue({}),
  },
};
export default meta;
type Story = StoryObj<typeof EditPlayerModal>;

export const Default: Story = {
  args: {
    player: { id: 'p1', displayName: 'Max Schneider', username: 'max.schneider', email: 'max@example.com' },
  },
};

export const NoEmail: Story = {
  args: {
    player: { id: 'p2', displayName: 'Anna Müller', username: 'anna.mueller', email: null },
  },
};

export const SaveTriggersCallback: Story = {
  args: {
    player: { id: 'p1', displayName: 'Max Schneider', username: 'max.schneider', email: null },
    onSave: fn().mockResolvedValue({}),
    onClose: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const nameInput = canvas.getByLabelText('Anzeigename');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Max Neuer Name');

    const saveButton = canvas.getByRole('button', { name: /speichern/i });
    await userEvent.click(saveButton);

    await expect(args.onSave).toHaveBeenCalledWith('p1', {
      displayName: 'Max Neuer Name',
      username: 'max.schneider',
      email: null,
    });
  },
};

export const EmptyNameShowsError: Story = {
  args: {
    player: { id: 'p1', displayName: 'Max', username: 'max', email: null },
    onSave: fn().mockResolvedValue({}),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const nameInput = canvas.getByLabelText('Anzeigename');
    await userEvent.clear(nameInput);

    const saveButton = canvas.getByRole('button', { name: /speichern/i });
    await userEvent.click(saveButton);

    await expect(args.onSave).not.toHaveBeenCalled();
    await expect(canvas.getByText('Anzeigename darf nicht leer sein')).toBeInTheDocument();
  },
};
