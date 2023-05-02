import React, { useMemo, useState } from 'react';
import { string, object, array, boolean, InferType } from 'yup';
import { useNavigate } from 'react-router-dom';

import Dialog, { ActionDialogProps, DialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';

// import {
//   useVerifiedUsersQuery,
//   useColonyFromNameQuery,
// } from '~data/index';
import { ActionTypes } from '~redux/index';
import { WizardDialogType } from '~hooks';
import { pipe, withMeta, mapPayload } from '~utils/actions';
import {
  mergeSchemas,
  validationSchemaFile,
  validationSchemaInput,
} from '~utils/whitelistValidation';
import { useGetUsersQuery } from '~gql';
import { notNull } from '~utils/arrays';

import ManageWhitelistDialogForm from './ManageWhitelistDialogForm';
import {
  getManageWhitelistDialogPayload,
  getWhitelistedAddressesQueryFilter,
  TABS,
} from './helpers';

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps & {
    userAddress?: string;
  };

const displayName = 'common.ManageWhitelistDialog';

const validationSchema = object({
  annotation: string().max(4000).defined(),
  isWhitelistActivated: boolean().defined(),
}).defined();

const ManageWhitelistDialog = ({
  cancel,
  close,
  callStep,
  prevStep,
  colony,
  userAddress,
  enabledExtensionData,
}: Props) => {
  const [showInput, setShowInput] = useState<boolean>(true);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useState<number>(TABS.ADD_ADDRESS);

  const handleToggleShowInput = () => {
    setShowInput((state) => !state);
    // clear success msgs when switching inputs
    setFormSuccess(false);
  };

  const navigate = useNavigate();

  const whitelistedAddresses = colony.metadata?.whitelistedAddresses ?? [];
  const { data } = useGetUsersQuery({
    variables: {
      filter: getWhitelistedAddressesQueryFilter(whitelistedAddresses),
    },
    // The skip option is rather important here - without it, the query will return ALL the CDapp users
    skip: !whitelistedAddresses.length,
  });
  const users = data?.listUsers?.items.filter(notNull) ?? [];
  const whitelistedUsers = whitelistedAddresses.map((address) => {
    const matchingUser = users.find((user) => user.walletAddress === address);
    if (!matchingUser) {
      return {
        address,
      };
    }
    return {
      address,
      user: matchingUser,
    };
  });

  const handleTabChange = (index: number) => {
    setFormSuccess(false);
    setTabIndex(index);
  };

  const transform = pipe(
    mapPayload((payload) =>
      getManageWhitelistDialogPayload(colony, tabIndex, payload),
    ),
    withMeta({ navigate }),
  );

  const addressesValidationSchema = useMemo(() => {
    if (tabIndex === TABS.WHITELISTED) {
      return object({
        whitelistedAddresses: array()
          .of(string().address().defined())
          .defined(),
      }).defined();
    }
    return showInput ? validationSchemaInput : validationSchemaFile;
  }, [tabIndex, showInput]);

  const mergedSchemas = mergeSchemas(
    validationSchema,
    addressesValidationSchema,
  );

  type FormValues = InferType<typeof mergedSchemas>;

  return (
    <Dialog cancel={cancel}>
      <Form<FormValues>
        defaultValues={{
          annotation: '',
          isWhitelistActivated: colony.metadata?.isWhitelistActivated,
          whitelistedAddresses,
          whitelistAddress: userAddress,
          whitelistCSVUploader: null,
        }}
        actionType={ActionTypes.ACTION_VERIFIED_RECIPIENTS_MANAGE}
        validationSchema={mergedSchemas}
        transform={transform}
        onSuccess={() => {
          if (tabIndex === TABS.ADD_ADDRESS) {
            setFormSuccess(true);
          }
          close();
        }}
      >
        <ManageWhitelistDialogForm
          colony={colony}
          whitelistedUsers={whitelistedUsers}
          back={prevStep && callStep ? () => callStep(prevStep) : cancel}
          showInput={showInput}
          toggleShowInput={handleToggleShowInput}
          formSuccess={formSuccess}
          setFormSuccess={(isSuccess) => setFormSuccess(isSuccess)}
          tabIndex={tabIndex}
          setTabIndex={handleTabChange}
          backButtonText={{ id: !prevStep ? 'button.cancel' : 'button.back' }}
          enabledExtensionData={enabledExtensionData}
        />
      </Form>
    </Dialog>
  );
};

ManageWhitelistDialog.displayName = displayName;

export default ManageWhitelistDialog;
