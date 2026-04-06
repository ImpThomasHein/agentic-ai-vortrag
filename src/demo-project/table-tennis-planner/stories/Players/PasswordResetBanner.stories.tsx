import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { userEvent, within, expect } from 'storybook/test';
import { PasswordResetBanner } from '@/components/players/PasswordResetBanner';

const meta: Meta<typeof PasswordResetBanner> = {
  title: 'Players/PasswordResetBanner',
  component: PasswordResetBanner,
  parameters: { layout: 'padded' },
  args: {
    playerName: 'Anna Müller',
    newPassword: 'xK7mP2nQrT',
    onDismiss: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof PasswordResetBanner>;

export const Default: Story = {};

export const LongPassword: Story = {
  args: { newPassword: 'abcdefghijklmnopqrstuvwxyz123456' },
};

export const Dismiss: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const closeButton = canvas.getByRole('button', { name: /schließen/i });
    await userEvent.click(closeButton);
    expect(meta.args!.onDismiss).toHaveBeenCalled();
  },
};
