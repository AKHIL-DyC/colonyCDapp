import { GetMotionTimeoutPeriodsReturn } from '~gql';
import { MotionState } from '~utils/colonyMotions';

export const splitTimeLeft = (period: number) => ({
  days: Math.floor(period / (60 * 60 * 24)),
  hours: Math.floor((period / (60 * 60)) % 24),
  minutes: Math.floor((period / 60) % 60),
  seconds: Math.floor(period % 60),
});

export const getCurrentStatePeriodInMs = (
  motionState: MotionState,
  motionTimeoutPeriods: GetMotionTimeoutPeriodsReturn,
) => {
  switch (motionState) {
    case MotionState.Staking:
    case MotionState.Staked:
    case MotionState.Objection:
      return motionTimeoutPeriods.timeLeftToStake;
    case MotionState.Voting:
      return motionTimeoutPeriods.timeLeftToVote;
    case MotionState.Reveal:
      return motionTimeoutPeriods.timeLeftToReveal;
    case MotionState.Escalation:
      return motionTimeoutPeriods.timeLeftToEscalate;
    default:
      return '-1';
  }
};
