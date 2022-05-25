import { PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { NftLendingV2, IDL } from './idl/types/nft_lending_v2';

export function returnAnchorProgram(programId: PublicKey, provider: anchor.Provider): anchor.Program<NftLendingV2> {
  // let idl = require('./multi_reward_staking.json');
  const anchorProgram = new anchor.Program<NftLendingV2>(IDL as any, programId, provider);
  return anchorProgram;
}

export interface AllAccounts {
  collectionInfos: CollectionInfoView[];
  deposits: DepositView[];
  liquidityPools: LiquidityPoolView[];
  loans: LoanView[];
}

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

export function decodedCollectionInfo(decodedCollection: any, address: PublicKey): CollectionInfoView {
  return {
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
  };
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

export function decodedLiquidityPool(decodedLiquidityPool: any, address: PublicKey): LiquidityPoolView {
  return {
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
  };
}

export interface DepositView {
  depositPubkey: string;
  liquidityPool: string;
  user: string;
  amount: number;
  stakedAt: number;
  stakedAtCumulative: number;
}

export function decodedDeposit(decodedDeposit: any, address: PublicKey): DepositView {
  return {
    depositPubkey: address.toBase58(),
    liquidityPool: decodedDeposit.liquidityPool.toBase58(),
    user: decodedDeposit.user.toBase58(),
    amount: decodedDeposit.amount.toNumber(),
    stakedAt: decodedDeposit.stakedAt.toNumber(),
    stakedAtCumulative: decodedDeposit.stakedAtCumulative.toNumber(),
  };
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

  rewardInterestRate: number;
  feeInterestRate: number;
  royaltyInterestRate: number;

  loanStatus: string; // If created, then min amount to receive
  loanType: string;
}

export function decodedLoan(decodedLoan: any, address: PublicKey): LoanView {
  return {
    loanPubkey: address.toBase58(),
    user: decodedLoan.user.toBase58(),
    nftMint: decodedLoan.nftMint.toBase58(),
    nftUserTokenAccount: decodedLoan.nftUserTokenAccount.toBase58(),
    liquidityPool: decodedLoan.liquidityPool.toBase58(),
    collectionInfo: decodedLoan.collectionInfo.toBase58(),
    startedAt: decodedLoan.startedAt.toNumber(),
    expiredAt: new anchor.BN(decodedLoan.expiredAt || 0).toNumber(),
    finishedAt: decodedLoan.finishedAt.toNumber(),
    originalPrice: decodedLoan.originalPrice.toNumber(),
    amountToGet: decodedLoan.amountToGet.toNumber(),
    // amountToReturn: decodedLoan.amountToReturn.toNumber(),
    rewardAmount: decodedLoan.rewardAmount.toNumber(),
    feeAmount: decodedLoan.feeAmount.toNumber(),
    royaltyAmount: decodedLoan.royaltyAmount.toNumber(),
    rewardInterestRate: new anchor.BN(decodedLoan.rewardInterestRate || 0).toNumber(),
    feeInterestRate: new anchor.BN(decodedLoan.feeInterestRate || 0).toNumber(),
    royaltyInterestRate: new anchor.BN(decodedLoan.royaltyInterestRate || 0).toNumber(),

    loanStatus: Object.keys(decodedLoan.loanStatus)[0],
    loanType: Object.keys(decodedLoan.loanType)[0],
  };
}
