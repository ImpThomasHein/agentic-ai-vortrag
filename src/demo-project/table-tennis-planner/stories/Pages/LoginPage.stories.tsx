import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LoginPage from '@/app/login/page';
import { withNoAuth, withLoadingAuth } from '../mocks/decorators';

const meta: Meta<typeof LoginPage> = {
  title: 'Pages/LoginPage',
  component: LoginPage,
  parameters: { layout: 'fullscreen' },
  decorators: [withNoAuth],
};
export default meta;
type Story = StoryObj<typeof LoginPage>;

export const EmptyForm: Story = {};

export const Loading: Story = {
  decorators: [withLoadingAuth],
};
