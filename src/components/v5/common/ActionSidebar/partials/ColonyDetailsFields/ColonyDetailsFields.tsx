import React, { FC } from 'react';
import ActionFormRow from '~v5/common/ActionFormRow';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase';
import { MAX_COLONY_DISPLAY_NAME } from '~constants';
import ColonyAvatarField from './partials/ColonyAvatarField';
import { formatText } from '~utils/intl';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase';

const displayName = 'v5.common.ActionsContent.partials.ColonyDetailsFields';

const ColonyDetailsFields: FC = () => (
  <>
    <ActionFormRow
      iconName="pencil-circle"
      fieldName="colonyName"
      title={formatText({ id: 'actionSidebar.colonyName' })}
      tooltips={{
        label: {
          tooltipContent: formatText({
            id: 'actionSidebar.tooltip.editColony.colonyName',
          }),
        },
      }}
    >
      <FormInputBase
        name="colonyName"
        maxLength={MAX_COLONY_DISPLAY_NAME}
        placeholder={formatText({
          id: 'actionSidebar.colonyName.placeholder',
        })}
        mode="secondary"
      />
    </ActionFormRow>
    <ActionFormRow
      iconName="image"
      fieldName="avatar"
      title={formatText({ id: 'actionSidebar.colonyLogo' })}
      tooltips={{
        label: {
          tooltipContent: formatText({
            id: 'actionSidebar.tooltip.editColony.colonyLogo',
          }),
        },
      }}
    >
      <div className="flex items-center">
        <ColonyAvatarField
          name="avatar"
          fileOptions={{
            fileFormat: ['.PNG', '.JPG', '.SVG'],
            fileDimension: '250x250px',
            fileSize: '1MB',
          }}
        />
      </div>
    </ActionFormRow>
    <ActionFormRow
      iconName="file-text"
      fieldName="colonyDescription"
      title={formatText({ id: 'actionSidebar.colonyDescription' })}
      isMultiLine
      tooltips={{
        label: {
          tooltipContent: formatText({
            id: 'actionSidebar.tooltip.editColony.colonyDescription',
          }),
        },
      }}
    >
      <FormTextareaBase
        name="colonyDescription"
        placeholder={formatText({
          id: 'actionSidebar.colonyDescription.placeholder',
        })}
      />
    </ActionFormRow>
  </>
);

ColonyDetailsFields.displayName = displayName;

export default ColonyDetailsFields;
