// Storybook stories for the InstallBanner component showing all platform variants.
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InstallBanner } from '@/components/install';

const meta: Meta<typeof InstallBanner> = {
  title: 'Install/InstallBanner',
  component: InstallBanner,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => {
      localStorage.removeItem('install-banner-dismissed');
      return (
        <div className="max-w-sm">
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof InstallBanner>;

export const WebView: Story = {
  args: { platformOverride: 'webview' },
};

export const IosSafari: Story = {
  args: { platformOverride: 'ios-safari' },
};

export const IosOtherBrowser: Story = {
  args: { platformOverride: 'ios-other' },
};

export const Android: Story = {
  args: { platformOverride: 'android' },
};

export const Standalone: Story = {
  args: { platformOverride: 'standalone' },
};
