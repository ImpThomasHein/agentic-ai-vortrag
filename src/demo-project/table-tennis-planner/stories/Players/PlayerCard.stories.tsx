import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within, expect } from 'storybook/test';
import { PlayerCard } from '@/components/players/PlayerCard';
import { mockPlayers, mockGroups } from '../mocks/mockData';

const meta: Meta<typeof PlayerCard> = {
  title: 'Players/PlayerCard',
  component: PlayerCard,
  parameters: { layout: 'padded' },
  args: {
    groups: mockGroups,
    onResetPassword: fn(),
    onAddToGroup: fn(),
    onRemoveFromGroup: fn(),
    onEditPlayer: fn(),
    onDeletePlayer: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof PlayerCard>;

export const NoGroups: Story = {
  args: { player: mockPlayers[1] }, // Ben Schmidt – keine Gruppen, keine Teams
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Ben Schmidt')).toBeInTheDocument();
    // Keine Badges
    await expect(canvas.queryByText('Jugend')).not.toBeInTheDocument();
  },
};

export const WithGroups: Story = {
  args: { player: mockPlayers[0] }, // Anna Müller – eine Gruppe + ein Team
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Anna Müller')).toBeInTheDocument();
    // Gruppen-Badge
    await expect(canvas.getByText('Jugend')).toBeInTheDocument();
    // Team-Badge
    await expect(canvas.getByText('Herren 1')).toBeInTheDocument();
  },
};

export const ManyGroups: Story = {
  args: { player: mockPlayers[2] }, // Clara Koch – zwei Gruppen + zwei Teams
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Clara Koch')).toBeInTheDocument();
    // Gruppen-Badge
    await expect(canvas.getByText('Jugend')).toBeInTheDocument();
    // Team-Badge (Herren 2 ist eindeutig)
    await expect(canvas.getByText('Herren 2')).toBeInTheDocument();
    // "Herren 1" existiert als Gruppe UND als Team → 2x vorhanden
    const herren1Badges = canvas.getAllByText('Herren 1');
    await expect(herren1Badges.length).toBe(2);
  },
};

export const NoTeams: Story = {
  args: { player: mockPlayers[1] }, // Ben Schmidt – keine Teams
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Ben Schmidt')).toBeInTheDocument();
    await expect(canvas.queryByText('Herren 2')).not.toBeInTheDocument();
  },
};

export const WithTeams: Story = {
  args: { player: mockPlayers[2] }, // Clara Koch – zwei Teams
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // "Herren 1" existiert als Gruppe + Team → 2 Badges
    const herren1Badges = canvas.getAllByText('Herren 1');
    await expect(herren1Badges.length).toBe(2);
    // "Herren 2" nur als Team → 1 Badge
    await expect(canvas.getByText('Herren 2')).toBeInTheDocument();
  },
};
