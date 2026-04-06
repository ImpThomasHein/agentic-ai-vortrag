import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from 'storybook/test';
import { MatchList } from '@/components/team/MatchList';
import { mockMatches } from '../mocks/mockData';

const meta: Meta<typeof MatchList> = {
  title: 'Team/MatchList',
  component: MatchList,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof MatchList>;

export const Default: Story = {
  args: {
    matches: mockMatches,
    teamName: 'TTC Rotation Leegebruch',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Beide Sektionen vorhanden
    await expect(canvas.getByText(/Kommende Spiele/)).toBeInTheDocument();
    await expect(canvas.getByText(/Ergebnisse/)).toBeInTheDocument();
    // Scores sichtbar
    await expect(canvas.getByText('9:1')).toBeInTheDocument();
    // Ausstehend-Badge
    const pending = canvas.getAllByText('Ausstehend');
    await expect(pending.length).toBeGreaterThan(0);
  },
};

export const OnlyUpcoming: Story = {
  args: {
    matches: mockMatches.filter((m) => !m.isCompleted),
    teamName: 'TTC Rotation Leegebruch',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Kommende Spiele/)).toBeInTheDocument();
    await expect(canvas.queryByText(/Ergebnisse/)).not.toBeInTheDocument();
  },
};

export const OnlyPast: Story = {
  args: {
    matches: mockMatches.filter((m) => m.isCompleted),
    teamName: 'TTC Rotation Leegebruch',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText(/Kommende Spiele/)).not.toBeInTheDocument();
    await expect(canvas.getByText(/Ergebnisse/)).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: { matches: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Keine Spiele vorhanden')).toBeInTheDocument();
  },
};
