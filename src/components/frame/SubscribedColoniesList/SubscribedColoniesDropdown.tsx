import React from 'react';
// import { NavLink } from 'react-router-dom';

import NavLink from '~shared/NavLink';
import ColonyAvatar from '~shared/ColonyAvatar';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~shared/DropdownMenu';
import Popover from '~shared/Popover';
import { Colony } from '~types';
import { WatchedColonies } from '~gql';
import { useColonyContext } from '~hooks';

import styles from './SubscribedColoniesList.css';

const displayName = 'frame.SubscribedColoniesList.SubscribedColoniesDropdown';

// export type Colony = Pick<
//   ProcessedColony,
//   | 'colonyName'
//   | 'colonyAddress'
//   | 'id'
//   | 'displayName'
//   | 'avatarHash'
//   | 'avatarURL'
// >;

interface Props {
  coloniesList: WatchedColonies[];
}

const SubscribedColoniesDropdown = ({ coloniesList }: Props) => {
  const { colony: activeColony } = useColonyContext();
  const colonyToDisplay = activeColony || coloniesList[0].colony;

  return (
    <Popover
      renderContent={
        <DropdownMenu>
          <DropdownMenuSection>
            {coloniesList.map(({ colony }) => (
              <DropdownMenuItem key={colony.id}>
                <NavLink
                  activeClassName={styles.activeColony}
                  title={colony.name}
                  to={`/colony/${colony.name}`}
                >
                  <div className={styles.dropdownItem}>
                    <div className={styles.itemImage}>
                      <ColonyAvatar
                        colony={colony}
                        colonyAddress={colony.id}
                        size="xs"
                      />
                    </div>
                    <div>{colony.profile?.displayName || colony.name}</div>
                  </div>
                </NavLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSection>
        </DropdownMenu>
      }
      trigger="click"
      showArrow={false}
      placement="bottom"
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 5],
            },
          },
        ],
      }}
    >
      <NavLink
        activeClassName={styles.activeColony}
        className={styles.itemLink}
        title={colonyToDisplay.name}
        to={`/colony/${colonyToDisplay.name}`}
      >
        <div className={styles.itemImage}>
          <ColonyAvatar
            colony={colonyToDisplay as Colony}
            colonyAddress={colonyToDisplay.id}
            size="xs"
          />
        </div>
      </NavLink>
    </Popover>
  );
};

SubscribedColoniesDropdown.displayName = displayName;

export default SubscribedColoniesDropdown;
