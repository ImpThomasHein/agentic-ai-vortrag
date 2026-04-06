import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import FilterChip from '@/components/ui/FilterChip';

const meta: Meta<typeof FilterChip> = {
  title: 'UI/FilterChip',
  component: FilterChip,
  parameters: { layout: 'centered' },
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Beinarbeit',
    selected: false,
    onClick: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof FilterChip>;

export const Default: Story = { args: { selected: false } };

export const Selected: Story = { args: { selected: true } };

export const SelectedWithColor: Story = {
  args: {
    selected: true,
    colorScheme: { bg: 'bg-orange-100', text: 'text-orange-700' },
    children: 'Beinarbeit',
  },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Nicht verfügbar' },
};

export const AllCategories: Story = {
  render: () => {
    const categories = [
      { label: 'Beinarbeit', color: { bg: 'bg-orange-100', text: 'text-orange-700' } },
      { label: 'Aufschlag/Rückschlag', color: { bg: 'bg-green-100', text: 'text-green-700' } },
      { label: 'Technik', color: { bg: 'bg-blue-100', text: 'text-blue-700' } },
      { label: 'Vorhand', color: { bg: 'bg-red-100', text: 'text-red-700' } },
      { label: 'Rückhand', color: { bg: 'bg-purple-100', text: 'text-purple-700' } },
    ];

    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '400px' }}>
        {categories.map((cat, i) => (
          <FilterChip
            key={cat.label}
            selected={i === 0}
            colorScheme={i === 0 ? cat.color : undefined}
          >
            {cat.label}
          </FilterChip>
        ))}
      </div>
    );
  },
};
