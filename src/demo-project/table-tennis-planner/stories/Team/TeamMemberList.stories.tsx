import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within, expect, userEvent } from 'storybook/test';
import { TeamMemberList } from '@/components/team/TeamMemberList';
import { mockTeamMembers, mockAvailablePlayers } from '../mocks/mockData';

const meta: Meta<typeof TeamMemberList> = {
  title: 'Team/TeamMemberList',
  component: TeamMemberList,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof TeamMemberList>;

export const TrainerView: Story = {
  args: {
    members: mockTeamMembers,
    currentUserId: 'user-t1',
    isTrainer: true,
    onRemove: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Alle 4 Mitglieder sichtbar
    await expect(canvas.getByText('Thomas Müller')).toBeInTheDocument();
    await expect(canvas.getByText('Max Schneider')).toBeInTheDocument();
    await expect(canvas.getByText('Anna Müller')).toBeInTheDocument();
    await expect(canvas.getByText('Ben Schmidt')).toBeInTheDocument();
    // Entfernen-Buttons vorhanden (4x)
    const removeButtons = canvas.getAllByLabelText(/entfernen/);
    await expect(removeButtons.length).toBe(4);
  },
};

export const TrainerWithAddPlayer: Story = {
  args: {
    members: mockTeamMembers,
    currentUserId: 'user-t1',
    isTrainer: true,
    availablePlayers: mockAvailablePlayers,
    onAdd: fn(),
    onRemove: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // "+"-Button sichtbar
    const addButton = canvas.getByLabelText('Spieler hinzufügen');
    await expect(addButton).toBeInTheDocument();
    // Klick öffnet Dropdown
    await userEvent.click(addButton);
    const dropdown = canvas.getByLabelText('Spieler auswählen');
    await expect(dropdown).toBeInTheDocument();
    // Spieler auswählen
    await userEvent.selectOptions(dropdown, 'user-p4');
    await expect(args.onAdd).toHaveBeenCalledWith('user-p4');
  },
};

export const TrainerNoAvailablePlayers: Story = {
  args: {
    members: mockTeamMembers,
    currentUserId: 'user-t1',
    isTrainer: true,
    availablePlayers: [],
    onAdd: fn(),
    onRemove: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Kein "+"-Button wenn keine Spieler verfügbar
    await expect(canvas.queryByLabelText('Spieler hinzufügen')).not.toBeInTheDocument();
  },
};

export const PlayerIsMember: Story = {
  args: {
    members: mockTeamMembers,
    currentUserId: 'user-p1',
    isTrainer: false,
    onLeave: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Verlassen-Button sichtbar
    await expect(canvas.getByText('Verlassen')).toBeInTheDocument();
    // Keine Entfernen-Buttons
    await expect(canvas.queryAllByLabelText(/entfernen/).length).toBe(0);
  },
};

export const PlayerNotMember: Story = {
  args: {
    members: mockTeamMembers,
    currentUserId: 'user-other',
    isTrainer: false,
    onJoin: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Beitreten-Button sichtbar
    await expect(canvas.getByText('Beitreten')).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: {
    members: [],
    isTrainer: true,
    onRemove: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Noch keine Spieler zugeordnet')).toBeInTheDocument();
  },
};
