/** Storybook stories for GruppenTab component. */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GruppenTab } from '@/components/groups/GruppenTab';

const meta: Meta<typeof GruppenTab> = {
  title: 'Groups/GruppenTab',
  component: GruppenTab,
};

export default meta;
type Story = StoryObj<typeof GruppenTab>;

export const Default: Story = {};
