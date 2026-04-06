import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { useState } from 'react';
import VoteButton from '@/components/exercises/VoteButton';

const meta: Meta<typeof VoteButton> = {
  title: 'Exercises/VoteButton',
  component: VoteButton,
  parameters: { layout: 'centered' },
  argTypes: {
    voted: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    voted: false,
    onToggle: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof VoteButton>;

export const NotVoted: Story = { args: { voted: false } };

export const Voted: Story = { args: { voted: true } };

export const Disabled: Story = { args: { voted: false, disabled: true } };

export const Interactive: Story = {
  render: () => {
    const [voted, setVoted] = useState(false);
    return <VoteButton voted={voted} onToggle={() => setVoted(!voted)} />;
  },
};
