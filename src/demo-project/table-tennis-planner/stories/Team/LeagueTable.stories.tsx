import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from 'storybook/test';
import { LeagueTable } from '@/components/team/LeagueTable';
import { mockStandings } from '../mocks/mockData';

const meta: Meta<typeof LeagueTable> = {
  title: 'Team/LeagueTable',
  component: LeagueTable,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof LeagueTable>;

export const Default: Story = {
  args: { standings: mockStandings },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Alle 10 Teams sichtbar
    await expect(canvas.getByText('TTC Rotation Leegebruch')).toBeInTheDocument();
    await expect(canvas.getByText('TTC Ofenstadt Velten')).toBeInTheDocument();
    // Spaltenheader vorhanden
    await expect(canvas.getByText('Mannschaft')).toBeInTheDocument();
    await expect(canvas.getByText('Pkt.')).toBeInTheDocument();
  },
};

export const WithHighlight: Story = {
  args: {
    standings: mockStandings,
    highlightTeam: 'TTC Rotation Leegebruch',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const highlightedRow = canvas.getByText('TTC Rotation Leegebruch').closest('tr');
    await expect(highlightedRow).toHaveClass('bg-blue-500/10');
  },
};

export const HighlightMiddle: Story = {
  args: {
    standings: mockStandings,
    highlightTeam: 'TT-Freunde Bötzow',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Beide Bötzow-Teams existieren, das ohne "II" soll highlighted sein
    const row = canvas.getByText('TT-Freunde Bötzow').closest('tr');
    await expect(row).toHaveClass('bg-blue-500/10');
  },
};

export const Empty: Story = {
  args: { standings: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Keine Tabellendaten vorhanden')).toBeInTheDocument();
  },
};
