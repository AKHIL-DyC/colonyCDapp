import clsx from 'clsx';
import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import { ActionForm } from '~shared/Fields';
import { formatText } from '~utils/intl';
import { FIELD_STATE } from '~v5/common/Fields/consts';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase';
import ActionTypeSelect from '../../ActionTypeSelect';
import { ACTION_TYPE_FIELD_NAME } from '../../consts';
import {
  useActionDescriptionMetadata,
  useActionFormProps,
  useNotificationBanner,
  useSidebarActionForm,
  useUserHasPermissions,
} from '../../hooks';
import ActionButtons from '../ActionButtons';
import Motions from '../Motions';
import PopularActions from '../PopularActions';
import {
  ActionSidebarContentProps,
  ActionSidebarFormContentProps,
} from './types';

const displayName = 'v5.common.ActionsContent.partials.ActionSidebarContent';

const ActionSidebarFormContent: FC<ActionSidebarFormContentProps> = ({
  getFormOptions,
  isMotion,
}) => {
  const { formComponent: FormComponent, selectedAction } =
    useSidebarActionForm();
  const userHasPermissions = useUserHasPermissions();
  const form = useFormContext();
  const notificationBanner = useNotificationBanner();
  const descriptionMetadata = useActionDescriptionMetadata();

  return (
    <>
      <div className="flex-grow overflow-y-auto">
        <FormInputBase
          name="title"
          placeholder={formatText({ id: 'placeholder.title' })}
          stateClassNames={{
            [FIELD_STATE.Error]: 'placeholder:text-red-400',
          }}
          className={`
            heading-3 mb-2
            text-gray-900
            transition-colors
          `}
          mode="secondary"
          message={false}
        />
        <p className="text-gray-900 text-md">{descriptionMetadata}</p>

        <ActionTypeSelect className="mt-7 mb-3 min-h-[1.875rem] flex flex-col justify-center" />

        {FormComponent && <FormComponent getFormOptions={getFormOptions} />}
        {notificationBanner && (
          <div className="mt-7">
            <NotificationBanner {...notificationBanner} />
          </div>
        )}
      </div>
      {!isMotion && (
        <div className="mt-auto">
          {!selectedAction && (
            <PopularActions
              setSelectedAction={(action) =>
                form.setValue(ACTION_TYPE_FIELD_NAME, action)
              }
            />
          )}
          <ActionButtons
            isActionDisabled={!userHasPermissions || !selectedAction}
          />
        </div>
      )}
    </>
  );
};

const ActionSidebarContent: FC<ActionSidebarContentProps> = ({
  transactionId,
  formRef,
  defaultValues,
  isMotion,
}) => {
  const { getFormOptions, actionFormProps } = useActionFormProps(
    defaultValues,
    !!transactionId,
  );

  return (
    <div
      className={clsx('flex w-full flex-grow overflow-hidden', {
        'flex-col-reverse md:flex-row': isMotion,
      })}
    >
      <div className="flex-grow px-6 py-8">
        <ActionForm
          {...actionFormProps}
          className="flex flex-col h-full"
          ref={formRef}
        >
          <ActionSidebarFormContent
            getFormOptions={getFormOptions}
            isMotion={isMotion}
          />
        </ActionForm>
      </div>
      {isMotion && (
        <div
          className={`
                  w-full
                  md:w-[35%]
                  md:h-full
                  md:overflow-y-auto
                  px-6
                  py-8
                  border-b
                  border-b-gray-200
                  md:border-b-0
                  md:border-l
                  md:border-l-gray-200
                  bg-gray-25
                `}
        >
          <Motions transactionId={transactionId || ''} />
        </div>
      )}
    </div>
  );
};

ActionSidebarContent.displayName = displayName;

export default ActionSidebarContent;
