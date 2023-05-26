import type { Meta, StoryObj } from '@storybook/react';
import Button from '~shared/Extensions/Button';

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
  argTypes: {
    mode: {
      name: 'Mode',
      options: ['primarySolid', 'primaryOutline', 'secondarySolid', 'textButton'],
      control: {
        type: 'select',
      },
    },
    text: {
      name: 'Text',
      control: {
        type: 'text',
      },
    },
    disabled: {
      name: 'Disabled',
      control: {
        type: 'boolean',
      },
    },
    isFullSize: {
      name: 'Is full size?',
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    text: 'New action',
    disabled: false,
    isFullSize: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const PrimarySolid: Story = {};

export const PrimaryOutline: Story = {
  args: {
    mode: 'primaryOutline',
  },
};

export const SecondarySolid: Story = {
  args: {
    mode: 'secondarySolid',
  },
};

export const TextButton: Story = {
  args: {
    mode: 'textButton',
  },
};
