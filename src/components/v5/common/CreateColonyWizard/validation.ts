import { string, object } from 'yup';

import { ADDRESS_ZERO, DEFAULT_NETWORK_TOKEN } from '~constants';
import { GetFullColonyByNameDocument } from '~gql';
import { intl } from '~utils/intl';
import { createYupTestFromQuery } from '~utils/yup/tests';
import { Token } from '~types';

import { FormValues } from './CreateColonyWizard';

/*
 * The colony name regex is composed of
 * ^[A-Za-z0-9] starts with upper case, lower case or numerals
 * \w can include upper case, lower case, numerals or underscore
 * we do not match length as that check is handled in a different component
 */
const COLONY_NAME_REGEX = /^[A-Za-z0-9]\w+$/;

const TOKEN_SYMBOL_REGEX = /^[A-Za-z0-9]+$/;

const isNameTaken = createYupTestFromQuery({
  query: GetFullColonyByNameDocument,
  circuitBreaker: isValidName,
});

const { formatMessage } = intl({
  'error.urlTaken': 'This colony URL is already taken',
  'error.colonyURL': 'This is not a valid colony URL',
  'error.colonyNameRequired': 'Enter a name to continue',
  'error.colonyURLRequired': 'Enter a URL to continue',
  'error.addressZeroError':
    'You cannot use {symbol} token as a native token for colony.',
  'error.tokenAddressRequired': 'Enter a token address to continue',
  'error.invalidToken': 'Invalid address.',
  'error.tokenNotFound':
    'Token data not found. Please check the token contract address.',
  'error.tokenNameRequired': 'Enter a token name to continue',
  'error.tokenSymbolRequired': 'Enter a token symbol to continue',
  'error.tokenNameLength': 'Token name should be 255 characters or fewer',
  'error.tokenSymbol': 'Token symbol can only contain letters and numbers',
});

export const colonyNameValidationSchema = object({
  displayName: string()
    .trim()
    .required(formatMessage({ id: 'error.colonyNameRequired' })),
  colonyName: string()
    .required(formatMessage({ id: 'error.colonyURLRequired' }))
    .test('isValidName', formatMessage({ id: 'error.colonyURL' }), isValidName)
    .test('isNameTaken', formatMessage({ id: 'error.urlTaken' }), isNameTaken),
}).defined();

export const selectTokenValidationSchema = object({
  tokenAddress: string()
    .default('')
    .when('tokenChoiceVerify', {
      is: 'select',
      then: (schema) =>
        schema
          .required(formatMessage({ id: 'error.tokenAddressRequired' }))
          .address(formatMessage({ id: 'error.invalidToken' }))
          .notOneOf(
            [ADDRESS_ZERO],
            formatMessage(
              { id: 'error.addressZeroError' },
              {
                symbol: DEFAULT_NETWORK_TOKEN.symbol,
              },
            ),
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
  /**
   * The test below relies on the fact that token field will be null
   * if token data cannot be found. The message argument is empty since it won't show anywhere
   */
  token: object<Token>()
    .nullable()
    .when(['tokenChoiceVerify', 'tokenAddress'], {
      is: (tokenChoiceVerify) => tokenChoiceVerify === 'select',
      then: (schema) =>
        schema.nullable().test('doesTokenExist', '', doesTokenExist),
      otherwise: (schema) => schema.notRequired(),
    }),
}).defined();

export const createTokenValidationSchema = object({
  tokenSymbol: string().when('tokenChoiceVerify', {
    is: 'create',
    then: (schema) =>
      schema
        .test(
          'isValidTokenSymbol',
          formatMessage({ id: 'error.tokenSymbol' }),
          isValidTokenSymbol,
        )
        .required(formatMessage({ id: 'error.tokenSymbolRequired' })),
    otherwise: (schema) => schema.notRequired(),
  }),
  tokenName: string()
    .default('')
    .when('tokenChoiceVerify', {
      is: 'create',
      then: (schema) =>
        schema.required(formatMessage({ id: 'error.tokenNameRequired' })),
      otherwise: (schema) => schema.notRequired(),
    }),
}).defined();

export const tokenValidationSchema = object({
  tokenChoiceVerify: string(),
  tokenIcon: string(),
})
  .concat(selectTokenValidationSchema)
  .concat(createTokenValidationSchema);

function isValidName(name: string) {
  return name ? new RegExp(COLONY_NAME_REGEX).test(name) : true;
}

function isValidTokenSymbol(symbol: string) {
  return symbol ? new RegExp(TOKEN_SYMBOL_REGEX).test(symbol) : true;
}

function doesTokenExist(value: FormValues['token']) {
  if (!value) {
    return this.createError({
      message: formatMessage({ id: 'error.tokenNotFound' }),
      path: 'tokenAddress',
    });
  }
  return true;
}
