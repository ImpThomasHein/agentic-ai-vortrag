import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { userEvent, within, expect } from 'storybook/test';
import { CreatePlayerModal } from '@/components/players/CreatePlayerModal';

const meta: Meta<typeof CreatePlayerModal> = {
  title: 'Players/CreatePlayerModal',
  component: CreatePlayerModal,
  parameters: { layout: 'fullscreen' },
  args: {
    isOpen: true,
    onClose: fn(),
    onSuccess: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof CreatePlayerModal>;

export const Open: Story = {};

export const SubmitButtonDisabledWhenEmpty: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitButton = canvas.getByRole('button', { name: /erstellen/i });
    expect(submitButton).toBeDisabled();
  },
};

export const FillAndEnableSubmit: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(/benutzername/i), 'testuser');
    await userEvent.type(canvas.getByLabelText(/anzeigename/i), 'Test User');
    await userEvent.type(canvas.getByLabelText(/initiales passwort/i), 'geheim123');
    expect(canvas.getByRole('button', { name: /erstellen/i })).toBeEnabled();
  },
};

export const Closed: Story = {
  args: { isOpen: false },
};
