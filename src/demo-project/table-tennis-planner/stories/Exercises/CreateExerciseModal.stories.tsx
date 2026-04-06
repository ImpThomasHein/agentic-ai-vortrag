/**
 * Storybook stories for the CreateExerciseModal component.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { within, expect } from 'storybook/test';
import { CreateExerciseModal } from '@/components/exercises/CreateExerciseModal';

const meta: Meta<typeof CreateExerciseModal> = {
  title: 'Exercises/CreateExerciseModal',
  component: CreateExerciseModal,
  parameters: { layout: 'fullscreen' },
  args: {
    isOpen: true,
    onClose: fn(),
    onSuccess: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof CreateExerciseModal>;

export const Open: Story = {};

export const FormFieldsVisible: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByLabelText(/name/i)).toBeVisible();
    expect(canvas.getByLabelText(/beschreibung/i)).toBeVisible();
    expect(canvas.getByText(/topspin/i)).toBeVisible();
    expect(canvas.getByText(/anfänger/i)).toBeVisible();
  },
};

export const Closed: Story = {
  args: { isOpen: false },
};
