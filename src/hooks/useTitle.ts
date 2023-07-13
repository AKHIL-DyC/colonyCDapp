// When called without an argument (from `Routes.tsx`) this hook
// parses the window location URL to set the title. If called
// with an argument `title` (from any component), it sets the
// document title to `title` - this might be especially useful
// when you want to manipulate the title even when the route
// remains same (for example, when multiple dialogue boxes can
// be present on the same route.)

/*
 * @TODO This needs to be addressed and either refactored or removed
 */

import { useLocation, matchPath } from 'react-router-dom';
import { useEffect } from 'react';
import { defineMessages, useIntl, MessageDescriptor } from 'react-intl';

import {
  CREATE_COLONY_ROUTE,
  CREATE_USER_ROUTE,
  USER_EDIT_ROUTE,
  NOT_FOUND_ROUTE,
  LANDING_PAGE_ROUTE,
  COLONY_HOME_ROUTE,
  COLONY_EVENTS_ROUTE,
  ACTIONS_PAGE_ROUTE,
  USER_ROUTE,
  COLONY_EXTENSION_SETUP_ROUTE,
  COLONY_EXTENSION_DETAILS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_FUNDING_ROUTE,
  COLONY_MEMBERS_ROUTE,
} from '~routes/routeConstants';
import { SimpleMessageValues } from '~types/index';
import { notNull } from '~utils/arrays';

import useColonyContext from './useColonyContext';

const displayName = 'utils.hooks';

const MSG = defineMessages({
  createColony: {
    id: `${displayName}.useTitle.creatColony`,
    defaultMessage: `Create Colony | Colony`,
  },

  createUser: {
    id: `${displayName}.useTitle.creatUser`,
    defaultMessage: `Create User | Colony`,
  },

  editProfile: {
    id: `${displayName}.useTitle.editProfile`,
    defaultMessage: `Edit Profile | Colony`,
  },

  notFound: {
    id: `${displayName}.useTitle.notFound`,
    defaultMessage: `404 - Not Found | Colony`,
  },

  landing: {
    id: `${displayName}.useTitle.landing`,
    defaultMessage: `Welcome to Colony`,
  },

  colonyHome: {
    id: `${displayName}.useTitle.colonyHome`,
    defaultMessage: `Actions | Colony - {colonyName}`,
  },

  colonyEvents: {
    id: `${displayName}.useTitle.colonyEvents`,
    defaultMessage: `Transactions Log | Colony - {colonyName}`,
  },

  colonyFunds: {
    id: `${displayName}.useTitle.colonyFunds`,
    defaultMessage: `Funds | Colony - {colonyName}`,
  },

  colonyExtensions: {
    id: `${displayName}.useTitle.colonyExtensions`,
    defaultMessage: `Extensions | Colony - {colonyName}`,
  },

  colonyExtensionDetails: {
    id: `${displayName}.useTitle.colonyExtensionDetails`,
    defaultMessage: `Extensions > {extensionId, select,
      VotingReputation {Governance}
      OneTxPayment {One Transaction Payment}
      other {{extensionId}}
      } | Colony - {colonyName}`,
  },

  colonyExtensionSetup: {
    id: `${displayName}.useTitle.colonyExtensionSetup`,
    defaultMessage: `Extensions > {extensionId, select,
      VotingReputation {Governance}
      OneTxPayment {One Transaction Payment}
      other {{extensionId}}
      } > Setup | Colony - {colonyName}`,
  },

  colonyMembers: {
    id: `${displayName}.useTitle.colonyMembers`,
    defaultMessage: `Members | Colony - {colonyName}`,
  },

  userProfile: {
    id: `${displayName}.useTitle.userProfile`,
    defaultMessage: `Users > {username} | Colony`,
  },

  transactionDetails: {
    id: `${displayName}.useTitle.transactionDetails`,
    defaultMessage: `Transaction - {transactionHash} | Colony - {colonyName}`,
  },
  buyTokens: {
    id: `${displayName}.useTitle.buyTokens`,
    defaultMessage: `Buy Tokens | Colony - {colonyName}`,
  },
  fallbackTitle: {
    id: `${displayName}.useTitle.fallbackTitle`,
    defaultMessage: `Colony`,
  },
});

interface MessageWithValues {
  msg: MessageDescriptor;
  values?: SimpleMessageValues;
}

const COLONY_HOME_ROUTE_WITHOUT_WILDCARD = COLONY_HOME_ROUTE.slice(0, -2);

const routeMessages: Record<string, MessageDescriptor> = {
  [CREATE_COLONY_ROUTE]: MSG.createColony,
  [CREATE_USER_ROUTE]: MSG.createUser,
  [USER_EDIT_ROUTE]: MSG.editProfile,
  [NOT_FOUND_ROUTE]: MSG.notFound,
  [LANDING_PAGE_ROUTE]: MSG.landing,
  [COLONY_HOME_ROUTE]: MSG.colonyHome,
  [COLONY_EVENTS_ROUTE]: MSG.colonyEvents,
  [COLONY_FUNDING_ROUTE]: MSG.colonyFunds,
  [`${COLONY_HOME_ROUTE_WITHOUT_WILDCARD}${COLONY_EXTENSIONS_ROUTE}`]:
    MSG.colonyExtensions,
  [`${COLONY_HOME_ROUTE_WITHOUT_WILDCARD}${COLONY_EXTENSION_DETAILS_ROUTE}`]:
    MSG.colonyExtensionDetails,
  [`${COLONY_HOME_ROUTE_WITHOUT_WILDCARD}${COLONY_EXTENSION_SETUP_ROUTE}`]:
    MSG.colonyExtensionSetup,
  [USER_ROUTE]: MSG.userProfile,
  [ACTIONS_PAGE_ROUTE]: MSG.transactionDetails,
  [COLONY_MEMBERS_ROUTE]: MSG.colonyMembers,
  '/': MSG.fallbackTitle,
};

const allRoutes = Object.keys(routeMessages);

const getMessageAndValues = (locationPath: string): MessageWithValues => {
  const filteredRoutes = allRoutes.filter((routePattern) =>
    notNull(matchPath(routePattern, locationPath)),
  );

  // Fallback when no route matches
  // For example before an invalid route get redirected to 404
  const matchedRoute = filteredRoutes.at(-1) || '/';

  const values = matchPath(matchedRoute, locationPath)?.params; // this can be empty {}

  return { msg: routeMessages[matchedRoute], values };
};

export const useTitle = (title?: string) => {
  const { colony } = useColonyContext();
  const location = useLocation().pathname;
  const { formatMessage } = useIntl();
  const { msg, values } = getMessageAndValues(location);

  const colonyDisplayName = colony?.metadata?.displayName || colony?.name;

  return useEffect(() => {
    const titleToSet =
      title ||
      formatMessage(msg, {
        ...values,
        colonyName: colonyDisplayName,
      });

    document.title = titleToSet;
  });
};

export default useTitle;
