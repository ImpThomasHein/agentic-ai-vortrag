/** Storybook stories for ChatInput component */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within, expect, userEvent } from 'storybook/test';
import { ChatInput } from '@/components/chat/ChatInput';

const meta: Meta<typeof ChatInput> = {
  title: 'Team/Chat/ChatInput',
  component: ChatInput,
  parameters: { layout: 'padded', backgrounds: { default: 'dark' } },
  args: {
    onSend: fn(),
    onUploadImage: fn().mockResolvedValue('mock-image-id'),
    isSending: false,
    isUploading: false,
  },
};
export default meta;
type Story = StoryObj<typeof ChatInput>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByPlaceholderText('Nachricht schreiben...')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Senden')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Bild anhängen')).toBeInTheDocument();
  },
};

export const Sending: Story = {
  args: { isSending: true },
};

export const Uploading: Story = {
  args: { isUploading: true },
};

export const TypeAndSend: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByPlaceholderText('Nachricht schreiben...');
    await userEvent.type(textarea, 'Test-Nachricht');
    const sendButton = canvas.getByLabelText('Senden');
    await userEvent.click(sendButton);
    await expect(args.onSend).toHaveBeenCalled();
  },
};
