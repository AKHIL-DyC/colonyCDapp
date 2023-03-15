import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { string, object, number, boolean, InferType } from 'yup';

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~hooks'; // useEnabledExtensions
import { pipe, withMeta, mapPayload } from '~utils/actions';
import { graphQlDomainColorMap } from '~types';
import { DomainColor } from '~gql';
import { findDomainByNativeId } from '~utils/domains';

import EditDomainDialogForm from './EditDomainDialogForm';
import { getEditDomainDialogPayload } from './helpers';

interface CustomWizardDialogProps extends ActionDialogProps {
  filteredDomainId?: number;
}

type Props = DialogProps &
  Partial<WizardDialogType<object>> &
  CustomWizardDialogProps;

const displayName = 'common.EditDomainDialog';

const validationSchema = object()
  .shape({
    forceAction: boolean().defined(),
    domainName: string().max(20).required(),
    domainId: number().required(),
    domainColor: number().defined(),
    domainPurpose: string().max(90),
    annotationMessage: string().max(4000),
    motionDomainId: number(),
  })
  .defined();

type FormValues = InferType<typeof validationSchema>;

const EditDomainDialog = ({
  callStep,
  prevStep,
  cancel,
  close,
  colony,
  filteredDomainId,
}: Props) => {
  const selectedDomain = findDomainByNativeId(filteredDomainId, colony, true);

  const [isForce, setIsForce] = useState(false);
  const navigate = useNavigate();

  // const { isVotingExtensionEnabled } = useEnabledExtensions({
  //   colonyAddress: colony.colonyAddress,
  // });

  const actionType = !isForce /* && isVotingExtensionEnabled */
    ? ActionTypes.MOTION_DOMAIN_CREATE_EDIT
    : ActionTypes.ACTION_DOMAIN_EDIT;

  const transform = pipe(
    mapPayload((payload) => getEditDomainDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  return (
    <Form<FormValues>
      defaultValues={{
        forceAction: false,
        domainName: selectedDomain?.name || '',
        domainColor:
          graphQlDomainColorMap[selectedDomain?.color || DomainColor.Lightpink],
        domainPurpose: selectedDomain?.description || '',
        annotationMessage: '',
        domainId: selectedDomain?.nativeId,
        motionDomainId: selectedDomain?.nativeId,
      }}
      actionType={actionType}
      validationSchema={validationSchema}
      transform={transform}
      onSuccess={close}
    >
      {({ getValues }) => {
        const forceActionValue = getValues('forceAction');
        if (forceActionValue !== isForce) {
          setIsForce(forceActionValue);
        }
        return (
          <Dialog cancel={cancel}>
            <EditDomainDialogForm
              back={prevStep && callStep ? () => callStep(prevStep) : undefined}
              colony={colony}
            />
          </Dialog>
        );
      }}
    </Form>
  );
};

EditDomainDialog.displayName = displayName;

export default EditDomainDialog;
