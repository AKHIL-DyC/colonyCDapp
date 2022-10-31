import React, { ReactNode } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { RouteComponentProps } from '~frame/RouteLayouts';
import SubscribedColoniesList from '~frame/SubscribedColoniesList';
import SimpleNav from '../SimpleNav';
import HistoryNavigation from '../HistoryNavigation';

import styles from './Default.css';

interface Props {
  children: ReactNode;
  routeProps?: RouteComponentProps;
}

const displayName = 'pages.Default';

const Default = ({
  children,
  routeProps: {
    hasBackLink = true,
    backRoute,
    backText,
    backTextValues,
    hasSubscribedColonies = true,
  } = {},
}: Props) => {
  const location = useLocation();
  const backLinkExists =
    hasBackLink === undefined
      ? location.state && location.state.hasBackLink
      : hasBackLink;

  const params = useParams();
  const resolvedBackRoute =
    typeof backRoute === 'function' ? backRoute(params) : backRoute;

  return (
    <div className={styles.main}>
      <SimpleNav>
        {backLinkExists && (
          <HistoryNavigation
            backRoute={resolvedBackRoute}
            backText={backText}
            backTextValues={backTextValues}
            className={
              hasSubscribedColonies ? styles.history : styles.onlyHistory
            }
          />
        )}
        <div className={styles.content}>
          {hasSubscribedColonies && (
            <div className={styles.coloniesList}>
              <SubscribedColoniesList />
            </div>
          )}
          <div className={styles.children}>{children}</div>
        </div>
      </SimpleNav>
    </div>
  );
};

Default.displayName = displayName;

export default Default;
