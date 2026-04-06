/**
 * Stories for the TrainingsDetail expandable training detail view.
 * Note: TrainingsDetail lazy-loads attendance from the API internally.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TrainingsDetail } from '@/components/training/TrainingsDetail';

const meta: Meta<typeof TrainingsDetail> = {
  title: 'Training/TrainingsDetail',
  component: TrainingsDetail,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 420 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof TrainingsDetail>;

const mockExercises = [
  { id: '1', name: 'Topspin-Gegentopspin diagonal', category: 'topspin' as const, type: 'exercise' as const, description: '', diagram: { trajectories: [] }, tags: [], difficulty: 'advanced' as const, ttrRange: { min: 1200, max: 1800 } },
  { id: '2', name: 'Aufschlag kurz-lang Variation', category: 'aufschlag-rueckschlag' as const, type: 'exercise' as const, description: '', diagram: { trajectories: [] }, tags: [], difficulty: 'beginner' as const, ttrRange: { min: 800, max: 1400 } },
  { id: 'n1', name: 'Fokus auf Beinarbeit', category: 'notiz' as const, type: 'note' as const, description: '', diagram: { trajectories: [] }, tags: [], difficulty: 'beginner' as const, ttrRange: { min: 0, max: 3000 } },
];

export const TrainerView: Story = {
  args: {
    sessionId: '1',
    date: new Date(Date.now() + 3 * 86400000),
    exercises: mockExercises,
    editable: true,
    voteCount: (id: string) => id === '1' ? 5 : id === '2' ? 2 : 0,
    onReorder: () => {},
    onAddExercise: () => {},
    onClose: () => {},
  },
};

export const PlayerView: Story = {
  args: {
    sessionId: '1',
    date: new Date(Date.now() + 3 * 86400000),
    exercises: mockExercises,
    editable: false,
    voteCount: (id: string) => id === '1' ? 5 : id === '2' ? 2 : 0,
    onClose: () => {},
  },
};

export const EmptySession: Story = {
  args: {
    sessionId: '2',
    date: new Date(Date.now() + 10 * 86400000),
    exercises: [],
    editable: true,
    onAddExercise: () => {},
    onClose: () => {},
  },
};
