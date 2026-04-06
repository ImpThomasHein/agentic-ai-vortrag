/** Storybook stories for TeamChat components */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within, expect, userEvent } from 'storybook/test';
import { ChatMessageBubble } from '@/components/chat/ChatMessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { DateSeparator } from '@/components/chat/DateSeparator';

// -- DateSeparator stories --

const dateSepMeta: Meta<typeof DateSeparator> = {
  title: 'Team/Chat/DateSeparator',
  component: DateSeparator,
  parameters: { layout: 'padded', backgrounds: { default: 'dark' } },
};
export default dateSepMeta;
type DateSepStory = StoryObj<typeof DateSeparator>;

export const Today: DateSepStory = {
  args: { date: new Date().toISOString() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Heute')).toBeInTheDocument();
  },
};

export const Yesterday: DateSepStory = {
  args: { date: new Date(Date.now() - 86400000).toISOString() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Gestern')).toBeInTheDocument();
  },
};

export const OlderDate: DateSepStory = {
  args: { date: '2025-03-15T12:00:00Z' },
};
