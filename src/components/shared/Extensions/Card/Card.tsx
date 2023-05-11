import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import { CardProps } from './types';

const Card: FC<PropsWithChildren<CardProps>> = ({ hasShadow, rounded = 's', children, className, ...props }) => (
  <div
    className={clsx(className, 'border border-gray-200 p-6 flex flex-col w-full', {
      'rounded-lg': rounded === 's',
      'rounded-xl': rounded === 'm',
      'shadow-default': hasShadow,
    })}
    {...{ rounded, ...props }}
  >
    {children}
  </div>
);

export default Card;
