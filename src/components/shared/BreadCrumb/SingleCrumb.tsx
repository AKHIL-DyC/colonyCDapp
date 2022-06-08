import React, { ReactElement } from 'react';

import NavLink from '~shared/NavLink';

import styles from './BreadCrumb.css';

interface Props {
  crumbText: string | ReactElement;
  crumbLink?: string;
  lastCrumb?: boolean;
}

const SingleCrumb = ({ crumbText, crumbLink, lastCrumb }: Props) => {
  const crumbTitle = typeof crumbText === 'string' ? crumbText : '';

  if (lastCrumb) {
    return (
      <div className={styles.elementLast} title={crumbTitle}>
        <span className={styles.breadCrumble}>
          {crumbLink ? (
            <NavLink className={styles.invisibleLink} to={crumbLink}>
              {crumbText}
            </NavLink>
          ) : (
            crumbText
          )}
        </span>
      </div>
    );
  }
  return (
    <div className={styles.element} title={crumbTitle}>
      <span className={styles.breadCrumble}>
        {crumbLink ? (
          <NavLink className={styles.invisibleLink} to={crumbLink}>
            {crumbText}
          </NavLink>
        ) : (
          crumbText
        )}
      </span>
      <span className={styles.arrow}>&gt;</span>
    </div>
  );
};

SingleCrumb.displayName = 'BreadCrumb.SingleCrumb';

export default SingleCrumb;
