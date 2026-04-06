import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { useState } from 'react';
import { TrainingDaysHeader } from '@/components/training/TrainingDaysHeader';
import type { Weekday } from '@/lib/types';

const meta: Meta<typeof TrainingDaysHeader> = {
  title: 'Training/TrainingDaysHeader',
  component: TrainingDaysHeader,
  parameters: { layout: 'padded' },
  args: {
    weekdays: [1, 3, 5],
    hasSchedule: true,
    onSave: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof TrainingDaysHeader>;

export const WithSchedule: Story = {
  args: { weekdays: [1, 3, 5], hasSchedule: true },
};

export const NoSchedule: Story = {
  args: { weekdays: [], hasSchedule: false },
};

export const SingleDay: Story = {
  args: { weekdays: [3], hasSchedule: true },
};

export const Interactive: Story = {
  render: () => {
    const [weekdays, setWeekdays] = useState<Weekday[]>([1, 3]);
    return (
      <div style={{ maxWidth: '500px' }}>
        <TrainingDaysHeader
          weekdays={weekdays}
          hasSchedule={weekdays.length > 0}
          onSave={setWeekdays}
        />
        <p style={{ marginTop: '12px', fontSize: '12px', color: 'gray' }}>
          Gespeichert: {JSON.stringify(weekdays)}
        </p>
      </div>
    );
  },
};
