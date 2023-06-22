import type { Meta, StoryObj } from '@storybook/react';

import Button from '~v5/shared/Button';

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
  argTypes: {
    mode: {
      name: 'Mode',
      table: {
        disable: true,
      },
    },
    size: {
      name: 'Size',
      options: ['default', 'small'],
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
    isFullRounded: {
      name: 'Is full rounded?',
      control: {
        type: 'boolean',
      },
    },
    isPending: {
      table: {
        disable: true,
      },
    },
    iconName: {
      name: 'Icon',
      options: ['copy-simple', 'trash', 'share-network', 'caret-down', 'user'],
      control: {
        type: 'select',
      },
    },
    isIconRight: {
      name: 'Is icon right? (works with Icon)',
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    text: 'New action',
    size: 'default',
    disabled: false,
    isFullSize: false,
    isPending: false,
    isFullRounded: false,
    isIconRight: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const PrimarySolid: Story = {
  args: {
    mode: 'primarySolid',
  },
};

export const PrimaryOutline: Story = {
  args: {
    mode: 'primaryOutline',
  },
};

export const PrimaryOutlineFulled: Story = {
  args: {
    mode: 'primaryOutlineFulled',
  },
};

export const SecondarySolid: Story = {
  args: {
    mode: 'secondarySolid',
  },
};

export const SecondaryOutline: Story = {
  args: {
    mode: 'secondaryOutline',
  },
};

export const Tertiary: Story = {
  args: {
    mode: 'tertiary',
  },
};

export const Quinary: Story = {
  args: {
    mode: 'quinary',
  },
};

export const TextButton: Story = {
  args: {
    mode: 'textButton',
  },
};

TextButton.argTypes = {
  size: {
    table: {
      disable: true,
    },
  },
  isFullRounded: {
    table: {
      disable: true,
    },
  },
};

export const TextButtonUnderlined: Story = {
  args: {
    mode: 'textButtonUnderlined',
    text: 'View objective',
  },
};

TextButtonUnderlined.argTypes = {
  size: {
    table: {
      disable: true,
    },
  },
  isFullRounded: {
    table: {
      disable: true,
    },
  },
};

export const Pending: Story = {
  args: {
    mode: 'pending',
    isPending: true,
  },
};

Pending.argTypes = {
  size: {
    table: {
      disable: true,
    },
  },
  isFullRounded: {
    table: {
      disable: true,
    },
  },
  disabled: {
    table: {
      disable: true,
    },
  },
};

export const Completed: Story = {
  args: {
    mode: 'completed',
    text: 'Address copied',
  },
};

Completed.argTypes = {
  disabled: {
    table: {
      disable: true,
    },
  },
  isIconRight: {
    table: {
      disable: true,
    },
  },
};

export const PrimaryOutlineFulledWithIcon: Story = {
  args: {
    mode: 'primaryOutlineFulled',
    iconName: 'copy-simple',
    text: 'Copy address',
  },
};

export const SecondaryOutlineWithIcon: Story = {
  args: {
    mode: 'secondaryOutline',
    iconName: 'trash',
    text: 'Delete account',
  },
};

export const PrimaryOutlineSmallWithIcon: Story = {
  args: {
    mode: 'primaryOutline',
    iconName: 'share-network',
    text: 'Button CTA',
    size: 'small',
  },
};

export const PrimarySolidSmallWithIcon: Story = {
  args: {
    mode: 'primarySolid',
    iconName: 'user',
    text: 'Button CTA',
    size: 'small',
  },
};

export const PrimarySolidSmallWithIconRight: Story = {
  args: {
    mode: 'primarySolid',
    iconName: 'caret-down',
    text: 'Button CTA',
    size: 'small',
    isIconRight: true,
  },
};
