
export const TIME_BASED_LOAN_TYPE = 'timeBased';
export const PRICE_BASED_LOAN_TYPE = 'priceBased';

export interface CollectionInfoView {
  collectionInfoPubkey: string;
  creator: string;
  liquidityPool: string;
  pricingLookupAddress: string;
  royaltyAddress: string;
  royaltyFeeTime: number;
  royaltyFeePrice: number;
  loanToValue: number;
  collaterizationRate: number;
  availableLoanTypes: string;
  expirationTime: number;
}


export interface StakeEntryView {
  bump: number,
  kind: number,
  pool: string,
  amount: number,
  stakeMint: string,
  lastStaker: string,
  lastStakedAt: number,
  lastUpdatedAt: number,
  totalStakeSeconds: number,
  usedStakeSeconds: number,
  cooldownStartSeconds?: number
}


export interface RewardEntryView {
  bump: number,
  stakeEntry: string,
  rewardDistributor: string,
  rewardSecondsReceived: number,
  multiplier: number
}


export interface RewardDistributorView {
  bump: number,
  stakePool: string,
  kind: number,
  authority: string,
  identifier: number,
  rewardMint: string,
  rewardAmount: number,
  rewardDurationSeconds: number,
  rewardsIssued: string,
  defaultMultiplier: number,
  multiplierDecimals: number,
  claimRewardsPaymentInfo: string,
  maxRewardSecondsReceived?: number
}

export interface StakePoolView {
  bump: number,
  authority: string,
  totalStaked: number,
  resetOnUnstake: boolean,
  cooldownSeconds?: number,
  minStakeSeconds?: number,
  endDate?: number,
  stakePaymentInfo: string,
  unstakePaymentInfo: string,
  requiresAuthorization: boolean,
  identifier: string
}

export interface LendingStakeView {
  lendingStakePubkey: string;
  stakeType: string;
  loan: string;
  stakeContract: string;
  stakeConstractOptional: string;
  stakeState: string;
  identity: string;
  dataA: string;
  dataB: string;
  dataC: string;
  dataD: string;
  totalHarvested: number;
  totalHarvestedOptional: number;
  lastTime: number
}

export interface FarmerView {
  farmerPubkey: string;
  farm: string;
  identity: string;
  vault: string;
  state: string;
  gemsStaked: number;
  minStakingEndsTs: number;
  cooldownEndsTs: number;
  rewardA: GemFarmRewardView;
  rewardB: GemFarmRewardView;
}

export interface GemFarmRewardView {
  paidOutReward: number;
  accruedReward: number;
  variableRate: number;
  fixedRate: FixedRateView;
}

export interface FixedRateView {
  beginStakingTs: number;
  beginScheduleTs: number;
  lastUpdatedTs: number;
  promisedSchedule: PromisedSchedule;
  promisedDuration: number;
}

export interface PromisedSchedule {
  baseRate: number;
  tier1: number;
  tier2: number;
  tier3: number;
  denominator: number;
}

export interface TimeBasedLiquidityPoolView {
  liquidityPoolPubkey: string;
  id: number;
  rewardInterestRateTime: number;
  feeInterestRateTime: number;
  rewardInterestRatePrice: number;
  feeInterestRatePrice: number;
  liquidityAmount: number;
  liqOwner: string;
  amountOfStaked: number;
  userRewardsAmount: number;
  apr: number;
  cumulative: number;
  lastTime: number;
  oldCumulative: number;
  period: number;
}

export interface PriceBasedLiquidityPoolView {
  liquidityPoolPubkey: string;
  id: number;
  baseBorrowRate: number;
  variableSlope1: number;
  variableSlope2: number;
  utilizationRateOptimal: number;
  reserveFactor: number;
  reserveAmount: number;
  liquidityAmount: number;
  liqOwner: string;
  amountOfStaked: number;
  depositApr: number;
  borrowApr: number;
  borrowCumulative: number;
  depositCumulative: number;
  lastTime: number;
  depositCommission: number;
  borrowCommission: number;
}

export interface DepositView {
  depositPubkey: string;
  liquidityPool: string;
  user: string;
  amount: number;
  stakedAt: number;
  stakedAtCumulative: number;
}

export interface LoanView {
  loanPubkey: string;
  user: string;
  nftMint: string;
  nftUserTokenAccount: string;
  liquidityPool: string;
  collectionInfo: string;

  startedAt: number;
  expiredAt: number;
  finishedAt: number;

  originalPrice: number;

  amountToGet: number; // If created, then min amount to receive
  // amountToReturn: number; // If created, then min amount to receive
  rewardAmount: number;
  feeAmount: number;
  royaltyAmount: number;

  borrowedAtCumulative: number;

  loanStatus: string; // If created, then min amount to receive
  loanType: string;
}

export interface BorrowNft {
  mint: string;
  name: string;
  imageUrl: string;
  valuation: string; // 2.508
  maxLoanValue: string; // 1.003
  timeBased: {
    returnPeriodDays: number; // 14
    ltvPercents: number; // 40
    fee: string; // 0.100
    feeDiscountPercents: string; // 2
    repayValue: string; // 1.101
    liquidityPoolPubkey: string;
    loanValue: string; // 1.020
  };
  priceBased?: {
    liquidityPoolPubkey: string;
    ltvPercents: number; // 40
    borrowAPRPercents: number; // 10
    collaterizationRate: number; // 10(%)
  };
}

export interface LiquidityPool {
  pubkey: string;
  isPriceBased: boolean;
  name: string;
  imageUrl: string[];

  totalLiquidity: number;
  totalBorrowed: number;

  utilizationRate: number;
  depositApr: number;
  borrowApr?: number;

  activeloansAmount: number;

  collectionsAmount: number;

  userDeposit?: {
    pubkey: string;
    harvestAmount: number;
    depositAmount: number;
    depositAmountLamports: string; //? Lamports
  };
  userActiveLoansAmount?: number;
}

export interface Loan {
  pubkey: string;
  mint: string;
  name: string;
  imageUrl: string;
  isPriceBased: boolean;

  loanValue: number; //? SOL
  repayValue: number; //? SOL
  repayValueLamports: string; //? Lamports

  startedAt: string; //? Date
  expiredAt?: string; //? Date

  liquidityPool: string;
  collectionInfo: string;
  royaltyAddress: string;

  liquidationPrice?: number; //? 1.23456 (SOL)
  valuation?: number; //? 1.23456 (SOL)
  health?: number; //? 80(%) 0-100%
}

export interface LiquidityPoolView {
  liquidityPoolPubkey: string;
  id: number;
  rewardInterestRateTime: number;
  feeInterestRateTime: number;
  rewardInterestRatePrice: number;
  feeInterestRatePrice: number;
  liquidityAmount: number;
  liqOwner: string;
  amountOfStaked: number;
  userRewardsAmount: number;
  apr: number;
  cumulative: number;
  lastTime: number;
  oldCumulative: number;
  period: number;
}

export interface LoanData {
  collectionsInfo: CollectionInfoView[];
  deposits: DepositView[];
  liquidityPool: LiquidityPoolView;
  loans: LoanView[];
}

export interface LotTicketView {
  liquidationLot: string;
  user: string;
  usedNftAttempts: string;
  ticketState: string;
  publicKey: string;
}

export interface NftAttemptView {
  nftMint: string;
  blockedUntil: number;
  attempts: number;
  cycleStartedAt: number;
  lastTriedAt: number;
  publicKey: string;
}

export interface LiquidationLotView {
  loan: string;
  nftMint: string;
  vaultNftTokenAccount: string;
  lotNoFeesPrice: number;
  winningChanceInBasePoints: number;
  startedAt: number;
  endingAt: number;
  lotState: string;
  ticketsCount: number;
  gracePeriod: number;
  graceFee: number;
  publicKey: string;
}
