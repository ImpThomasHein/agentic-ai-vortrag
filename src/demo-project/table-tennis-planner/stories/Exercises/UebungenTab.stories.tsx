/**
 * Stories for the UebungenTab exercise library tab component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { UebungenTab } from '@/components/exercises/UebungenTab';
import { Exercise } from '@/lib/types';

const meta: Meta<typeof UebungenTab> = {
  title: 'Exercises/UebungenTab',
  component: UebungenTab,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ maxWidth: 800 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof UebungenTab>;

const mockExercises: Exercise[] = [
  { id: '1', name: 'Topspin-Gegentopspin diagonal', category: 'topspin', type: 'exercise', description: 'Topspin-Wechsel diagonal', diagram: { trajectories: [] }, tags: [], difficulty: 'advanced', ttrRange: { min: 1200, max: 1800 } },
  { id: '2', name: 'Aufschlag kurz-lang', category: 'aufschlag-rueckschlag', type: 'exercise', description: 'Aufschlag-Variation', diagram: { trajectories: [] }, tags: [], difficulty: 'beginner', ttrRange: { min: 800, max: 1400 } },
  { id: '3', name: 'Beinarbeit Stern', category: 'beinarbeit', type: 'exercise', description: 'Sternlauf am Tisch', diagram: { trajectories: [] }, tags: [], difficulty: 'intermediate', ttrRange: { min: 1000, max: 1600 } },
];

export const TrainerView: Story = {
  args: {
    exercises: mockExercises,
    isFiltered: false,
    editable: true,
    onCreateExercise: () => {},
    onCreateNote: () => {},
    showDifficulty: true,
  },
};

export const PlayerView: Story = {
  args: {
    exercises: mockExercises,
    isFiltered: false,
    editable: false,
    showDifficulty: false,
    infoBox: (
      <div className="glass rounded-xl p-3 border-l-[3px] border-l-[#16a34a]">
        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
          Wähle deine Lieblingsübungen für das nächste Training!
        </p>
      </div>
    ),
  },
};

export const Empty: Story = {
  args: {
    exercises: [],
    isFiltered: true,
    editable: true,
    onCreateExercise: () => {},
  },
};

export const WithGroupSelector: Story = {
  args: {
    exercises: mockExercises,
    isFiltered: false,
    editable: true,
    onCreateExercise: () => {},
    onCreateNote: () => {},
    showDifficulty: true,
    groups: [
      { id: '1', name: 'Jugend', myRole: 'trainer' as const },
      { id: '2', name: 'Herren 1', myRole: 'trainer' as const },
    ],
    selectedGroupId: '1',
    onSelectGroup: fn(),
  },
};

export const SingleGroup: Story = {
  args: {
    exercises: mockExercises,
    isFiltered: false,
    editable: true,
    onCreateExercise: () => {},
    onCreateNote: () => {},
    showDifficulty: true,
    groups: [
      { id: '1', name: 'Jugend', myRole: 'trainer' as const },
    ],
    selectedGroupId: '1',
    onSelectGroup: fn(),
  },
};
