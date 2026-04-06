import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UserProfileWidget } from '@/components/auth/UserProfileWidget';
import { withTrainerAuth, withPlayerAuth } from '../mocks/decorators';

const meta: Meta<typeof UserProfileWidget> = {
  title: 'Auth/UserProfileWidget',
  component: UserProfileWidget,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof UserProfileWidget>;

export const AsTrainer: Story = {
  decorators: [withTrainerAuth],
};

export const AsPlayer: Story = {
  decorators: [withPlayerAuth],
};
