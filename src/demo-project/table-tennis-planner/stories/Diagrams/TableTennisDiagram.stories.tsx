import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TableTennisDiagram from '@/components/diagrams/TableTennisDiagram';
import { falkenbergExercise, topspinExercise } from '../mocks/mockData';

const meta: Meta<typeof TableTennisDiagram> = {
  title: 'Diagrams/TableTennisDiagram',
  component: TableTennisDiagram,
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  args: {
    size: 'medium',
    trajectories: falkenbergExercise.diagram.trajectories,
  },
};
export default meta;
type Story = StoryObj<typeof TableTennisDiagram>;

export const Falkenberg: Story = {
  args: { trajectories: falkenbergExercise.diagram.trajectories, size: 'medium' },
};

export const TopspinCross: Story = {
  args: { trajectories: topspinExercise.diagram.trajectories, size: 'medium' },
};

export const SingleTrajectory: Story = {
  args: {
    trajectories: [
      { id: 't1', startX: 75, startY: 85, endX: 25, endY: 15, type: 'topspin', player: 'self', stroke: 'VH', order: 1 },
    ],
    size: 'medium',
  },
};

export const Empty: Story = {
  args: { trajectories: [], size: 'medium' },
};

export const Small: Story = {
  args: { trajectories: falkenbergExercise.diagram.trajectories, size: 'small' },
};

export const Large: Story = {
  args: { trajectories: falkenbergExercise.diagram.trajectories, size: 'large' },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '12px', marginBottom: '8px' }}>Small</p>
        <TableTennisDiagram trajectories={falkenbergExercise.diagram.trajectories} size="small" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '12px', marginBottom: '8px' }}>Medium</p>
        <TableTennisDiagram trajectories={falkenbergExercise.diagram.trajectories} size="medium" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '12px', marginBottom: '8px' }}>Large</p>
        <TableTennisDiagram trajectories={falkenbergExercise.diagram.trajectories} size="large" />
      </div>
    </div>
  ),
};
