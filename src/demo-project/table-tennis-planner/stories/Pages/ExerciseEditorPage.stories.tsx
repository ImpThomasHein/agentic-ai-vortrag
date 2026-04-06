import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Suspense } from 'react';
import ExerciseEditorPage from '@/app/trainer/editor/[id]/page';
import { withTrainerAuth, withGroupContext } from '../mocks/decorators';
import { mockExercises } from '../mocks/mockData';

// Mock für fetch('/api/exercises')
function mockFetch(exercises = mockExercises) {
  const original = globalThis.fetch;
  globalThis.fetch = async (input: string | URL | Request) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.includes('/api/exercises')) {
      return new Response(JSON.stringify({ exercises }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return original(input);
  };
}

const meta: Meta<typeof ExerciseEditorPage> = {
  title: 'Pages/ExerciseEditorPage',
  component: ExerciseEditorPage,
  parameters: { layout: 'fullscreen' },
  decorators: [withTrainerAuth, withGroupContext()],
};
export default meta;
type Story = StoryObj<typeof ExerciseEditorPage>;

export const LoadedExercise: Story = {
  beforeEach() {
    mockFetch(mockExercises);
  },
  render: () => (
    <Suspense fallback={<div style={{ padding: '24px' }}>Lade...</div>}>
      <ExerciseEditorPage params={Promise.resolve({ id: 'bein-001' })} />
    </Suspense>
  ),
};

export const NotFound: Story = {
  beforeEach() {
    mockFetch(mockExercises);
  },
  render: () => (
    <Suspense fallback={<div style={{ padding: '24px' }}>Lade...</div>}>
      <ExerciseEditorPage params={Promise.resolve({ id: 'does-not-exist' })} />
    </Suspense>
  ),
};
