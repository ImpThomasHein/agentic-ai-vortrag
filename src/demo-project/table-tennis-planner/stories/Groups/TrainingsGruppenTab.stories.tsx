/**
 * Stories for the TrainingsGruppenTab merged group management tab.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TrainingsGruppenTab } from '@/components/groups/TrainingsGruppenTab';

const meta: Meta<typeof TrainingsGruppenTab> = {
  title: 'Groups/TrainingsGruppenTab',
  component: TrainingsGruppenTab,
  parameters: {
    layout: 'padded',
    mockData: [
      { url: '/api/groups', method: 'GET', status: 200, response: [] },
      { url: '/api/users', method: 'GET', status: 200, response: [] },
    ],
  },
  decorators: [(Story) => <div style={{ maxWidth: 480 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof TrainingsGruppenTab>;

export const Default: Story = {};
