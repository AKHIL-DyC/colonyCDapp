import { bool, object } from 'yup';
import { toast } from 'react-toastify';
import React from 'react';

import Toast from '~shared/Extensions/Toast';
import { canUseMetatransactions } from '~utils/checks';
import { useUpdateUserProfileMutation } from '~gql';
import { useAppContext } from '~hooks';

export const useFeesForm = () => {
  const metatransactionsValidationSchema = object({
    metatransactionsEnabled: bool<boolean>(),
  }).defined();

  const metatransactionsAvailable = canUseMetatransactions();

  const { user } = useAppContext();
  const {
    metatransactionsEnabled,
    emailPermissions,
    customRpc,
    decentralizedModeEnabled,
  } = user?.profile?.meta ?? { emailPermissions: [] };

  const [editUser] = useUpdateUserProfileMutation();

  const metatransasctionsDefault = metatransactionsAvailable
    ? metatransactionsEnabled
    : false;

  const handleSubmit = async (values: { metatransactionsEnabled: boolean }) => {
    await editUser({
      variables: {
        input: {
          id: user?.walletAddress ?? '',
          meta: {
            emailPermissions,
            customRpc,
            decentralizedModeEnabled,
            ...values,
          },
        },
      },
    });
  };

  const handleFeesOnChange = (value: boolean) => {
    handleSubmit({ metatransactionsEnabled: value });
    toast.success(
      <Toast
        type="success"
        title={{ id: 'advancedSettings.fees.toast.title' }}
        description={{
          id: value
            ? 'advancedSettings.fees.toast.description.true'
            : 'advancedSettings.fees.toast.description.false',
        }}
      />,
    );
  };

  return {
    metatransactionsValidationSchema,
    metatransasctionsDefault,
    handleSubmit,
    handleFeesOnChange,
  };
};
