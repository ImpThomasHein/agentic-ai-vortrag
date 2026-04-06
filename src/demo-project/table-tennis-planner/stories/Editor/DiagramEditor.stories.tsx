import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { useState } from 'react';
import { DiagramEditor } from '@/components/editor/DiagramEditor';
import type { BallTrajectory } from '@/lib/types';
import { falkenbergExercise } from '../mocks/mockData';

const meta: Meta<typeof DiagramEditor> = {
  title: 'Editor/DiagramEditor',
  component: DiagramEditor,
  parameters: { layout: 'padded' },
  args: {
    trajectories: [],
    onChange: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof DiagramEditor>;

export const Empty: Story = {
  args: { trajectories: [], onChange: fn() },
};

export const WithTrajectories: Story = {
  args: {
    trajectories: falkenbergExercise.diagram.trajectories,
    onChange: fn(),
  },
};

// Interaktive Story mit echtem State
export const Interactive: Story = {
  render: () => {
    const [trajectories, setTrajectories] = useState<BallTrajectory[]>(
      falkenbergExercise.diagram.trajectories
    );
    return <DiagramEditor trajectories={trajectories} onChange={setTrajectories} />;
  },
};
