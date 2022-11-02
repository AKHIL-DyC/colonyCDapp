import React, { ReactNode } from 'react';

// import { useDialog } from '~core/Dialog';

import NewActionButton from '~common/NewActionButton';
import ColonyTotalFunds from '~common/ColonyTotalFunds';
// import WrongNetworkDialog from '~dialogs/WrongNetworkDialog';

// import { checkIfNetworkIsAllowed } from '~utils/networks';

import { Colony } from '~types';

import ColonyDomainSelector from './ColonyDomainSelector';
import ColonyFundingWidget from './ColonyFundingWidget';
// import ColonyUnclaimedTransfers from './ColonyUnclaimedTransfers';
import ColonyTitle from './ColonyTitle';
import ColonyNavigation from './ColonyNavigation';
import ColonyMembersWidget from './ColonyMembersWidget';
// import ColonyExtensions from './ColonyExtensions';
import ColonyDomainDescription from './ColonyDomainDescription';
// import ColonyUpgrade from './ColonyUpgrade';
// import ColonyFinishDeployment from './ColonyFinishDeployment';
// import ExtensionUpgrade from './ExtensionUpgrade';

import styles from './ColonyHomeLayout.css';

type Props = {
  colony: Colony;
  filteredDomainId: number;
  onDomainChange?: (domainId: number) => void;
  /*
   * This component should only be used with a child to render,
   * otherwise it has no point
   */
  children: ReactNode;
  showControls?: boolean;
  showNavigation?: boolean;
  showSidebar?: boolean;
  showActions?: boolean;
  ethDomainId?: number;
};

const displayName = 'common.ColonyHome.ColonyHomeLayout';

const ColonyHomeLayout = ({
  colony,
  filteredDomainId,
  children,
  ethDomainId,
  showControls = true,
  showNavigation = true,
  showSidebar = true,
  showActions = true,
  onDomainChange = () => null,
}: Props) => {
  // const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);
  // const openWrongNetworkDialog = useDialog(WrongNetworkDialog);

  // useEffect(() => {
  //   if (!ethereal && !isNetworkAllowed) {
  //     openWrongNetworkDialog();
  //   }
  // }, [ethereal, isNetworkAllowed, openWrongNetworkDialog]);

  return (
    <div className={styles.main}>
      <div
        className={showSidebar ? styles.mainContentGrid : styles.minimalGrid}
      >
        <aside className={styles.leftAside}>
          <ColonyTitle colony={colony} />
          {showNavigation && <ColonyNavigation colony={colony} />}
        </aside>
        <div className={styles.mainContent}>
          {showControls && (
            <>
              <ColonyTotalFunds colony={colony} />
              <div className={styles.contentActionsPanel}>
                <div className={styles.domainsDropdownContainer}>
                  <ColonyDomainSelector
                    filteredDomainId={filteredDomainId}
                    onDomainChange={onDomainChange}
                    colony={colony}
                  />
                </div>
                {showActions && (
                  <NewActionButton colony={colony} ethDomainId={ethDomainId} />
                )}
              </div>
            </>
          )}
          {children}
        </div>
        {showSidebar && (
          <aside className={styles.rightAside}>
            <ColonyDomainDescription
              colony={colony}
              currentDomainId={filteredDomainId}
            />
            {/* <ColonyUnclaimedTransfers colony={colony} /> */}
            <ColonyFundingWidget
              colony={colony}
              currentDomainId={filteredDomainId}
            />
            <ColonyMembersWidget
              colony={colony}
              currentDomainId={filteredDomainId}
            />
            {/* <ColonyExtensions colony={colony} /> */}
          </aside>
        )}
      </div>
      {/* <ColonyUpgrade colony={colony} />
      <ExtensionUpgrade colony={colony} />
      <ColonyFinishDeployment colony={colony} /> */}
    </div>
  );
};

ColonyHomeLayout.displayName = displayName;

export default ColonyHomeLayout;
