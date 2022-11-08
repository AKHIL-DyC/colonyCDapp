import Decimal from 'decimal.js';
import { BigNumber, BigNumberish } from 'ethers';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';

export const getBalanceFromToken = (
  /** @TODO: add proper type */
  token: any,
  tokenDomainId = 0,
) => {
  let result;
  if (!token) return BigNumber.from(0);
  if ('balances' in token) {
    const domainBalance = token.balances.find(
      ({ domainId }) => domainId === tokenDomainId,
    );
    result = domainBalance ? domainBalance.amount : 0;
  } else if ('processedBalances' in token) {
    const domainBalance = token.processedBalances.find(
      ({ domainId }) => domainId === tokenDomainId,
    );
    result = domainBalance ? domainBalance.amount : 0;
  } else if ('balance' in token) {
    result = token.balance;
  } else {
    result = 0;
  }
  return BigNumber.from(result);
};

/*
 * @NOTE Don't trust the incoming decimals
 *
 * The incoming decimals can be virtually anything, so we have to test if it's
 * a number, and return that number (even if that number is 0).
 * If it's not a number then fallback to the default token decimals value.
 */
export const getTokenDecimalsWithFallback = (
  decimals: any,
  fallbackDecimals?: any,
): number => {
  if (Number.isInteger(decimals) && decimals >= 0) {
    return decimals;
  }
  if (Number.isInteger(fallbackDecimals) && fallbackDecimals >= 0) {
    return fallbackDecimals;
  }
  return DEFAULT_TOKEN_DECIMALS;
};

/**
 * Get value with its decimal point shifted by @param decimals places
 */
export const getFormattedTokenValue = (
  value: BigNumberish,
  decimals: any,
): string => {
  const tokenDecimals = new Decimal(getTokenDecimalsWithFallback(decimals));

  return new Decimal(value.toString())
    .div(new Decimal(10).pow(tokenDecimals))
    .toString();
};
