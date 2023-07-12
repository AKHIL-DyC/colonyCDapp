import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import BurgerMenu from '~v5/shared/BurgerMenu';
import PopoverBase from '~v5/shared/PopoverBase';
import SubNavigation from '../pages/MembersPage/partials/SubNavigation';
import Filter from '~v5/common/Filter';
import ManageMemberModal from '~v5/common/Modals/ManageMemberModal';
import { useHeader } from './hooks';
import { HeaderProps } from './types';

const displayName = 'v5.frame.Header';

const Header: FC<HeaderProps> = ({ title }) => {
  const { formatMessage } = useIntl();
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    useHeader();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h4 className="heading-4 mr-2">{formatMessage(title)}</h4>
          <BurgerMenu isVertical setTriggerRef={setTriggerRef} />
          {visible && (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              withTooltipStyles={false}
              cardProps={{
                rounded: 's',
                hasShadow: true,
                className: 'py-4 px-2',
              }}
              classNames="w-full sm:max-w-[17.375rem]"
            >
              <SubNavigation
                onManageMembersClick={() => setIsManageMembersOpen(true)}
              />
            </PopoverBase>
          )}
        </div>
        <Filter />
      </div>
      <ManageMemberModal
        isOpen={isManageMembersOpen}
        onClose={() => setIsManageMembersOpen(false)}
      />
    </>
  );
};

Header.displayName = displayName;

export default Header;
