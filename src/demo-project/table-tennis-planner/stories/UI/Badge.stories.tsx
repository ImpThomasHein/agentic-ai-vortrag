import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Badge from '@/components/ui/Badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
    },
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: { children: 'Beinarbeit', variant: 'default', size: 'sm' },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { variant: 'default' } };
export const Success: Story = { args: { variant: 'success', children: 'Anfänger' } };
export const Warning: Story = { args: { variant: 'warning', children: 'Fortgeschritten' } };
export const Error: Story = { args: { variant: 'error', children: 'Experte' } };
export const Info: Story = { args: { variant: 'info', children: '5 Votes' } };
export const SizeMedium: Story = { args: { size: 'md', children: 'Technik' } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="default">Standard</Badge>
      <Badge variant="success">Anfänger</Badge>
      <Badge variant="warning">Fortgeschritten</Badge>
      <Badge variant="error">Experte</Badge>
      <Badge variant="info">3 Votes</Badge>
    </div>
  ),
};
