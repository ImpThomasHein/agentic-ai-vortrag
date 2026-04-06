/** Storybook stories for the TeamChat container component */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect, userEvent } from 'storybook/test';
import { TeamChat } from '@/components/chat/TeamChat';

const meta: Meta<typeof TeamChat> = {
  title: 'Team/Chat/TeamChat',
  component: TeamChat,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    mockData: [
      {
        url: '/api/teams/team-1/chat?limit=50',
        method: 'GET',
        status: 200,
        response: [
          {
            id: 'msg-1',
            teamId: 'team-1',
            userId: 'user-other',
            username: 'max',
            displayName: 'Max Schneider',
            content: 'Wer kommt morgen zum Training?',
            imageId: null,
            createdAt: '2025-04-03T10:30:00Z',
            isEdited: false,
          },
          {
            id: 'msg-2',
            teamId: 'team-1',
            userId: 'user-1',
            username: 'thomas',
            displayName: 'Thomas Müller',
            content: 'Ich bin dabei!',
            imageId: null,
            createdAt: '2025-04-03T10:32:00Z',
            isEdited: false,
          },
          {
            id: 'msg-3',
            teamId: 'team-1',
            userId: 'user-other',
            username: 'anna',
            displayName: 'Anna Müller',
            content: 'Ich auch 💪',
            imageId: null,
            createdAt: '2025-04-03T10:35:00Z',
            isEdited: false,
          },
          {
            id: 'msg-4',
            teamId: 'team-1',
            userId: 'user-1',
            username: 'thomas',
            displayName: 'Thomas Müller',
            content: 'Diese Nachricht wurde bearbeitet',
            imageId: null,
            createdAt: '2025-04-03T10:40:00Z',
            isEdited: true,
          },
        ],
      },
    ],
  },
  args: {
    teamId: 'team-1',
    currentUserId: 'user-1',
    isTrainer: false,
  },
};
export default meta;
type Story = StoryObj<typeof TeamChat>;

export const Collapsed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Chat')).toBeInTheDocument();
    // Collapsed content is hidden via CSS (max-h-0 opacity-0), not removed from DOM
    const input = canvas.getByPlaceholderText('Nachricht schreiben...');
    const container = input.closest('[class*="max-h-0"]');
    await expect(container).toBeTruthy();
  },
};

export const Expanded: Story = {
  args: { defaultExpanded: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Chat')).toBeInTheDocument();
    await expect(canvas.getByPlaceholderText('Nachricht schreiben...')).toBeInTheDocument();
  },
};

export const ExpandedTrainer: Story = {
  args: { defaultExpanded: true, isTrainer: true },
};

export const ToggleExpand: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Initially collapsed via CSS — find the collapsible wrapper div
    const collapsible = canvasElement.querySelector('[class*="max-h-0"]');
    await expect(collapsible).toBeTruthy();
    // Click header to expand
    await userEvent.click(canvas.getByText('Chat'));
    // Container should now have expanded max-height class
    await expect(collapsible?.classList.toString()).toContain('max-h-[500px]');
  },
};

export const EmptyChat: Story = {
  args: { defaultExpanded: true, teamId: 'team-empty' },
  parameters: {
    mockData: [
      {
        url: '/api/teams/team-empty/chat?limit=50',
        method: 'GET',
        status: 200,
        response: [],
      },
    ],
  },
};
