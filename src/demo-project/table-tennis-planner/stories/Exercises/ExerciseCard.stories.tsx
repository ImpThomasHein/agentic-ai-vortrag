import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { useState } from 'react';
import ExerciseCard from '@/components/exercises/ExerciseCard';
import VoteButton from '@/components/exercises/VoteButton';
import { MenuTriggerButton } from '@/components/ui/DropdownMenu';
import {
  falkenbergExercise,
  topspinExercise,
  aufschlagExercise,
  blockExercise,
} from '../mocks/mockData';

const meta: Meta<typeof ExerciseCard> = {
  title: 'Exercises/ExerciseCard',
  component: ExerciseCard,
  parameters: { layout: 'padded' },
  args: {
    exercise: falkenbergExercise,
    voteCount: 0,
    showVoteCount: false,
  },
};
export default meta;
type Story = StoryObj<typeof ExerciseCard>;

export const Default: Story = { args: { exercise: falkenbergExercise } };

export const WithVoteCount: Story = {
  args: { exercise: falkenbergExercise, voteCount: 5, showVoteCount: true },
};

export const PlayerView: Story = {
  args: {
    exercise: falkenbergExercise,
    actionButton: <VoteButton voted={false} onToggle={fn()} />,
  },
};

export const PlayerViewVoted: Story = {
  args: {
    exercise: topspinExercise,
    voteCount: 3,
    showVoteCount: true,
    actionButton: <VoteButton voted={true} onToggle={fn()} />,
  },
};

export const TrainerView: Story = {
  args: {
    exercise: falkenbergExercise,
    voteCount: 5,
    showVoteCount: true,
    menuButton: <MenuTriggerButton />,
  },
};

export const AllCategories: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '800px' }}>
      <ExerciseCard exercise={falkenbergExercise} />
      <ExerciseCard exercise={topspinExercise} />
      <ExerciseCard exercise={aufschlagExercise} />
      <ExerciseCard exercise={blockExercise} />
    </div>
  ),
};

export const InteractiveVoting: Story = {
  render: () => {
    const [voted, setVoted] = useState(false);
    return (
      <ExerciseCard
        exercise={falkenbergExercise}
        voteCount={voted ? 6 : 5}
        showVoteCount={true}
        actionButton={<VoteButton voted={voted} onToggle={() => setVoted(!voted)} />}
      />
    );
  },
};
