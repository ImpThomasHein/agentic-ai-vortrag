/**
 * Stories for the DashboardKarte component used on the homepage.
 */
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DashboardKarte } from '@/components/dashboard/DashboardKarte';

const meta: Meta<typeof DashboardKarte> = {
  title: 'Dashboard/DashboardKarte',
  component: DashboardKarte,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof DashboardKarte>;

export const TrainerNaechstesTraining: Story = {
  args: {
    title: 'Nächstes Training',
    subtitle: 'Mittwoch, 25. März · 19:00',
    detail: 'in 3 Tagen',
    href: '/trainer?tab=training',
    accent: true,
    accentColor: 'blue',
    stats: [
      { label: '📋 4 Übungen geplant', variant: 'blue' },
      { label: '✓ 5/8 zugesagt', variant: 'green' },
    ],
  },
};

export const Mannschaften: Story = {
  args: {
    title: 'Mannschaften',
    subtitle: '2 aktive Mannschaften',
    detail: 'Nächstes Spiel: Sa, 28. März — Herren II vs. TTC Mitte',
    href: '/trainer?tab=mannschaft',
  },
};

export const Uebungen: Story = {
  args: {
    title: 'Übungen',
    subtitle: '23 Übungen · 5 Notizen',
    detail: '3 neue Votes seit letzter Woche',
    href: '/trainer?tab=uebungen',
  },
};

export const SpielerAkzent: Story = {
  args: {
    title: 'Nächstes Training',
    subtitle: 'Mittwoch, 25. März · 19:00',
    detail: 'in 3 Tagen',
    href: '/player?tab=training',
    accent: true,
    accentColor: 'green',
    stats: [
      { label: '📋 4 Übungen geplant', variant: 'blue' },
      { label: '✓ Zugesagt', variant: 'green' },
    ],
  },
};
