import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { useState } from 'react';
import { TrainingScheduleSelector } from '@/components/training/TrainingScheduleSelector';
import type { Weekday } from '@/lib/types';

const meta: Meta<typeof TrainingScheduleSelector> = {
  title: 'Training/TrainingScheduleSelector',
  component: TrainingScheduleSelector,
  parameters: { layout: 'padded' },
  args: {
    selectedWeekdays: [],
    onSave: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof TrainingScheduleSelector>;

export const NoSelection: Story = {
  args: { selectedWeekdays: [] },
};

export const MondayWednesdayFriday: Story = {
  args: { selectedWeekdays: [1, 3, 5] },
};

export const AllDays: Story = {
  args: { selectedWeekdays: [0, 1, 2, 3, 4, 5, 6] },
};

export const Interactive: Story = {
  render: () => {
    const [weekdays, setWeekdays] = useState<Weekday[]>([1, 3]);
    return (
      <div style={{ maxWidth: '400px' }}>
        <TrainingScheduleSelector selectedWeekdays={weekdays} onSave={setWeekdays} />
        <p style={{ marginTop: '12px', fontSize: '12px', color: 'gray' }}>
          Gespeichert: {JSON.stringify(weekdays)}
        </p>
      </div>
    );
  },
};
