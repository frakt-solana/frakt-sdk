import  { StakeEntryView, RewardDistributorView, RewardEntryView } from '../../types';
import {BN} from "@project-serum/anchor";

type CalculationRewardCardinal = (params: {
    stakeEntry: StakeEntryView, 
    rewardDistributor: RewardDistributorView,
    rewardEntry: RewardEntryView,
    currentSeconds: number
}) => number;

export const calculationRewardCardinal: CalculationRewardCardinal = ({
  stakeEntry,
  rewardDistributor,
  rewardEntry,
  currentSeconds
}) => {  
  if (
    !stakeEntry ||
    stakeEntry.pool.toString() !==
      rewardDistributor.stakePool.toString()
  ) {
    return 0;
  }

  // const rewardSecondsReceived =
  //   rewardEntry.rewardSecondsReceived || new BN(0);
  const multiplier =
    rewardEntry?.multiplier ||
    rewardDistributor.defaultMultiplier;
  const UTCNow = stakeEntry.cooldownStartSeconds
    ? new BN(stakeEntry.cooldownStartSeconds)
    : new BN(currentSeconds);

  let rewardSeconds = UTCNow
    .sub(new BN(stakeEntry.lastUpdatedAt))
    .mul(new BN(stakeEntry.amount))
    .add(new BN(stakeEntry.totalStakeSeconds));

  if (rewardDistributor.maxRewardSecondsReceived) {
    rewardSeconds = BN.min(
      rewardSeconds,
      new BN(rewardDistributor.maxRewardSecondsReceived)
    );
  }

  const rewardAmountToReceive = rewardSeconds
    // .sub(new BN(rewardSecondsReceived))
    .div(new BN(rewardDistributor.rewardDurationSeconds))
    .mul(new BN(rewardDistributor.rewardAmount))
    .mul(new BN(multiplier))
    .div(new BN(10).pow(new BN(rewardDistributor.multiplierDecimals))).toNumber();

  const nextRewardsIn = new BN(
    rewardDistributor.rewardDurationSeconds
  ).sub(
    UTCNow
      .sub(new BN(stakeEntry.lastStakedAt))
      .add(new BN(stakeEntry.totalStakeSeconds))
      .mod(new BN(rewardDistributor.rewardDurationSeconds))
  );

  return rewardAmountToReceive;
};
