import { useCallback, useMemo } from 'react';
import { DeepPartial } from 'utility-types';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useAppContext, useColonyContext, useEnabledExtensions } from '~hooks';
import { getRecoveryModeDialogPayload } from '~common/Dialogs/RecoveryModeDialog/helpers';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { EnterRecoveryModeFormValues, validationSchema } from './consts';

export const useEnterRecoveryMode = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType: isVotingReputationEnabled
      ? ActionTypes.ROOT_MOTION
      : ActionTypes.ACTION_UNLOCK_TOKEN,
    defaultValues: useMemo<DeepPartial<EnterRecoveryModeFormValues>>(
      () => ({
        description: '',
      }),
      [],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: EnterRecoveryModeFormValues) => {
          const values = {
            annotation: payload.description,
          };

          if (colony) {
            return getRecoveryModeDialogPayload(colony, values, user);
          }

          return null;
        }),
      ),
      [colony, user],
    ),
  });
};
