import React from 'react';

import noop from 'lodash/noop';
import isEqual from 'lodash/isEqual';

import { RadioButtonsBaseProps } from './types';
import RadioBase from './RadioBase';

const displayName = 'v5.common.RadioButtonsBase';

function RadioButtonsBase<TValue = string>({
  items,
  value,
  onChange = noop,
  name,
  disabled,
  keyExtractor = (item): string => String(item),
  valueComparator = isEqual,
  className,
}: RadioButtonsBaseProps<TValue>): JSX.Element {
  return (
    <ul className={className}>
      {items.map(({ value: itemValue, disabled: itemDisabled, ...rest }) => (
        <li key={keyExtractor(itemValue)}>
          <RadioBase
            {...rest}
            name={name}
            checked={valueComparator(itemValue, value)}
            onChange={(event): void => {
              const { target } = event;

              if (!(target instanceof HTMLInputElement)) {
                return;
              }

              onChange(target.checked ? itemValue : undefined);
            }}
            disabled={disabled || itemDisabled}
          />
        </li>
      ))}
    </ul>
  );
}

RadioButtonsBase.displayName = displayName;

export default RadioButtonsBase;
