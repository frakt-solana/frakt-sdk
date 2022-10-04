import { Program, AnchorProvider, web3, BN, utils } from '@project-serum/anchor';

import idl from './idl/nft_lending_v2.json';
import {
  CollectionInfoView,
  DepositView,
  LoanView,
  TimeBasedLiquidityPoolView,
  PriceBasedLiquidityPoolView,
  LotTicketView,
  FarmerView,
  LendingStakeView,
  GemFarmRewardView,
  FixedRateView,
  PromisedSchedule,
  BulkNftRaw,
  BulkNft
} from './types';
import { createFakeWallet } from '../common';
import { EDITION_PREFIX, METADATA_PREFIX, METADATA_PROGRAM_PUBKEY } from './constants';
import { loans } from '..';

type ReturnAnchorProgram = (programId: web3.PublicKey, connection: web3.Connection) => Program;
export const returnAnchorProgram: ReturnAnchorProgram = (programId, connection) =>
  new Program(
    idl as any,
    programId,
    new AnchorProvider(connection, createFakeWallet(), AnchorProvider.defaultOptions()),
  );

type DecodedCollectionInfo = (decodedCollection: any, address: web3.PublicKey) => CollectionInfoView;
export const decodedCollectionInfo: DecodedCollectionInfo = (decodedCollection, address) => ({
  collectionInfoPubkey: address.toBase58(),
  creator: decodedCollection.creator.toBase58(),
  liquidityPool: decodedCollection.liquidityPool.toBase58(),
  pricingLookupAddress: decodedCollection.pricingLookupAddress.toBase58(),
  royaltyAddress: decodedCollection.royaltyAddress.toBase58(),
  royaltyFeeTime: decodedCollection.royaltyFeeTime.toNumber(),
  royaltyFeePrice: decodedCollection.royaltyFeePrice.toNumber(),
  loanToValue: decodedCollection.loanToValue.toNumber(),
  collaterizationRate: decodedCollection.collaterizationRate.toNumber(),
  availableLoanTypes: Object.keys(decodedCollection.availableLoanTypes)[0],
  expirationTime: decodedCollection.expirationTime.toNumber(),
});

type DecodedLendingStake = (decodedLendingStake: any, address: web3.PublicKey) => LendingStakeView;
export const decodedLendingStake: DecodedLendingStake = (decodedStake, address) => ({
    lendingStakePubkey: address.toBase58(),
    stakeType: Object.keys(decodedStake.stakeType)[0],
    loan: decodedStake.loan.toBase58(),
    stakeContract: decodedStake.stakeContract.toBase58(),
    stakeConstractOptional: decodedStake.stakeConstractOptional?.toBase58(),
    stakeState: Object.keys(decodedStake.stakeState)[0],
    identity: decodedStake.identity.toBase58(),
    dataA: decodedStake.dataA.toBase58(),
    dataB: decodedStake.dataB.toBase58(),
    dataC: decodedStake.dataC.toBase58(),
    dataD: decodedStake.dataD.toBase58(),
    totalHarvested: decodedStake.totalHarvested.toNumber(),
    totalHarvestedOptional: decodedStake.totalHarvestedOptional.toNumber(),
    lastTime: decodedStake.lastTime.toNumber()
});

type DecodedFarmer = (decodedFarmer: any, address: web3.PublicKey) => FarmerView;
export const decodedFarmer: DecodedFarmer = (decodedFarmer, address) => ({
  farmerPubkey: address.toBase58(),
  farm: decodedFarmer.farm.toBase58(),
  identity: decodedFarmer.identity.toBase58(),
  vault: decodedFarmer.vault.toBase58(),
  state: Object.keys(decodedFarmer.state)[0],
  gemsStaked: decodedFarmer.gemsStaked.toNumber(),
  minStakingEndsTs: decodedFarmer.minStakingEndsTs.toNumber(),
  cooldownEndsTs: decodedFarmer.cooldownEndsTs.toNumber(),
  rewardA: decodedReward(decodedFarmer.rewardA),
  rewardB: decodedReward(decodedFarmer.rewardB),
});

type DecodedGemFarmReward = (decodedFarmer: any) => GemFarmRewardView;
const decodedReward: DecodedGemFarmReward = (decodedReward) => ({
  paidOutReward: decodedReward.paidOutReward.toNumber(),
  accruedReward: decodedReward.accruedReward.toNumber(),
  variableRate: decodedReward.lastRecordedAccruedRewardPerRarityPoint?.n?.toNumber(),
  fixedRate: decodedFixedRate(decodedReward.fixedRate)
});

type DecodedFixedRate = (decodedFixedRate: any) => FixedRateView;
const decodedFixedRate: DecodedFixedRate = (decodedFixedRate) => ({
  beginScheduleTs: decodedFixedRate.beginScheduleTs.toNumber(),
  beginStakingTs: decodedFixedRate.beginStakingTs.toNumber(),
  lastUpdatedTs: decodedFixedRate.lastUpdatedTs.toNumber(),
  promisedDuration: decodedFixedRate.promisedDuration.toNumber(),
  promisedSchedule: decodedPromisedSchedule(decodedFixedRate.promisedSchedule)
})

type DecodedPromisedSchedule = (decodedPromisedSchedule: any) => PromisedSchedule;
const decodedPromisedSchedule: DecodedPromisedSchedule = (decodedSchedule) => ({
  baseRate: decodedSchedule.baseRate?.toNumber(),
  tier1: decodedSchedule.tier1?.toNumber(),
  tier2: decodedSchedule.tier2?.toNumber(),
  tier3: decodedSchedule.tier3?.toNumber(),
  denominator: decodedSchedule.denominator?.toNumber()
})

type DecodedTimeBasedLiquidityPool = (decodedLiquidityPool: any, address: web3.PublicKey) => TimeBasedLiquidityPoolView;
export const decodedTimeBasedLiquidityPool: DecodedTimeBasedLiquidityPool = (decodedLiquidityPool, address) => ({
  liquidityPoolPubkey: address.toBase58(),
  id: decodedLiquidityPool.id.toNumber(),
  rewardInterestRateTime: decodedLiquidityPool.rewardInterestRateTime.toNumber(),
  feeInterestRateTime: decodedLiquidityPool.feeInterestRateTime.toNumber(),
  rewardInterestRatePrice: decodedLiquidityPool.rewardInterestRatePrice.toNumber(),
  feeInterestRatePrice: decodedLiquidityPool.feeInterestRatePrice.toNumber(),
  liquidityAmount: decodedLiquidityPool.liquidityAmount.toNumber(),
  liqOwner: decodedLiquidityPool.liqOwner.toBase58(),
  amountOfStaked: decodedLiquidityPool.amountOfStaked.toNumber(),
  userRewardsAmount: decodedLiquidityPool.userRewardsAmount.toNumber(),
  apr: decodedLiquidityPool.apr.toNumber(),
  cumulative: decodedLiquidityPool.cumulative.toNumber(),
  lastTime: decodedLiquidityPool.lastTime.toNumber(),
  oldCumulative: decodedLiquidityPool.oldCumulative.toNumber(),
  period: decodedLiquidityPool.period.toNumber(),
});

type DecodedPriceBasedLiquidityPool = (
  decodedLiquidityPool: any,
  address: web3.PublicKey,
) => PriceBasedLiquidityPoolView;
export const decodedPriceBasedLiquidityPool: DecodedPriceBasedLiquidityPool = (decodedLiquidityPool, address) => ({
  liquidityPoolPubkey: address.toBase58(),
  id: decodedLiquidityPool.id.toNumber(),
  baseBorrowRate: decodedLiquidityPool.baseBorrowRate,
  variableSlope1: decodedLiquidityPool.variableSlope1,
  variableSlope2: decodedLiquidityPool.variableSlope2,
  utilizationRateOptimal: decodedLiquidityPool.utilizationRateOptimal,
  reserveFactor: decodedLiquidityPool.reserveFactor,
  reserveAmount: decodedLiquidityPool.reserveAmount.toString(),
  liquidityAmount: decodedLiquidityPool.liquidityAmount.toNumber(),
  liqOwner: decodedLiquidityPool.liqOwner.toBase58(),
  amountOfStaked: decodedLiquidityPool.amountOfStaked.toNumber(),
  depositApr: decodedLiquidityPool.depositApr.toNumber(),
  depositCumulative: decodedLiquidityPool.depositCumulative.toNumber(),
  borrowApr: decodedLiquidityPool.borrowApr.toNumber(),
  borrowCumulative: decodedLiquidityPool.borrowCumulative.toNumber(),
  lastTime: decodedLiquidityPool.lastTime.toNumber(),
  depositCommission: decodedLiquidityPool.depositCommission,
  borrowCommission: decodedLiquidityPool.borrowCommission,
});

type decodedDeposit = (decodedDeposit: any, address: web3.PublicKey) => DepositView;
export const decodedDeposit: decodedDeposit = (decodedDeposit, address) => ({
  depositPubkey: address.toBase58(),
  liquidityPool: decodedDeposit.liquidityPool.toBase58(),
  user: decodedDeposit.user.toBase58(),
  amount: decodedDeposit.amount.toNumber(),
  stakedAt: decodedDeposit.stakedAt.toNumber(),
  stakedAtCumulative: decodedDeposit.stakedAtCumulative.toNumber(),
});

type DecodedLoan = (decodedLoan: any, address: web3.PublicKey) => LoanView;
export const decodedLoan: DecodedLoan = (decodedLoan, address) => ({
  loanPubkey: address.toBase58(),
  user: decodedLoan.user.toBase58(),
  nftMint: decodedLoan.nftMint.toBase58(),
  nftUserTokenAccount: decodedLoan.nftUserTokenAccount.toBase58(),
  liquidityPool: decodedLoan.liquidityPool.toBase58(),
  collectionInfo: decodedLoan.collectionInfo.toBase58(),
  startedAt: decodedLoan.startedAt.toNumber(),
  expiredAt: new BN(decodedLoan.expiredAt || 0).toNumber(),
  finishedAt: decodedLoan.finishedAt.toNumber(),
  originalPrice: decodedLoan.originalPrice.toNumber(),
  amountToGet: decodedLoan.amountToGet.toNumber(),
  rewardAmount: decodedLoan.rewardAmount.toNumber(),
  feeAmount: decodedLoan.feeAmount.toNumber(),
  royaltyAmount: decodedLoan.royaltyAmount.toNumber(),
  borrowedAtCumulative: new BN(decodedLoan.rewardInterestRate || 0).toNumber(),
  alreadyPaidBack: new BN(decodedLoan.feeInterestRate || 0).toNumber(),
  loanStatus: Object.keys(decodedLoan.loanStatus)[0],
  loanType: Object.keys(decodedLoan.loanType)[0],
});

type DecodeLoan = (buffer: Buffer, connection: web3.Connection, programId: web3.PublicKey) => any;
export const decodeLoan: DecodeLoan = (buffer, connection, programId) => {
  const program = returnAnchorProgram(programId, connection);
  return program.coder.accounts.decode('Loan', buffer);
};

type DecodeLotTicket = (
  buffer: Buffer,
  lotTicketPubkey: web3.PublicKey,
  connection: web3.Connection,
  programId: web3.PublicKey,
) => LotTicketView;
export const decodeLotTicket: DecodeLotTicket = (buffer, lotTicketPubkey, connection, programId) => {
  const program = returnAnchorProgram(programId, connection);
  const rawAccount = program.coder.accounts.decode('LotTicket', buffer);
  return anchorRawBNsAndPubkeysToNumsAndStrings({ account: rawAccount, publicKey: lotTicketPubkey });
};

type GetMetaplexEditionPda = (mintPubkey: web3.PublicKey) => web3.PublicKey;
export const getMetaplexEditionPda: GetMetaplexEditionPda = (mintPubkey) => {
  const editionPda = utils.publicKey.findProgramAddressSync(
    [
      Buffer.from(METADATA_PREFIX),
      METADATA_PROGRAM_PUBKEY.toBuffer(),
      new web3.PublicKey(mintPubkey).toBuffer(),
      Buffer.from(EDITION_PREFIX),
    ],
    METADATA_PROGRAM_PUBKEY,
  );
  return editionPda[0];
};

export const anchorRawBNsAndPubkeysToNumsAndStrings = (rawAccount: any) => {
  const copyRawAccount = { ...rawAccount };
  for (let key in copyRawAccount.account) {
    if (copyRawAccount.account[key] === null) continue;
    if (copyRawAccount.account[key].toNumber) {
      copyRawAccount.account[key] = copyRawAccount.account[key].toNumber();
    }

    if (copyRawAccount.account[key].toBase58) {
      copyRawAccount.account[key] = copyRawAccount.account[key].toBase58();
    }
    if (typeof copyRawAccount.account[key] === 'object') {
      copyRawAccount.account[key] = Object.keys(copyRawAccount.account[key])[0];
    }
  }
  return { ...copyRawAccount.account, publicKey: copyRawAccount.publicKey.toBase58() };
};

const knapsackAlgorithm = (
  items: { v: number; w: number; nftMint: string; }[],
  capacity: number,
): { maxValue: number; subset: { v: number; w: number; nftMint: string; }[] } => {
  const getLast = (memo) => {
    let lastRow = memo[memo.length - 1];
    return lastRow[lastRow.length - 1];
  };
  const getSolution = (row, cap, memo) => {
    const NO_SOLUTION = { maxValue: 0, subset: [] };
    // the column number starts from zero.
    let col = cap - 1;
    let lastItem = items[row];
    // The remaining capacity for the sub-problem to solve.
    let remaining = cap - lastItem.w;

    // Refer to the last solution for this capacity,
    // which is in the cell of the previous row with the same column
    let lastSolution = row > 0 ? memo[row - 1][col] || NO_SOLUTION : NO_SOLUTION;
    // Refer to the last solution for the remaining capacity,
    // which is in the cell of the previous row with the corresponding column
    let lastSubSolution = row > 0 ? memo[row - 1][remaining - 1] || NO_SOLUTION : NO_SOLUTION;

    // If any one of the items weights greater than the 'cap', return the last solution
    if (remaining < 0) {
      return lastSolution;
    }

    // Compare the current best solution for the sub-problem with a specific capacity
    // to a new solution trial with the lastItem(new item) added
    let lastValue = lastSolution.maxValue;
    let lastSubValue = lastSubSolution.maxValue;

    let newValue = lastSubValue + lastItem.v;
    if (newValue >= lastValue) {
      // copy the subset of the last sub-problem solution
      let _lastSubSet = lastSubSolution.subset.slice();
      _lastSubSet.push(lastItem);
      return { maxValue: newValue, subset: _lastSubSet };
    } else {
      return lastSolution;
    }
  };
  // This implementation uses dynamic programming.
  // Variable 'memo' is a grid(2-dimentional array) to store optimal solution for sub-problems,
  // which will be later used as the code execution goes on.
  // This is called memoization in programming.
  // The cell will store best solution objects for different capacities and selectable items.
  let memo: any[] = [];

  // Filling the sub-problem solutions grid.
  for (let i = 0; i < items.length; i++) {
    // Variable 'cap' is the capacity for sub-problems. In this example, 'cap' ranges from 1 to 6.
    let row: any[] = [];
    for (let cap = 1; cap <= capacity; cap++) {
      row.push(getSolution(i, cap, memo));
    }
    memo.push(row);
  }

  // The right-bottom-corner cell of the grid contains the final solution for the whole problem.
  return getLast(memo);
};


export const getBulkLoans = ({
  neededSol,
  possibleLoans,
}: {
  possibleLoans: BulkNftRaw[];
  neededSol: number;
}) => {
  const divider = 10 ** (neededSol.toString().length - 2);

  const bestPreparedItems = possibleLoans.map((loan) => ({
    nftMint: loan.nftMint,
    v: Math.ceil(loan.maxLoanValue / divider),
    w: Math.ceil(loan.maxLoanValue / divider),
  }));

  const maxSum = bestPreparedItems.reduce((acc, loan) => acc + loan.v, 0);
  
  const preparedNeededSol = Math.ceil(neededSol / divider);
  if (maxSum < preparedNeededSol) {
    const res = bestPreparedItems.map((item) => ({nftMint: item.nftMint, loanValue: item.v}));
    return {best: res, cheapest: res, safest:res};
  }
  const freeAmount = preparedNeededSol - maxSum;

  const { subset: bestSubset } = knapsackAlgorithm(bestPreparedItems, freeAmount);

  const toDropBestResult = bestSubset.map((item) => ({ nftMint: item.nftMint, loanValue: item.w }));
  
  const best = bestPreparedItems.filter( ( el ) => !toDropBestResult.includes({nftMint: el.nftMint, loanValue: el.w}));

  const cheapestPreparedItems = possibleLoans.map((loan) => ({
    nftMint: loan.nftMint,
    v: Math.ceil(loan.maxLoanValue / divider) * loan.interest,
    w: Math.ceil(loan.maxLoanValue / divider),
  }));

  const { subset: cheapestSubset } = knapsackAlgorithm(cheapestPreparedItems, freeAmount);

  const toDropCheapestResult = cheapestSubset.map((item) => ({ nftMint: item.nftMint, loanValue: item.w }));
  const cheapest= cheapestPreparedItems.filter( ( el ) => !toDropCheapestResult.includes({nftMint: el.nftMint, loanValue: el.w}));
  
  const sortedElementsByInterest = possibleLoans.sort((a, b) => {
    if (a.interest !== b.interest) {
      return a.interest - b.interest;
    } else if (a.maxLoanValue !== b.maxLoanValue) {
      return a.maxLoanValue - b.maxLoanValue;
    }

    return a.amountOfDays - b.amountOfDays;
  });

  const priceBased = sortedElementsByInterest.filter((element) => element.maxLoanValue !== element.minLoanValue);
  const timeBased = sortedElementsByInterest.filter((element) => element.maxLoanValue === element.minLoanValue);

  const concated = priceBased.concat(timeBased);
  let sum = 0;
  let i = 0;
  
  const safest: BulkNft[] = [];

  while (sum < neededSol && i < concated.length) {
    safest.push({
      nftMint: concated[i].nftMint,
      loanValue: concated[i].minLoanValue,
      interest: concated[i].interest,
      amountOfDays: concated[i].amountOfDays
    });
    sum += concated[i].minLoanValue;
    i += 1;
  }

  i = 0;

  while (sum < neededSol) {
    sum += (concated[i].maxLoanValue - safest[i].loanValue);
    safest[i].loanValue = concated[i].maxLoanValue;
    i += 1;
  }


  return {best, cheapest, safest};
};

export function objectBNsAndPubkeysToNums(obj: any) {
  const copyobj = { ...obj };

  for (const key in copyobj.account) {
    if (copyobj.account[key] === null) continue;

    if (copyobj.account[key].toNumber) {
      copyobj.account[key] = copyobj.account[key].toNumber();
    }

    if (copyobj.account[key].toBase58) {
      copyobj.account[key] = copyobj.account[key].toBase58();
    }

    if (typeof copyobj.account[key] === 'object') {
      copyobj.account[key] = Object.keys(copyobj.account[key])[0];
    }
  }

  return { ...copyobj.account, publicKey: copyobj.publicKey.toBase58() };
}

export const getSuggestedLoans = (items: BulkNftRaw[], minValue: number) => {
  let sum = 0;
  let i = 0;
  const best: BulkNft[] = [];
  const cheapest: BulkNft[] = [];
  const safest: BulkNft[] = [];

  const sortedElementsByValue = items.sort((a, b) => {
    if (a.maxLoanValue !== b.maxLoanValue) {
      return a.maxLoanValue - b.maxLoanValue;
    }

    return a.interest - b.interest;
  });
  const sortedElementsByInterest = items.sort((a, b) => {
    if (a.interest !== b.interest) {
      return a.interest - b.interest;
    } else if (a.maxLoanValue !== b.maxLoanValue) {
      return a.maxLoanValue - b.maxLoanValue;
    }

    return a.amountOfDays - b.amountOfDays;
  });
  const priceBased = sortedElementsByInterest.filter((element) => element.maxLoanValue !== element.minLoanValue);
  const timeBased = sortedElementsByInterest.filter((element) => element.maxLoanValue === element.minLoanValue);

  const concated = priceBased.concat(timeBased);

  while (sum < minValue && i < sortedElementsByValue.length) {
    best.push({
      nftMint: sortedElementsByValue[i].nftMint,
      loanValue: sortedElementsByValue[i].maxLoanValue,
      interest: sortedElementsByValue[i].interest,
      amountOfDays: sortedElementsByValue[i].amountOfDays
    });
    sum += sortedElementsByValue[i].maxLoanValue;
    i += 1;
  }

  if (sum < minValue) {
    return {
      best: best,
      safest: best,
      cheapest: best,
    };
  }

  sum = 0;
  i = 0;

  while (sum < minValue && i < concated.length) {
    cheapest.push({
      nftMint: concated[i].nftMint,
      loanValue: concated[i].maxLoanValue,
      interest: concated[i].interest,
      amountOfDays: concated[i].amountOfDays
    });
    sum += concated[i].maxLoanValue;
    i += 1;
  }

  sum = 0;
  i = 0;

  while (sum < minValue && i < concated.length) {
    safest.push({
      nftMint: concated[i].nftMint,
      loanValue: concated[i].minLoanValue,
      interest: concated[i].interest,
      amountOfDays: concated[i].amountOfDays
    });
    sum += concated[i].minLoanValue;
    i += 1;
  }

  i = 0;

  while (sum < minValue) {
    sum += (concated[i].maxLoanValue - safest[i].loanValue);
    safest[i].loanValue = concated[i].maxLoanValue;
    i += 1;
  }

  return {
    best,
    safest,
    cheapest,
  }
};