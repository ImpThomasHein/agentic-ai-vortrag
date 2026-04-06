import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within, expect, userEvent, waitFor } from 'storybook/test';
import { ClubImportDialog } from '@/components/team/ClubImportDialog';

const meta: Meta<typeof ClubImportDialog> = {
  title: 'Team/ClubImportDialog',
  component: ClubImportDialog,
  parameters: { layout: 'padded' },
  args: {
    isImporting: false,
    onImport: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ClubImportDialog>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Verein importieren')).toBeInTheDocument();
  },
};

export const OpenDialog: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Verein importieren'));
    await expect(canvas.getByText('Mannschaften aus Verein importieren')).toBeInTheDocument();
    await expect(canvas.getByPlaceholderText(/mytischtennis/)).toBeInTheDocument();
    await expect(canvas.getByText('Abbrechen')).toBeInTheDocument();
  },
};

export const WithResult: Story = {
  args: {
    onImport: fn(async () => ({
      imported: 3,
      teams: [
        { id: '1', name: 'Erwachsene', synced: true },
        { id: '2', name: 'Damen', synced: true },
        { id: '3', name: 'Jugend 15', synced: false },
      ],
    })),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Dialog öffnen
    await userEvent.click(canvas.getByText('Verein importieren'));

    // URL eingeben
    const input = canvas.getByPlaceholderText(/mytischtennis/);
    await userEvent.type(input, 'https://www.mytischtennis.de/click-tt/TTVB/25--26/verein/1025/mannschaften');

    // Importieren klicken
    await userEvent.click(canvas.getByText('Importieren'));

    // Ergebnis prüfen
    await waitFor(() => {
      expect(canvas.getByText(/3 Mannschaften importiert/)).toBeInTheDocument();
      expect(canvas.getByText('Erwachsene')).toBeInTheDocument();
      expect(canvas.getByText('Damen')).toBeInTheDocument();
      expect(canvas.getByText('Schließen')).toBeInTheDocument();
    });
  },
};

export const Importing: Story = {
  args: {
    isImporting: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Im Importing-State zeigt der Button nur "Verein importieren" (collapsed)
    await expect(canvas.getByText('Verein importieren')).toBeInTheDocument();
  },
};
