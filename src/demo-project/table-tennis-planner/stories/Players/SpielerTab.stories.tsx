import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SpielerTab } from '@/components/players/SpielerTab';

const meta: Meta<typeof SpielerTab> = {
  title: 'Players/SpielerTab',
  component: SpielerTab,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof SpielerTab>;

export const Default: Story = {};
