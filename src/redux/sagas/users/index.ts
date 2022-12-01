import { call, fork, put, takeLatest } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';
// import { BigNumber } from 'ethers';
import gql from 'graphql-tag';
import { utils } from 'ethers';
import { QueryOptions } from '@apollo/client';

import { ContextModule, getContext, removeContext } from '~context';
import {
  createUniqueUser,
  CreateUniqueUserMutation,
  CreateUniqueUserMutationVariables,
  getProfileByEmail,
  getUserByName,
} from '~gql';
import { routeRedirect } from '~utils/saga/effects';
import { clearLastWallet } from '~utils/autoLogin';
import { LANDING_PAGE_ROUTE } from '~routes';

import { ActionTypes } from '../../actionTypes';
import { Action, AllActions } from '../../types/actions';
import {
  putError,
  takeFrom,
  // getColonyManager
} from '../utils';
import { getWallet } from '../wallet';
import { createTransaction, getTxChannel } from '../transactions';

// import { transactionLoadRelated, transactionReady } from '../../actionCreators';
// import {
//   createTransactionChannels,
//   createTransaction,
//   getTxChannel,
// } from '../transactions';

// function* userAvatarRemove({ meta }: Action<ActionTypes.USER_AVATAR_REMOVE>) {
//   try {
//     const { walletAddress } = yield getLoggedInUser();
//     const apolloClient = getContext(ContextModule.ApolloClient);
//     yield apolloClient.mutate<EditUserMutation, EditUserMutationVariables>({
//       mutation: EditUserDocument,
//       variables: { input: { avatarHash: null } },
//     });

//     yield put<AllActions>({
//       type: ActionTypes.USER_AVATAR_REMOVE_SUCCESS,
//       payload: { address: walletAddress },
//       meta,
//     });
//   } catch (error) {
//     return yield putError(ActionTypes.USER_AVATAR_REMOVE_ERROR, error, meta);
//   }
//   return null;
// }

// function* userAvatarUpload({
//   meta,
//   payload,
// }: Action<ActionTypes.USER_AVATAR_UPLOAD>) {
//   try {
//     const { walletAddress } = yield getLoggedInUser();
//     const apolloClient = getContext(ContextModule.ApolloClient);

//     let ipfsHash = null;
//     if (payload.data) {
//       try {
//         ipfsHash = yield call(
//           ipfsUpload,
//           JSON.stringify({ image: payload.data } as IPFSAvatarImage),
//         );
//       } catch (error) {
//         // silent error
//       }
//     }

//     yield apolloClient.mutate<EditUserMutation, EditUserMutationVariables>({
//       mutation: EditUserDocument,
//       variables: { input: { avatarHash: ipfsHash } },
//     });

//     yield put<AllActions>({
//       type: ActionTypes.USER_AVATAR_UPLOAD_SUCCESS,
//       meta,
//       payload: {
//         hash: ipfsHash,
//         avatar: payload.data,
//         address: walletAddress,
//       },
//     });
//   } catch (error) {
//     return yield putError(ActionTypes.USER_AVATAR_UPLOAD_ERROR, error, meta);
//   }
//   return null;
// }

function* usernameCreate({
  meta: { id, navigate },
  meta,
  payload: { username, email, emailPermissions },
}: Action<ActionTypes.USERNAME_CREATE>) {
  const wallet = yield call(getWallet);
  const walletAddress = utils.getAddress(wallet?.address);

  const txChannel = yield call(getTxChannel, id);
  const apolloClient = getContext(ContextModule.ApolloClient);

  try {
    yield fork(createTransaction, id, {
      context: ClientType.NetworkClient,
      methodName: 'registerUserLabel',
      ready: true,
      params: [username, ''],
      group: {
        key: 'transaction.batch.createUser',
        id,
        index: 0,
      },
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put<AllActions>({
      type: ActionTypes.USERNAME_CREATE_SUCCESS,
      payload: {
        email,
        username,
        emailPermissions,
      },
      meta,
    });

    /* Queries will be refetched after the mutation, in order to update the cache. */
    const refetchQueries: QueryOptions[] = [
      {
        query: gql(getUserByName),
        variables: { name: username },
      },
    ];

    if (email) {
      refetchQueries.push({
        query: gql(getProfileByEmail),
        variables: { email },
      });
    }
    /*
     * Write user to db
     */
    yield apolloClient.mutate<
      CreateUniqueUserMutation,
      CreateUniqueUserMutationVariables
    >({
      mutation: gql(createUniqueUser),
      variables: {
        input: {
          id: walletAddress,
          name: username,
          profile: {
            email: email || undefined,
            displayName: username,
            meta: { emailPermissions },
          },
        },
      },
      refetchQueries,
    });

    /* Replace: true so you can't get back to the User wizard after completion */
    yield routeRedirect(LANDING_PAGE_ROUTE, navigate, { replace: true });
  } catch (error) {
    return yield putError(ActionTypes.USERNAME_CREATE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

function* userLogout() {
  try {
    removeContext(ContextModule.Wallet);
    clearLastWallet();

    yield put<AllActions>({
      type: ActionTypes.USER_LOGOUT_SUCCESS,
    });
  } catch (error) {
    return yield putError(ActionTypes.USER_LOGOUT_ERROR, error);
  }
  return null;
}

// function* userDepositToken({
//   meta,
//   payload: { tokenAddress, amount, colonyAddress },
// }: Action<ActionTypes.USER_DEPOSIT_TOKEN>) {
//   const txChannel = yield call(getTxChannel, meta.id);
//   try {
//     const apolloClient = getContext(ContextModule.ApolloClient);
//     const colonyManager = yield getColonyManager();
//     const { walletAddress } = yield getLoggedInUser();

//     const tokenLockingClient: TokenLockingClient =
//       yield colonyManager.getClient(
//         ClientType.TokenLockingClient,
//         colonyAddress,
//       );

//     const batchKey = 'deposit';

//     const { approve, deposit } = yield createTransactionChannels(meta.id, [
//       'approve',
//       'deposit',
//     ]);

//     const createGroupTransaction = ({ id, index }, config) =>
//       fork(createTransaction, id, {
//         ...config,
//         group: {
//           key: batchKey,
//           id: meta.id,
//           index,
//         },
//       });

//     yield createGroupTransaction(approve, {
//       context: ClientType.TokenClient,
//       methodName: 'approve',
//       identifier: tokenAddress,
//       params: [tokenLockingClient.address, BigNumber.from(amount)],
//       ready: false,
//     });

//     yield createGroupTransaction(deposit, {
//       context: ClientType.TokenLockingClient,
//       methodName: 'deposit',
//       identifier: colonyAddress,
//       params: [tokenAddress, BigNumber.from(amount), false],
//       ready: false,
//     });

//     yield takeFrom(approve.channel, ActionTypes.TRANSACTION_CREATED);

//     yield put(transactionReady(approve.id));

//     yield takeFrom(approve.channel, ActionTypes.TRANSACTION_SUCCEEDED);

//     yield takeFrom(deposit.channel, ActionTypes.TRANSACTION_CREATED);

//     yield put(transactionReady(deposit.id));

//     yield takeFrom(deposit.channel, ActionTypes.TRANSACTION_SUCCEEDED);

//     yield apolloClient.query<
//       UserBalanceWithLockQuery,
//       UserBalanceWithLockQueryVariables
//     >({
//       query: UserBalanceWithLockDocument,
//       variables: {
//         address: walletAddress,
//         tokenAddress,
//         colonyAddress,
//       },
//       fetchPolicy: 'network-only',
//     });

//     yield put({
//       type: ActionTypes.USER_DEPOSIT_TOKEN_SUCCESS,
//       meta,
//     });
//   } catch (error) {
//     return yield putError(ActionTypes.USER_DEPOSIT_TOKEN_ERROR, error, meta);
//   } finally {
//     txChannel.close();
//   }
//   return null;
// }

// function* userWithdrawToken({
//   meta,
//   payload: { tokenAddress, amount, colonyAddress },
// }: Action<ActionTypes.USER_WITHDRAW_TOKEN>) {
//   const txChannel = yield call(getTxChannel, meta.id);
//   try {
//     const apolloClient = getContext(ContextModule.ApolloClient);
//     const { walletAddress } = yield getLoggedInUser();

//     const { withdraw } = yield createTransactionChannels(meta.id, ['withdraw']);

//     yield fork(createTransaction, withdraw.id, {
//       context: ClientType.TokenLockingClient,
//       methodName: 'withdraw',
//       identifier: colonyAddress,
//       params: [tokenAddress, BigNumber.from(amount), false],
//       ready: false,
//       group: {
//         key: 'withdraw',
//         id: meta.id,
//         index: 0,
//       },
//     });

//     yield takeFrom(withdraw.channel, ActionTypes.TRANSACTION_CREATED);

//     yield put(transactionReady(withdraw.id));

//     yield takeFrom(withdraw.channel, ActionTypes.TRANSACTION_SUCCEEDED);

//     yield apolloClient.query<
//       UserBalanceWithLockQuery,
//       UserBalanceWithLockQueryVariables
//     >({
//       query: UserBalanceWithLockDocument,
//       variables: {
//         address: walletAddress,
//         tokenAddress,
//         colonyAddress,
//       },
//       fetchPolicy: 'network-only',
//     });

//     yield put<AllActions>({
//       type: ActionTypes.USER_WITHDRAW_TOKEN_SUCCESS,
//       meta,
//       payload: {
//         tokenAddress,
//         amount,
//       },
//     });
//   } catch (error) {
//     return yield putError(ActionTypes.USER_WITHDRAW_TOKEN_ERROR, error, meta);
//   } finally {
//     txChannel.close();
//   }
//   return null;
// }

export function* setupUsersSagas() {
  // yield takeLatest(ActionTypes.USER_AVATAR_REMOVE, userAvatarRemove);
  // yield takeLatest(ActionTypes.USER_AVATAR_UPLOAD, userAvatarUpload);
  yield takeLatest(ActionTypes.USER_LOGOUT, userLogout);
  yield takeLatest(ActionTypes.USERNAME_CREATE, usernameCreate);
  // yield takeLatest(ActionTypes.USER_DEPOSIT_TOKEN, userDepositToken);
  // yield takeLatest(ActionTypes.USER_WITHDRAW_TOKEN, userWithdrawToken);
}
