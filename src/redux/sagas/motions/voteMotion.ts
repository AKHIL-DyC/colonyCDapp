import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, ExtensionClient } from '@colony/colony-js';
import { soliditySha3, soliditySha3Raw } from 'web3-utils';

import { ActionTypes } from '../../actionTypes';
import { AllActions, Action } from '../../types/actions';
import { getContext, ContextModule } from '~context';
import { putError, takeFrom, updateMotionValues } from '../utils';

import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../transactions';
import { transactionReady } from '../../actionCreators';
import { signMessage } from '../messages';

function* voteMotion({
  meta,
  payload: { userAddress, colonyAddress, motionId, vote },
}: Action<ActionTypes.MOTION_VOTE>) {
  const txChannel = yield call(getTxChannel, meta.id);
  try {
    const context = getContext(ContextModule.ColonyManager);
    const colonyManager = getContext(ContextModule.ColonyManager);
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    const votingReputationClient: ExtensionClient =
      yield colonyManager.getClient(
        ClientType.VotingReputationClient,
        colonyAddress,
      );

    const { domainId, rootHash } = yield votingReputationClient.getMotion(
      motionId,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      domainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      userAddress,
      rootHash,
    );

    /*
     * @NOTE We this to be all in one line (no new lines, or line breaks) since
     * Metamask doesn't play nice with them and will replace them, in the message
     * presented to the user with \n
     */
    const message = `Sign this message to generate 'salt' entropy. Extension Address: ${
      votingReputationClient.address
    } Motion ID: ${motionId.toNumber()}`;

    const signature = yield signMessage('motionRevealVote', message);
    const hash = soliditySha3(soliditySha3Raw(signature), vote);

    const { voteMotionTransaction } = yield createTransactionChannels(meta.id, [
      'voteMotionTransaction',
    ]);

    const batchKey = 'voteMotion';

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: meta.id,
          index,
        },
      });

    yield createGroupTransaction(voteMotionTransaction, {
      context: ClientType.VotingReputationClient,
      methodName: 'submitVote',
      identifier: colonyAddress,
      params: [motionId, hash, key, value, branchMask, siblings],
      ready: false,
    });

    yield takeFrom(
      voteMotionTransaction.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield put(transactionReady(voteMotionTransaction.id));

    yield takeFrom(
      voteMotionTransaction.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    /*
     * Update motion page values
     */
    yield fork(updateMotionValues, colonyAddress, userAddress, motionId);

    yield put<AllActions>({
      type: ActionTypes.MOTION_VOTE_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.MOTION_VOTE_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* voteMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_VOTE, voteMotion);
}
