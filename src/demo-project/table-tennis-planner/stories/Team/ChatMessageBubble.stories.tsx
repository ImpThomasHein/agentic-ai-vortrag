/** Storybook stories for ChatMessageBubble component */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within, expect } from 'storybook/test';
import { ChatMessageBubble } from '@/components/chat/ChatMessageBubble';

const meta: Meta<typeof ChatMessageBubble> = {
  title: 'Team/Chat/ChatMessageBubble',
  component: ChatMessageBubble,
  parameters: { layout: 'padded', backgrounds: { default: 'dark' } },
  args: {
    displayName: 'Max Schneider',
    content: 'Hallo zusammen! Wer ist morgen beim Training dabei?',
    imageId: null,
    createdAt: new Date().toISOString(),
    isOwn: false,
    isEdited: false,
    canDelete: false,
    canEdit: false,
    onDelete: fn(),
    onEdit: fn().mockResolvedValue(undefined),
  },
};
export default meta;
type Story = StoryObj<typeof ChatMessageBubble>;

export const OtherMessage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Max Schneider')).toBeInTheDocument();
    await expect(canvas.getByText(/Hallo zusammen/)).toBeInTheDocument();
  },
};

export const OwnMessage: Story = {
  args: {
    isOwn: true,
    displayName: 'Thomas Müller',
    content: 'Ich bin dabei!',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Thomas Müller')).toBeInTheDocument();
    await expect(canvas.getByText('Ich bin dabei!')).toBeInTheDocument();
  },
};

export const WithDeleteButton: Story = {
  args: {
    isOwn: true,
    canDelete: true,
    content: 'Diese Nachricht kann gelöscht werden',
  },
};

export const LongMessage: Story = {
  args: {
    content: 'Das ist eine längere Nachricht die über mehrere Zeilen gehen könnte. Sie demonstriert wie der Text-Wrap in der Chat-Bubble funktioniert und ob alles gut aussieht bei längeren Nachrichten.',
  },
};

export const EditedMessage: Story = {
  args: {
    isOwn: true,
    isEdited: true,
    content: 'Diese Nachricht wurde bearbeitet',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('(bearbeitet)')).toBeInTheDocument();
  },
};

export const WithEditButton: Story = {
  args: {
    isOwn: true,
    canEdit: true,
    canDelete: true,
    content: 'Eigene Nachricht mit Edit- und Delete-Button',
  },
};
