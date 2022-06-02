import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import anchor from '@project-serum/anchor';

export interface ApproveLoanByAdmin {
  programId: PublicKey;
  provider: anchor.Provider;
  admin: PublicKey;
  loan: PublicKey;
  liquidityPool: PublicKey;
  collectionInfo: PublicKey;
  nftPrice: number | anchor.BN;
  discount: number | anchor.BN;
  user: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}

export interface CloseLoanByAdmin {
  programId: PublicKey;
  provider: anchor.Provider;
  loan: PublicKey;
  admin: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}

export interface InitializeCollectionInfo {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidityPool: PublicKey;
  admin: PublicKey;
  creatorAddress: PublicKey;
  pricingLookupAddress: PublicKey;
  loanToValue: number | anchor.BN;
  collaterizationRate: number | anchor.BN;
  royaltyAddress: PublicKey;
  royaltyFeeTime: number | anchor.BN;
  royaltyFeePrice: number | anchor.BN;
  expirationTime: number | anchor.BN;
  isPriceBased: boolean;
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
}

export interface InitializeLiquidityPool {
  programId: PublicKey;
  provider: anchor.Provider;
  admin: PublicKey;
  rewardInterestRateTime: number | anchor.BN;
  feeInterestRateTime: number | anchor.BN;
  rewardInterestRatePrice: number | anchor.BN;
  feeInterestRatePrice: number | anchor.BN;
  id: number | anchor.BN;
  period: number | anchor.BN;
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
}

export interface LiquidateLoanByAdmin {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidator: PublicKey;
  user: PublicKey;
  loan: PublicKey;
  nftMint: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}

export interface RejectLoanByAdmin {
  programId: PublicKey;
  provider: anchor.Provider;
  loan: PublicKey;
  nftUserTokenAccount: PublicKey;
  admin: PublicKey;
  user: PublicKey;
  nftMint: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}

export interface UpdateCollectionInfo {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidityPool: PublicKey;
  admin: PublicKey;
  creatorAddress: PublicKey;
  collectionInfo: PublicKey;
  pricingLookupAddress: PublicKey;
  loanToValue: number | anchor.BN;
  collaterizationRate: number | anchor.BN;
  royaltyAddress: PublicKey;
  royaltyFeeTime: number | anchor.BN;
  royaltyFeePrice: number | anchor.BN;
  expirationTime: number | anchor.BN;
  isPriceBased: boolean;
  sendTxn: (transaction: Transaction) => Promise<void>;
}

export interface UpdateLiquidityPool {
  programId: PublicKey;
  provider: anchor.Provider;
  admin: PublicKey;
  liquidityPool: PublicKey;
  rewardInterestRateTime: number | anchor.BN;
  feeInterestRateTime: number | anchor.BN;
  rewardInterestRatePrice: number | anchor.BN;
  feeInterestRatePrice: number | anchor.BN;
  id: number | anchor.BN;
  period: number | anchor.BN;
  sendTxn: (transaction: Transaction) => Promise<void>;
}

export interface DepositLiquidity {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidityPool: PublicKey;
  user: PublicKey;
  amount: number;
  sendTxn: (transaction: Transaction) => Promise<void>;
}

export interface HarvestLiquidity {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidityPool: PublicKey;
  user: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}

export interface PaybackLoan {
  programId: PublicKey;
  provider: anchor.Provider;
  user: PublicKey;
  admin: PublicKey;
  loan: PublicKey;
  nftMint: PublicKey;
  liquidityPool: PublicKey;
  collectionInfo: PublicKey;
  royaltyAddress: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}

export interface ProposeLoan {
  programId: PublicKey;
  provider: anchor.Provider;
  user: PublicKey;
  nftMint: PublicKey;
  proposedNftPrice: number | anchor.BN;
  isPriceBased: boolean;
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
}

export interface UnstakeLiquidity {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidityPool: PublicKey;
  user: PublicKey;
  amount: anchor.BN | number;
  sendTxn: (transaction: Transaction) => Promise<void>;
}
