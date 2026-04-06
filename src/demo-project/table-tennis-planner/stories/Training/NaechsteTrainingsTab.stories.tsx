/**
 * Stories for the NaechsteTrainingsTab 2-week training overview tab.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NaechsteTrainingsTab } from '@/components/training/NaechsteTrainingsTab';

const meta: Meta<typeof NaechsteTrainingsTab> = {
  title: 'Training/NaechsteTrainingsTab',
  component: NaechsteTrainingsTab,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ maxWidth: 480 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof NaechsteTrainingsTab>;

const mockGroups = [
  { id: '1', name: 'Jugend', description: null, myRole: 'trainer' as const },
  { id: '2', name: 'Erwachsene', description: null, myRole: 'trainer' as const },
];

const mockSessions = [
  {
    sessionId: 's1',
    date: new Date(Date.now() + 2 * 86400000),
    exercises: [
      { id: '1', name: 'Topspin diagonal', category: 'topspin' as const, type: 'exercise' as const, description: '', diagram: { trajectories: [] }, tags: [], difficulty: 'advanced' as const, ttrRange: { min: 1200, max: 1800 } },
    ],
  },
  {
    sessionId: 's2',
    date: new Date(Date.now() + 7 * 86400000),
    exercises: [],
  },
];

export const TrainerView: Story = {
  args: {
    groups: mockGroups,
    selectedGroupId: '1',
    onSelectGroup: () => {},
    sessions: mockSessions,
    weekdays: [1, 3, 5],
    hasSchedule: true,
    editable: true,
    accentColor: 'blue',
    onSaveSchedule: () => {},
    onAddExercise: () => {},
  },
};

export const PlayerView: Story = {
  args: {
    groups: mockGroups,
    selectedGroupId: '1',
    onSelectGroup: () => {},
    sessions: mockSessions,
    weekdays: [1, 3, 5],
    hasSchedule: true,
    editable: false,
    accentColor: 'green',
  },
};

export const Empty: Story = {
  args: {
    groups: [mockGroups[0]],
    selectedGroupId: '1',
    onSelectGroup: () => {},
    sessions: [],
    weekdays: [],
    hasSchedule: false,
    editable: true,
    accentColor: 'blue',
    onSaveSchedule: () => {},
  },
};
