import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

import Icon from '~shared/Icon';
import Link from '~v5/shared/Link';
import { links } from './consts';
import { formatText } from '~utils/intl';

const displayName = 'common.Extensions.SupportingDocuments.LinkWrapper';

const LinkWrapper: FC = () => {
  const { extensionId } = useParams();

  return (
    <>
      {links[extensionId ?? '']?.map(({ url, text }) => (
        <li key={text} className="mb-2 last:mb-0">
          <Link
            key={url}
            to={url}
            className="flex items-center text-md text-gray-600"
          >
            <span className="flex items-center shrink-0 mr-1">
              <Icon
                appearance={{ size: 'tiny' }}
                name="file-text"
                title={{ id: 'file-text' }}
              />
            </span>
            {formatText({ id: text })}
          </Link>
        </li>
      ))}
    </>
  );
};

LinkWrapper.displayName = displayName;

export default LinkWrapper;
