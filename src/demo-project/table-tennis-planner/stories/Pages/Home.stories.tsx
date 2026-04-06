import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Home from '@/app/page';
import { withTrainerAuth, withPlayerAuth, withLoadingAuth } from '../mocks/decorators';

const meta: Meta<typeof Home> = {
  title: 'Pages/Home',
  component: Home,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof Home>;

export const AsTrainer: Story = {
  decorators: [withTrainerAuth],
};

export const AsPlayer: Story = {
  decorators: [withPlayerAuth],
};

export const Loading: Story = {
  decorators: [withLoadingAuth],
};
