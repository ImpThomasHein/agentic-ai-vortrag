/**
 * Stories for the ExercisePickerModal exercise/note selection dialog.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ExercisePickerModal } from '@/components/exercises/ExercisePickerModal';

const meta: Meta<typeof ExercisePickerModal> = {
  title: 'Exercises/ExercisePickerModal',
  component: ExercisePickerModal,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof ExercisePickerModal>;

const mockExercises = [
  { id: '1', name: 'Topspin-Gegentopspin diagonal', category: 'topspin' as const, type: 'exercise' as const, description: '', diagram: { trajectories: [] }, tags: [], difficulty: 'advanced' as const, ttrRange: { min: 1200, max: 1800 } },
  { id: '2', name: 'Aufschlag kurz-lang Variation', category: 'aufschlag-rueckschlag' as const, type: 'exercise' as const, description: '', diagram: { trajectories: [] }, tags: [], difficulty: 'beginner' as const, ttrRange: { min: 800, max: 1400 } },
  { id: '3', name: 'Beinarbeit Falkenberg', category: 'beinarbeit' as const, type: 'exercise' as const, description: '', diagram: { trajectories: [] }, tags: [], difficulty: 'intermediate' as const, ttrRange: { min: 1000, max: 1600 } },
  { id: 'n1', name: 'Fokus auf Beinarbeit', category: 'notiz' as const, type: 'note' as const, description: '', diagram: { trajectories: [] }, tags: [], difficulty: 'beginner' as const, ttrRange: { min: 0, max: 3000 } },
  { id: 'n2', name: 'Abschlussspiel', category: 'notiz' as const, type: 'note' as const, description: '', diagram: { trajectories: [] }, tags: [], difficulty: 'beginner' as const, ttrRange: { min: 0, max: 3000 } },
];

export const Default: Story = {
  args: {
    isOpen: true,
    exercises: mockExercises,
    assignedExerciseIds: ['1', 'n1'],
    onToggle: () => {},
    onCreateExercise: () => {},
    onCreateNote: () => {},
    onClose: () => {},
  },
};

export const Empty: Story = {
  args: {
    isOpen: true,
    exercises: [],
    assignedExerciseIds: [],
    onToggle: () => {},
    onCreateExercise: () => {},
    onCreateNote: () => {},
    onClose: () => {},
  },
};
