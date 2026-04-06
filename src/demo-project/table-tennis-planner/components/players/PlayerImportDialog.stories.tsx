// Storybook stories for PlayerImportDialog — covers default, team-assignment, and loading states.
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { PlayerImportDialog } from './PlayerImportDialog';

const meta: Meta<typeof PlayerImportDialog> = {
  title: 'Players/PlayerImportDialog',
  component: PlayerImportDialog,
};
export default meta;

type Story = StoryObj<typeof PlayerImportDialog>;

export const Default: Story = {
  args: {
    assignToTeams: false,
    isImporting: false,
    onImport: fn(),
  },
};

export const WithTeamAssignment: Story = {
  args: {
    assignToTeams: true,
    isImporting: false,
    onImport: fn(),
  },
};

export const Importing: Story = {
  args: {
    assignToTeams: false,
    isImporting: true,
    onImport: fn(),
  },
};
