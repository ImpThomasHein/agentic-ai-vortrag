import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, expect, within, userEvent } from 'storybook/test';
import { EmailForm } from '@/components/profile/EmailForm';

const meta: Meta<typeof EmailForm> = {
  title: 'Profile/EmailForm',
  component: EmailForm,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-md glass rounded-2xl p-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof EmailForm>;

export const Empty: Story = {
  args: {
    initialEmail: '',
    onSave: fn(async () => ({ ok: true })),
  },
};

export const WithEmail: Story = {
  args: {
    initialEmail: 'max@example.com',
    onSave: fn(async () => ({ ok: true })),
  },
};

export const SaveSuccess: Story = {
  args: {
    initialEmail: '',
    onSave: fn(async () => ({ ok: true })),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('deine@email.de');
    await userEvent.type(input, 'neu@example.com');

    const button = canvas.getByRole('button', { name: /e-mail speichern/i });
    await userEvent.click(button);

    await expect(args.onSave).toHaveBeenCalledWith('neu@example.com');
    await expect(canvas.getByText('E-Mail-Adresse gespeichert.')).toBeInTheDocument();
  },
};

export const SaveError: Story = {
  args: {
    initialEmail: '',
    onSave: fn(async () => ({ ok: false, error: 'Serverfehler' })),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('deine@email.de');
    await userEvent.type(input, 'test@example.com');

    const button = canvas.getByRole('button', { name: /e-mail speichern/i });
    await userEvent.click(button);

    await expect(canvas.getByText('Serverfehler')).toBeInTheDocument();
  },
};

export const InvalidEmail: Story = {
  args: {
    initialEmail: '',
    onSave: fn(async () => ({ ok: true })),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('deine@email.de');
    await userEvent.type(input, 'ungueltig');

    const button = canvas.getByRole('button', { name: /e-mail speichern/i });
    await userEvent.click(button);

    await expect(args.onSave).not.toHaveBeenCalled();
    await expect(canvas.getByText('Bitte gib eine gültige E-Mail-Adresse ein.')).toBeInTheDocument();
  },
};
