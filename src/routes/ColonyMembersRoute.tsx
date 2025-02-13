import React from 'react';
import { Outlet } from 'react-router-dom';

import { MemberContextProviderWithSearchAndFilter as MemberContextProvider } from '~context/MemberContext';
import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';

import {
  COLONY_CONTRIBUTORS_ROUTE,
  COLONY_FOLLOWERS_ROUTE,
  COLONY_MEMBERS_ROUTE,
  COLONY_TEAMS_ROUTE,
  COLONY_VERIFIED_ROUTE,
} from './routeConstants';

const navigationItems = [
  {
    id: 0,
    linkTo: COLONY_MEMBERS_ROUTE,
    label: 'All members',
    value: 'members',
  },
  {
    id: 1,
    linkTo: COLONY_CONTRIBUTORS_ROUTE,
    label: 'Contributors',
    value: 'contributors',
  },
  {
    id: 2,
    linkTo: COLONY_FOLLOWERS_ROUTE,
    label: 'Followers',
    value: 'followers',
  },
  {
    id: 3,
    linkTo: COLONY_VERIFIED_ROUTE,
    label: 'Verified',
    value: 'verified',
  },
  {
    id: 4,
    linkTo: COLONY_TEAMS_ROUTE,
    label: 'Teams',
    value: 'teams',
  },
];

const ColonyMembersRoute = () => (
  <MemberContextProvider>
    <TwoColumns aside={<Navigation navigationItems={navigationItems} />}>
      <Outlet />
    </TwoColumns>
  </MemberContextProvider>
);

export default ColonyMembersRoute;
