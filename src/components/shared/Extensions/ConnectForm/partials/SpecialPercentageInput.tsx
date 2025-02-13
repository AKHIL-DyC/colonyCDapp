import React, { FC, SyntheticEvent } from 'react';
import { useFormContext } from 'react-hook-form';

import SpecialInput from '~common/Extensions/SpecialInput';
import FormError from '~v5/shared/FormError';
import { SpecialInputProps } from '../types';
import { formatText } from '~utils/intl';
import { get } from '~utils/lodash';
import { Message } from '~types';
import { GovernanceOptions } from '~frame/Extensions/pages/ExtensionsPage/types';

const displayName = 'Extensions.ConnectForm.partials.SpecialPercentageInput';

const SpecialPercentageInput: FC<SpecialInputProps> = ({
  name = '',
  step,
  onInputChange,
}) => {
  const {
    formState: { errors },
    setValue,
  } = useFormContext();

  const error = get(errors, name)?.message as Message | undefined;

  const handleInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
    onInputChange?.(e);
    setValue('option', GovernanceOptions.CUSTOM);
  };

  return (
    <div className="text-right">
      <div className="flex items-end justify-end flex-col w-full md:max-w-[8.75rem]">
        <SpecialInput
          isError={!!error}
          name={name}
          type="percent"
          placeholder="1"
          step={step}
          onChange={handleInputChange}
        />
        {error && <FormError>{formatText(error)}</FormError>}
      </div>
    </div>
  );
};

SpecialPercentageInput.displayName = displayName;

export default SpecialPercentageInput;
