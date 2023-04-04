import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';
import moveDecimal from 'move-decimal-point';
import { BigNumber } from 'ethers';

import { Annotations } from '~shared/Fields';
import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
  DialogSection,
} from '~shared/Dialog';
import { findDomainByNativeId } from '~utils/domains';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';

import {
  NoPermissionMessage,
  CannotCreateMotionMessage,
  PermissionRequiredInfo,
} from '../Messages';
import TokenAmountInput from '../TokenAmountInput';
import DomainFundSelectorSection from '../DomainFundSelectorSection';
import { useTransferFundsDialogStatus } from './helpers';

import styles from './TransferFundsDialogForm.css';
import {
  getBalanceForTokenAndDomain,
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import { formatText } from '~utils/intl';

const displayName = 'common.TransferFundsDialog.TransferFundsDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Transfer Funds',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: 'Explain why you’re transferring these funds (optional)',
  },
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
  notEnoughBalance: {
    id: `${displayName}.notEnoughBalance`,
    defaultMessage: 'Insufficient balance in from team pot',
  },
});

const requiredRoles: ColonyRole[] = [ColonyRole.Funding];

const TransferFundsDialogForm = ({
  back,
  colony,
  enabledExtensionData,
}: ActionDialogProps) => {
  const { watch, setError, clearErrors } = useFormContext();
  const {
    fromDomain: fromDomainId,
    toDomain: toDomainId,
    tokenAddress,
    amount,
  } = watch();

  const colonyDomains = colony?.domains?.items || [];
  const fromDomain = findDomainByNativeId(fromDomainId, colony);
  const toDomain = findDomainByNativeId(toDomainId, colony);

  const {
    userHasPermission,
    disabledInput,
    disabledSubmit,
    canCreateMotion,
    canOnlyForceAction,
    hasRoleInFromDomain,
  } = useTransferFundsDialogStatus(colony, requiredRoles, enabledExtensionData);

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationVersion.FuchsiaLightweightSpaceship &&
  //   !values.forceAction;

  const selectedToken = getSelectedToken(colony, tokenAddress);
  const fromDomainBalance = getBalanceForTokenAndDomain(
    colony.balances,
    tokenAddress,
    fromDomainId,
  );
  const convertedAmount = BigNumber.from(
    moveDecimal(amount, getTokenDecimalsWithFallback(selectedToken?.decimals)),
  );
  const hasEnoughBalance = convertedAmount.lte(fromDomainBalance);

  useEffect(() => {
    if (!hasEnoughBalance) {
      setError('amount', { message: formatText(MSG.notEnoughBalance) });
    } else {
      clearErrors('amount');
    }
  }, [clearErrors, hasEnoughBalance, setError]);

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading title={MSG.title} />
      </DialogSection>
      {!userHasPermission && (
        <div className={styles.permissionsRequired}>
          <DialogSection>
            <PermissionRequiredInfo requiredRoles={requiredRoles} />
          </DialogSection>
        </div>
      )}
      <DialogSection>
        <DomainFundSelectorSection
          colony={colony}
          transferBetweenDomains
          disabled={canOnlyForceAction}
        />
      </DialogSection>
      <DialogSection>
        <TokenAmountInput colony={colony} disabled={disabledInput} />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={disabledInput}
          dataTest="transferFundsAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage
            requiredPermissions={requiredRoles}
            domainName={
              hasRoleInFromDomain
                ? fromDomain?.metadata?.name
                : toDomain?.metadata?.name
            }
          />
        </DialogSection>
      )}
      {/* {onlyForceAction && (
        <NotEnoughReputation appearance={{ marginTop: 'negative' }} />
      )} */}
      {!canCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <CannotCreateMotionMessage />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          onSecondaryButtonClick={back}
          disabled={disabledSubmit}
          dataTest="transferFundsConfirmation"
          isVotingReputationEnabled={enabledExtensionData.isVotingReputationEnabled}
        />
      </DialogSection>
    </>
  );
};

TransferFundsDialogForm.displayName = displayName;

export default TransferFundsDialogForm;
