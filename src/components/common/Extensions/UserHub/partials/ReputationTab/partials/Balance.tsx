import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useGetUserTokenBalanceQuery } from '~gql';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import Numeral from '~shared/Numeral';
import styles from '../ReputationTab.module.css';
import { BalanceProps } from '../types';
import PopoverButton from '~shared/Extensions/PopoverButton';
import { useColonyContext, useMobile } from '~hooks';
import TitleLabel from '~v5/shared/TitleLabel';
import Button from '~v5/shared/Button';
import { formatText } from '~utils/intl';
import { useTokensModalContext } from '~context/TokensModalContext';
import { TOKENS_MODAL_TYPES } from '~v5/common/TokensModal/consts';

const displayName =
  'common.Extensions.UserHub.partials.ReputationTab.partials.Balance';

const Balance: FC<BalanceProps> = ({ nativeToken, wallet }) => {
  const { colony } = useColonyContext();
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const { data: tokenBalanceQueryData } = useGetUserTokenBalanceQuery({
    variables: {
      input: {
        walletAddress: wallet?.address ?? '',
        tokenAddress: nativeToken?.tokenAddress ?? '',
        colonyAddress: colony?.colonyAddress ?? '',
      },
    },
    skip: !wallet?.address || !nativeToken?.tokenAddress,
  });
  const tokenBalanceData = tokenBalanceQueryData?.getUserTokenBalance;

  const tokenDecimals = useMemo(
    () => getTokenDecimalsWithFallback(nativeToken?.decimals),
    [nativeToken],
  );

  const { toggleOnTokensModal, setTokensModalType } = useTokensModalContext();

  return (
    <div>
      <TitleLabel text={formatMessage({ id: 'balance.in.colony' })} />
      <div className="flex flex-col gap-4 pt-2 pb-6 border-b border-gray-100">
        <div className={styles.row}>
          <span className={styles.rowName}>
            {formatMessage({ id: 'total.balance' })}
          </span>
          <Numeral
            className={styles.numeral}
            value={tokenBalanceData?.balance ?? 0}
            decimals={tokenDecimals}
            suffix={nativeToken?.symbol || 'CLNY'}
            appearance={{ size: 'small' }}
          />
        </div>
        {/* @TODO: actived icons? */}
        <div>
          <div className={styles.row}>
            <div className="flex gap-4 items-center">
              <span className={styles.rowName}>
                {formatMessage({ id: 'active' })}
              </span>
              {!isMobile && (
                <div className="flex gap-2">
                  <Button
                    mode="primaryOutline"
                    size="extraSmall"
                    iconName="arrow-circle-down-right"
                    iconSize="extraTiny"
                    text={formatText({ id: 'button.activate' })}
                    onClick={() => {
                      toggleOnTokensModal();
                      setTokensModalType(TOKENS_MODAL_TYPES.activate);
                    }}
                  />
                  <Button
                    mode="primaryOutline"
                    size="extraSmall"
                    iconName="arrow-circle-up-right"
                    iconSize="extraTiny"
                    text={formatText({ id: 'button.deactivate' })}
                    onClick={() => {
                      toggleOnTokensModal();
                      setTokensModalType(TOKENS_MODAL_TYPES.deactivate);
                    }}
                  />
                </div>
              )}
            </div>
            <Numeral
              className={styles.numeral}
              value={tokenBalanceData?.activeBalance ?? 0}
              decimals={tokenDecimals}
              suffix={nativeToken?.symbol || 'CLNY'}
              appearance={{ size: 'small' }}
            />
          </div>
          {isMobile && (
            <div className="flex gap-2 w-full mt-3">
              <Button
                mode="primaryOutline"
                size="extraSmall"
                iconName="arrow-circle-down-right"
                iconSize="extraTiny"
                text={formatText({ id: 'button.activate' })}
                isFullSize
                onClick={() => {
                  toggleOnTokensModal();
                  setTokensModalType(TOKENS_MODAL_TYPES.activate);
                }}
              />
              <Button
                mode="primaryOutline"
                size="extraSmall"
                iconName="arrow-circle-up-right"
                iconSize="extraTiny"
                text={formatText({ id: 'button.deactivate' })}
                isFullSize
                onClick={() => {
                  toggleOnTokensModal();
                  setTokensModalType(TOKENS_MODAL_TYPES.deactivate);
                }}
              />
            </div>
          )}
        </div>

        {/* @TODO: stacked icon viewed? */}
        <div>
          <div className={styles.row}>
            <div className="flex gap-4 items-center">
              <span className={styles.rowName}>
                {formatMessage({ id: 'staked' })}
              </span>
              {!isMobile && <PopoverButton type="view" />}
            </div>
            <Numeral
              className={styles.numeral}
              value={tokenBalanceData?.lockedBalance ?? 0}
              decimals={tokenDecimals}
              suffix={nativeToken?.symbol || 'CLNY'}
              appearance={{ size: 'small' }}
            />
          </div>
          {isMobile && (
            <div className="mt-3">
              <PopoverButton type="view" isFullSize />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Balance.displayName = displayName;

export default Balance;
