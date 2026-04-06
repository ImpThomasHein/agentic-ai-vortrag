/**
 * Storybook stories for the NoteList component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import NoteList from '@/components/notes/NoteList';
import type { Exercise } from '@/lib/types';

const mockNotes: Exercise[] = [
  {
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
  },
  {
    id: 'note-2',
    type: 'note',
    name: 'Abschlussspiel',
    description: 'Freies Spiel in Zweiergruppen, jeder gegen jeden. Spielstand bis 11, dann Partnerwechsel.',
    category: 'notiz',
    difficulty: 'beginner',
    ttrRange: { min: 0, max: 2500 },
    diagram: { trajectories: [] },
    hints: [],
    tags: [],
  },
  {
    id: 'note-3',
    type: 'note',
    name: 'Organisatorischer Hinweis',
    description: 'Bitte Turnschuhe mitbringen. Nächste Woche findet das Training ausnahmsweise donnerstags statt.',
    category: 'notiz',
    difficulty: 'beginner',
    ttrRange: { min: 0, max: 2500 },
    diagram: { trajectories: [] },
    hints: [],
    tags: [],
  },
];

const meta: Meta<typeof NoteList> = {
  title: 'Notes/NoteList',
  component: NoteList,
  parameters: { layout: 'padded' },
  args: {
    notes: mockNotes,
    isLoading: false,
    onCreateNote: fn(),
    onUpdateNote: fn(),
    onDeleteNote: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof NoteList>;

export const WithNotes: Story = {};

export const Empty: Story = {
  args: { notes: [] },
};

export const Loading: Story = {
  args: { notes: [], isLoading: true },
};
