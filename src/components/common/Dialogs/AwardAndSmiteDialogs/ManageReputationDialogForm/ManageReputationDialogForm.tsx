import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import {
  ColonyRole,
  // VotingReputationVersion,
} from '@colony/colony-js';
import Decimal from 'decimal.js';
import { useFormContext } from 'react-hook-form';

import { ItemDataType } from '~shared/OmniPicker';
import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
} from '~shared/Dialog';
import DialogSection from '~shared/Dialog/DialogSection';
import { Select, Annotations } from '~shared/Fields';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import ExternalLink from '~shared/ExternalLink';
import SingleUserPicker, {
  filterUserSelection,
} from '~shared/SingleUserPicker';
import UserAvatar from '~shared/UserAvatar';
import NoPermissionMessage from '~shared/NoPermissionMessage';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import { REPUTATION_LEARN_MORE } from '~constants/externalUrls';

import { ColonyWatcher, User } from '~types/index';

import { useDialogActionPermissions, useUserReputation } from '~hooks'; // useEnabledExtensions
import { sortBy } from '~utils/lodash';

import ReputationAmountInput from './ReputationAmountInput';
import TeamDropdownItem from './TeamDropdownItem';

import styles from './ManageReputationDialogForm.css';

const displayName =
  'common.ManageReputationContainer.ManageReputationDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: `{isSmiteAction, select,
      true {Smite Reputation}
      other {Award Reputation}}`,
  },
  team: {
    id: `${displayName}.team`,
    defaultMessage: `Team in which Reputation should be {isSmiteAction, select,
      true {deducted}
      other {awarded}
    }`,
  },
  recipient: {
    id: `${displayName}.recipient`,
    defaultMessage: 'Recipient',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: `Explain why you're {isSmiteAction, select,
      true {smiting}
      other {awarding}
    } the user (optional)`,
  },
  userPickerPlaceholder: {
    id: `${displayName}.userPickerPlaceholder`,
    defaultMessage: 'Search for a user or paste wallet address',
  },
  warningTitle: {
    id: `${displayName}.warningTitle`,
    defaultMessage: `Caution!`,
  },
  warningText: {
    id: `${displayName}.warningText`,
    defaultMessage: `Improper use of this feature can break your colony. <a>Learn more</a>`,
  },
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

interface Props extends ActionDialogProps {
  nativeTokenDecimals: number;
  verifiedUsers: ColonyWatcher['user'][];
  updateReputation?: (
    userPercentageReputation: number,
    totalRep?: string,
  ) => void;
  isSmiteAction?: boolean;
}

const supRenderAvatar = (item: ItemDataType<User>) => (
  <UserAvatar user={item} size="xs" />
);

const LearnMoreLink = (chunks: React.ReactNode[]) => (
  <ExternalLink href={REPUTATION_LEARN_MORE}>{chunks}</ExternalLink>
);

const ManageReputationDialogForm = ({
  back,
  colony: { domains, colonyAddress },
  colony,
  updateReputation,
  nativeTokenDecimals,
  verifiedUsers,
  isSmiteAction = false,
}: Props) => {
  const {
    getValues,
    formState: { isValid },
  } = useFormContext();
  const values = getValues();

  const requiredRoles = [
    isSmiteAction ? ColonyRole.Arbitration : ColonyRole.Root,
  ];

  // const {
  //   votingExtensionVersion,
  //   isVotingExtensionEnabled,
  // } = useEnabledExtensions({
  //   colonyAddress,
  // });

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony,
    false, // isVotingExtensionEnabled,
    requiredRoles,
    [values.domainId],
  );

  const inputDisabled = !userHasPermission || onlyForceAction;

  const { userReputation, totalReputation } = useUserReputation(
    colonyAddress,
    values.user?.walletAddress,
    Number(values.domainId),
  );

  const unformattedUserReputationAmount = new Decimal(userReputation || 0)
    .div(new Decimal(10).pow(nativeTokenDecimals))
    .toNumber();

  const colonyDomains = domains?.items || [];
  const domainOptions = sortBy(
    colonyDomains.map((domain) => ({
      children: (
        <TeamDropdownItem
          domain={domain}
          user={values.user}
          userReputation={userReputation}
          totalReputation={totalReputation}
        />
      ),
      value: `${domain?.nativeId}`,
      label: domain?.name || `Domain #${domain?.nativeId}`,
    })),
    ['value'],
  );

  const domainName = colonyDomains.find(
    (domain) => domain?.nativeId === values.domainId,
  )?.name;

  const renderActiveOption = (option) => {
    const value = option ? option.value : undefined;
    const activeDomain =
      colonyDomains.find((domain) => Number(value) === domain?.nativeId) ||
      null;
    return (
      <div className={styles.activeItem}>
        <TeamDropdownItem
          domain={activeDomain}
          user={values.user}
          userReputation={userReputation}
          totalReputation={totalReputation}
        />
      </div>
    );
  };

  useEffect(() => {
    if (updateReputation) {
      updateReputation(unformattedUserReputationAmount);
    }
  }, [updateReputation, unformattedUserReputationAmount]);

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationVersion.FuchsiaLightweightSpaceship &&
  //   !values.forceAction;

  const formattedData = verifiedUsers.map((user) => ({
    ...user,
    id: user.walletAddress,
  }));

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading
          title={MSG.title}
          titleValues={{
            isSmiteAction,
          }}
        >
          {!isSmiteAction && (
            <div className={styles.warningContainer}>
              <p className={styles.warningTitle}>
                <FormattedMessage {...MSG.warningTitle} />
              </p>
              <p className={styles.warningText}>
                <FormattedMessage
                  {...MSG.warningText}
                  values={{
                    a: LearnMoreLink,
                  }}
                />
              </p>
            </div>
          )}
        </DialogHeading>
      </DialogSection>
      {!isSmiteAction && <hr className={styles.divider} />}
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Arbitration]} />
        </DialogSection>
      )}
      <DialogSection>
        <div className={styles.singleUserContainer}>
          <SingleUserPicker
            appearance={{ width: 'wide' }}
            data={formattedData}
            label={MSG.recipient}
            name="user"
            filter={filterUserSelection}
            renderAvatar={supRenderAvatar}
            placeholder={MSG.userPickerPlaceholder}
            disabled={inputDisabled}
            dataTest="reputationRecipientSelector"
            itemDataTest="reputationRecipientSelectorItem"
            valueDataTest="reputationRecipientName"
          />
        </div>
      </DialogSection>
      <DialogSection>
        <div className={styles.domainSelects}>
          <div>
            <Select
              options={domainOptions}
              label={MSG.team}
              labelValues={{
                isSmiteAction,
              }}
              name="domainId"
              appearance={{ theme: 'grey', width: 'fluid' }}
              renderActiveOption={renderActiveOption}
              disabled={!userHasPermission}
            />
          </div>
        </div>
      </DialogSection>
      <DialogSection>
        <ReputationAmountInput
          colony={colony}
          disabled={inputDisabled}
          nativeTokenDecimals={nativeTokenDecimals}
        />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          labelValues={{
            isSmiteAction,
          }}
          name="annotation"
          disabled={inputDisabled}
          dataTest="reputationAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage
            requiredPermissions={[
              isSmiteAction ? ColonyRole.Arbitration : ColonyRole.Root,
            ]}
            domainName={domainName}
          />
        </DialogSection>
      )}
      {/* {onlyForceAction && (
        <NotEnoughReputation
          appearance={{ marginTop: 'negative' }}
          domainId={Number(domainId)}
        />
      )} */}
      {/* {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.cannotCreateMotion}
              values={{
                version:
                  VotingReputationVersion.FuchsiaLightweightSpaceship,
              }}
            />
          </div>
        </DialogSection>
      )} */}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          onSecondaryButtonClick={back}
          disabled={!isValid || inputDisabled} // cannotCreateMotion ||
          dataTest="reputationConfirmButton"
        />
      </DialogSection>
    </>
  );
};

ManageReputationDialogForm.displayName = displayName;

export default ManageReputationDialogForm;
