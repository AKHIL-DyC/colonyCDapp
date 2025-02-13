import { ClientType } from '@colony/colony-js';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux';

import {
  createTransaction,
  getTxChannel,
  waitForTxResult,
} from '../transactions';
import { initiateTransaction, putError } from '../utils';

function* lockExpenditure({
  payload: { colonyAddress, nativeExpenditureId },
  meta,
}: Action<ActionTypes.EXPENDITURE_LOCK>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'lockExpenditure',
      identifier: colonyAddress,
      params: [nativeExpenditureId],
    });

    yield initiateTransaction({ id: meta.id });

    const { type } = yield waitForTxResult(txChannel);

    if (type === ActionTypes.TRANSACTION_SUCCEEDED) {
      yield put<AllActions>({
        type: ActionTypes.EXPENDITURE_LOCK_SUCCESS,
        payload: {},
        meta,
      });
    }
  } catch (error) {
    return yield putError(ActionTypes.EXPENDITURE_LOCK_ERROR, error, meta);
  }

  txChannel.close();

  return null;
}

export default function* lockExpenditureSaga() {
  yield takeEvery(ActionTypes.EXPENDITURE_LOCK, lockExpenditure);
}
