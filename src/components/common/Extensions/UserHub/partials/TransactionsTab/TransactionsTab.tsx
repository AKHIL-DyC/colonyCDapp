import React, { FC } from 'react';

import { TransactionsProps } from './types';

import EmptyContent from '~v5/common/EmptyContent';
import TransactionList from './partials/TransactionList';
import { useTransactionsListObserver } from './hooks';

import styles from './TransactionsTab.css';
import { formatText } from '~utils/intl';
import { useUserTransactionContext } from '~context/UserTransactionContext';

export const displayName = 'common.Extensions.UserHub.partials.TransactionsTab';

const TransactionsTab: FC<TransactionsProps> = () =>
  // {
  //   appearance: { interactive },
  // }
  {
    const { transactionAndMessageGroups } = useUserTransactionContext();
    // const [selectedGroupIdx, setSelectedGroupIdx] = useState<number>(
    //   isLatestTxPending ? 0 : -1,
    // );

    // const renderTransactions = () => {
    //   const unselectTransactionGroup = () => {
    //     setSelectedGroupIdx(-1);
    //   };
    //   let detailsTransactionGroup = transactionAndMessageGroups[selectedGroupIdx];
    //   if (!interactive && selectedGroupIdx === -1) {
    //     [detailsTransactionGroup] = transactionAndMessageGroups;
    //   }

    //   if (detailsTransactionGroup || !interactive) {
    //     if (isTxGroup(detailsTransactionGroup)) {
    //       return (
    //         <TransactionDetails transactionGroup={detailsTransactionGroup} />
    //       );
    //     }
    //     // @TODO: when handle this cases?
    //     return (
    //       <MessageCardDetails
    //         message={detailsTransactionGroup[0] as MessageType}
    //         onClose={unselectTransactionGroup}
    //       />
    //     );
    //   }

    //   return;
    // };

    const isEmpty =
      !transactionAndMessageGroups || !transactionAndMessageGroups.length;

    /* Load more when reaching end of list  */
    useTransactionsListObserver();

    return (
      <div className="flex flex-col w-full h-full">
        <p className="heading-5 mb-2.5 sm:mb-0.5">
          {formatText({ id: 'transactions' })}
        </p>
        <div
          id="transactionsListContainer"
          className={styles.transactionsListContainer}
        >
          {isEmpty ? (
            <EmptyContent
              title={{ id: 'empty.content.title.transactions' }}
              description={{ id: 'empty.content.subtitle.transactions' }}
              icon="binoculars"
            />
          ) : (
            <TransactionList />
          )}
        </div>
      </div>
    );
  };

TransactionsTab.displayName = displayName;

export default TransactionsTab;
