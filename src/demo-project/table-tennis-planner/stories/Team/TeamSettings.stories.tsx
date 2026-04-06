import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within, expect, userEvent } from 'storybook/test';
import { TeamSettings } from '@/components/team/TeamSettings';

const meta: Meta<typeof TeamSettings> = {
  title: 'Team/TeamSettings',
  component: TeamSettings,
  parameters: { layout: 'padded' },
  args: {
    onUpdateTeam: fn(),
    onSync: fn(),
    onDelete: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof TeamSettings>;

export const WithUrl: Story = {
  args: {
    teamName: 'Herren 1',
    clickTtUrl: 'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Kreisliga/gruppe/493601/tabelle/gesamt',
    lastSync: '2026-03-08T14:30:00.000Z',
    isSyncing: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Einstellungen-Header sichtbar
    await expect(canvas.getByText('Einstellungen')).toBeInTheDocument();
    // URL angezeigt (truncated)
    await expect(canvas.getByText('Bearbeiten')).toBeInTheDocument();
    // Sync-Button sichtbar
    await expect(canvas.getByText('Jetzt synchronisieren')).toBeInTheDocument();
    // Letzter Sync Datum angezeigt
    await expect(canvas.getByText(/Letzter Sync/)).toBeInTheDocument();
    // Löschen-Button sichtbar
    await expect(canvas.getByText('Mannschaft löschen')).toBeInTheDocument();
  },
};

export const WithoutUrl: Story = {
  args: {
    teamName: 'Herren 2',
    clickTtUrl: null,
    lastSync: null,
    isSyncing: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // "Nicht hinterlegt" angezeigt wenn keine URL
    await expect(canvas.getByText('Nicht hinterlegt')).toBeInTheDocument();
    // Bearbeiten-Button vorhanden
    await expect(canvas.getByText('Bearbeiten')).toBeInTheDocument();
    // Kein Sync-Button ohne URL
    await expect(canvas.queryByText('Jetzt synchronisieren')).not.toBeInTheDocument();
  },
};

export const Syncing: Story = {
  args: {
    teamName: 'Herren 1',
    clickTtUrl: 'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Kreisliga/gruppe/493601/tabelle/gesamt',
    lastSync: '2026-03-08T14:30:00.000Z',
    isSyncing: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Sync-Button zeigt Ladetext
    await expect(canvas.getByText('Sync...')).toBeInTheDocument();
    // Kein "Jetzt synchronisieren" Text während Sync
    await expect(canvas.queryByText('Jetzt synchronisieren')).not.toBeInTheDocument();
  },
};

export const EditUrl: Story = {
  args: {
    teamName: 'Herren 1',
    clickTtUrl: 'https://www.mytischtennis.de/click-tt/TTVB/25--26/ligen/Kreisliga/gruppe/493601/tabelle/gesamt',
    lastSync: null,
    isSyncing: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Bearbeiten klicken öffnet Input
    await userEvent.click(canvas.getByText('Bearbeiten'));
    await expect(canvas.getByText('OK')).toBeInTheDocument();
    await expect(canvas.getByText('Abb.')).toBeInTheDocument();
    // Abbrechen schließt wieder
    await userEvent.click(canvas.getByText('Abb.'));
    await expect(canvas.getByText('Bearbeiten')).toBeInTheDocument();
  },
};

export const DeleteConfirm: Story = {
  args: {
    teamName: 'Herren 1',
    clickTtUrl: null,
    lastSync: null,
    isSyncing: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Löschen klicken zeigt Bestätigung
    await userEvent.click(canvas.getByText('Mannschaft löschen'));
    await expect(canvas.getByText(/wirklich löschen/)).toBeInTheDocument();
    await expect(canvas.getByText('Ja, löschen')).toBeInTheDocument();
    await expect(canvas.getByText('Abbrechen')).toBeInTheDocument();
    // Abbrechen versteckt Bestätigung
    await userEvent.click(canvas.getByText('Abbrechen'));
    await expect(canvas.getByText('Mannschaft löschen')).toBeInTheDocument();
  },
};
