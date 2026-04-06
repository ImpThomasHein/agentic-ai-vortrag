/**
 * Storybook stories for the NoteForm component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import NoteForm from '@/components/notes/NoteForm';

const meta: Meta<typeof NoteForm> = {
  title: 'Notes/NoteForm',
  component: NoteForm,
  parameters: { layout: 'padded' },
  args: {
    onSave: fn(),
    onCancel: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof NoteForm>;

export const CreateMode: Story = {};

export const EditMode: Story = {
  args: {
    initialData: {
      name: 'Erwärmung: Laufen und Dehnen',
      description: '10 Minuten lockeres Einlaufen, anschließend dynamisches Dehnen der wichtigsten Muskelgruppen.',
    },
  },
};
