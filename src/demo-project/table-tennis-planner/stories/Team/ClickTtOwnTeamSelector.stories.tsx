import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within, expect, userEvent } from 'storybook/test';
import { ClickTtOwnTeamSelector } from '@/components/team/ClickTtOwnTeamSelector';

const meta: Meta<typeof ClickTtOwnTeamSelector> = {
  title: 'Team/ClickTtOwnTeamSelector',
  component: ClickTtOwnTeamSelector,
  parameters: { layout: 'padded' },
  args: {
    onSelect: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof ClickTtOwnTeamSelector>;

export const Default: Story = {
  args: {
    leagueTeamNames: [
      'TTC Rotation Leegebruch',
      'SG Empor Oranienburg',
      'TT-Freunde Bötzow II',
      'Hohen Neuendorfer SV II',
      'TT-Freunde Bötzow',
    ],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // Frage sichtbar
    await expect(canvas.getByText('Welche Mannschaft in dieser Liga ist deine?')).toBeInTheDocument();
    // Select mit Platzhalter
    const select = canvas.getByRole('combobox');
    await expect(select).toHaveValue('');
    // Button deaktiviert ohne Auswahl
    const button = canvas.getByRole('button', { name: 'Übernehmen' });
    await expect(button).toBeDisabled();
    // Team auswählen
    await userEvent.selectOptions(select, 'TT-Freunde Bötzow');
    await expect(select).toHaveValue('TT-Freunde Bötzow');
    // Button jetzt aktiv
    await expect(button).toBeEnabled();
    // Klick ruft onSelect auf
    await userEvent.click(button);
    await expect(args.onSelect).toHaveBeenCalledWith('TT-Freunde Bötzow');
  },
};

export const ManyTeams: Story = {
  args: {
    leagueTeamNames: [
      'TTC Rotation Leegebruch',
      'SG Empor Oranienburg',
      'TT-Freunde Bötzow II',
      'Hohen Neuendorfer SV II',
      'TT-Freunde Bötzow',
      'SV Glienicke/Nordbahn',
      'TSV Birkenwerder',
      'BSC Oberhavel',
      'SG Einheit Zepernick',
      'TSG Mühlenbeck',
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Alle 10 Teams als Optionen vorhanden
    const select = canvas.getByRole('combobox');
    const options = select.querySelectorAll('option');
    // 10 Teams + 1 Platzhalter
    await expect(options.length).toBe(11);
  },
};
