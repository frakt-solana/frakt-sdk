import { Program, AnchorProvider, web3, BN, utils } from '@project-serum/anchor';

import { IDL, NftLendingV2 } from './idl/nft_lending_v2';
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
} from './types';
import { createFakeWallet } from '../common';
import {
  AUTHORIZATION_RULES_PROGRAM,
  EDITION_PREFIX,
  METADATA_PREFIX,
  METADATA_PROGRAM_PUBKEY,
  TOKEN_RECORD,
} from './constants';

type ReturnAnchorProgram = (programId: web3.PublicKey, connection: web3.Connection) => Program<NftLendingV2>;
export const returnAnchorProgram: ReturnAnchorProgram = (programId, connection) =>
  new Program<NftLendingV2>(
    IDL as any,
    programId,
    new AnchorProvider(connection, createFakeWallet(), AnchorProvider.defaultOptions()),
  );

//   type ReturnAnchorProgram = (programId: web3.PublicKey, connection: web3.Connection) => Program<Bonds>;
// export const returnAnchorProgram: ReturnAnchorProgram = (programId, connection) =>
//   new Program<Bonds>(
//     IDL as any,
//     programId,
//     new AnchorProvider(connection, createFakeWallet(), AnchorProvider.defaultOptions()),
//   );

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
  lastTime: decodedStake.lastTime.toNumber(),
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
  fixedRate: decodedFixedRate(decodedReward.fixedRate),
});

type DecodedFixedRate = (decodedFixedRate: any) => FixedRateView;
const decodedFixedRate: DecodedFixedRate = (decodedFixedRate) => ({
  beginScheduleTs: decodedFixedRate.beginScheduleTs.toNumber(),
  beginStakingTs: decodedFixedRate.beginStakingTs.toNumber(),
  lastUpdatedTs: decodedFixedRate.lastUpdatedTs.toNumber(),
  promisedDuration: decodedFixedRate.promisedDuration.toNumber(),
  promisedSchedule: decodedPromisedSchedule(decodedFixedRate.promisedSchedule),
});

type DecodedPromisedSchedule = (decodedPromisedSchedule: any) => PromisedSchedule;
const decodedPromisedSchedule: DecodedPromisedSchedule = (decodedSchedule) => ({
  baseRate: decodedSchedule.baseRate?.toNumber(),
  tier1: decodedSchedule.tier1?.toNumber(),
  tier2: decodedSchedule.tier2?.toNumber(),
  tier3: decodedSchedule.tier3?.toNumber(),
  denominator: decodedSchedule.denominator?.toNumber(),
});

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
  items: { v: number; w: number; loanValue: number; nftMint: string; interest: number }[],
  capacity: number,
): { maxValue: number; subset: { v: number; w: number; loanValue: number; nftMint: string; interest: number }[] } => {
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

/*
  Returns most optimal loans by lowest interest using Knapsack Algorithm.
*/
export const getMostOptimalLoansClosestToNeededSolInBulk = ({
  neededSol,
  possibleLoans,
}: {
  possibleLoans: { nftMint: string; loanValue: number; interest: number }[];
  neededSol: number;
}) => {
  const divider = 1e7;

  const preparedItems = possibleLoans.map((loan) => ({
    ...loan,
    v: Math.ceil((loan.loanValue - loan.interest) / divider),
    w: Math.ceil(loan.loanValue / divider),
  }));

  const preparedNeededSol = Math.ceil(neededSol / divider);
  const { maxValue, subset } = knapsackAlgorithm(preparedItems, preparedNeededSol);

  const result = subset.map((item) => ({ nftMint: item.nftMint, loanValue: item.loanValue, interest: item.interest }));
  return result;
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

export const createAndSendV0Tx = async (
  connection: web3.Connection,
  txInstructions: web3.TransactionInstruction[],
  signer: web3.Signer,
  additionalSigners: web3.Signer[],
  lookupTablePubkey: web3.PublicKey,
  skipPreflight?: boolean,
) => {
  let latestBlockhash = await connection.getLatestBlockhash('finalized');
  const lookupTable = (await connection.getAddressLookupTable(lookupTablePubkey)).value;
  if (!lookupTable) return;
  const messageV0 = new web3.TransactionMessage({
    payerKey: signer.publicKey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions: txInstructions,
  }).compileToV0Message([lookupTable]);
  const transaction = new web3.VersionedTransaction(messageV0);

  transaction.sign([signer, ...additionalSigners]);
  const txid = await connection.sendTransaction(transaction, {
    maxRetries: 5,
    skipPreflight: skipPreflight ? true : false,
  });

  const confirmation = await connection.confirmTransaction({
    signature: txid,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  });
  console.log(`txid ${txid}`);
  if (confirmation.value.err) {
    throw new Error('   ❌ - Transaction not confirmed.');
  }
};

type FindTokenRecordPda = (mintPubkey: web3.PublicKey, token: web3.PublicKey) => web3.PublicKey;
export const findTokenRecordPda: FindTokenRecordPda = (mintPubkey, token) => {
  return web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(METADATA_PREFIX),
      METADATA_PROGRAM_PUBKEY.toBuffer(),
      mintPubkey.toBuffer(),
      Buffer.from(TOKEN_RECORD),
      token.toBuffer(),
    ],
    METADATA_PROGRAM_PUBKEY,
  )[0];
};

type GetMetaplexMetadata = (mintPubkey: web3.PublicKey) => web3.PublicKey;
export const getMetaplexMetadata: GetMetaplexMetadata = (mintPubkey) => {
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from(METADATA_PREFIX), METADATA_PROGRAM_PUBKEY.toBuffer(), mintPubkey.toBuffer()],
    METADATA_PROGRAM_PUBKEY,
  )[0];
};

export const findRuleSetPDA = async (payer: web3.PublicKey, name: string) => {
  return (
    await web3.PublicKey.findProgramAddress(
      [Buffer.from('rule_set'), payer.toBuffer(), Buffer.from(name)],
      AUTHORIZATION_RULES_PROGRAM,
    )
  )[0];
};
