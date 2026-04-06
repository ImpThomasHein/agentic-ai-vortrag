/**
 * Storybook stories for the NoteCard component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NoteCard from '@/components/notes/NoteCard';
import { MenuTriggerButton } from '@/components/ui/DropdownMenu';
import type { Exercise } from '@/lib/types';

const mockNote: Exercise = {
  id: 'note-1',
  type: 'note',
  name: 'Erwärmung: Laufen und Dehnen',
  description: '10 Minuten lockeres Einlaufen, anschließend dynamisches Dehnen der wichtigsten Muskelgruppen.',
  category: 'notiz',
  difficulty: 'beginner',
  ttrRange: { min: 0, max: 2500 },
  diagram: { trajectories: [] },
  hints: [],
  tags: [],
};

const meta: Meta<typeof NoteCard> = {
  title: 'Notes/NoteCard',
  component: NoteCard,
  parameters: { layout: 'padded' },
  args: {
    note: mockNote,
  },
};
export default meta;
type Story = StoryObj<typeof NoteCard>;

export const Default: Story = {};

export const WithMenuButton: Story = {
  args: {
    menuButton: <MenuTriggerButton />,
  },
};
