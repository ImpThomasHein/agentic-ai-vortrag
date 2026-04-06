// Storybook stories for the NotificationToggle component
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NotificationToggle } from '@/components/notifications/NotificationToggle';

const meta: Meta<typeof NotificationToggle> = {
  title: 'Notifications/NotificationToggle',
  component: NotificationToggle,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NotificationToggle>;

export const Default: Story = {};
