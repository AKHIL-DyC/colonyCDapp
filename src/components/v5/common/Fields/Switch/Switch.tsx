import React, { useId } from 'react';
import clsx from 'clsx';
import styles from './Switch.module.css';
import { SwitchProps } from './types';

const displayName = 'v5.common.Fields.Switch';

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ id, disabled, className, ...rest }, ref) => {
    const generatedId = useId();

    return (
      <label
        htmlFor={id || generatedId}
        className={clsx('relative', {
          'pointer-events-none': disabled,
          'cursor-pointer': !disabled,
        })}
      >
        <input
          ref={ref}
          {...rest}
          type="checkbox"
          id={id || generatedId}
          className={clsx('sr-only', className)}
          disabled={disabled}
        />
        <div
          className={clsx(
            styles.toggle,
            'bg-gray-200 border-2 border-gray-200 h-5 w-9 rounded-full',
          )}
        />
      </label>
    );
  },
);

export default Object.assign(Switch, { displayName });
