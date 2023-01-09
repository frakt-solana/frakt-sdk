import  { StakeEntryView, RewardDistributorView, RewardEntryView } from '../../types';

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
  if (stakeEntry.amount !== 1) {
    return 0;
  }

  let rewardSeconds = (currentSeconds - stakeEntry.lastUpdatedAt) * stakeEntry.amount + stakeEntry.totalStakeSeconds

  let rewardAmountToReceive = Math.floor(rewardSeconds * rewardDistributor.rewardAmount * (rewardEntry.multiplier) / (10 ** rewardDistributor.multiplierDecimals))
  return rewardAmountToReceive;
};