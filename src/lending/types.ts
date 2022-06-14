import { BN, AnchorProvider, web3 } from '@project-serum/anchor';

export interface ApproveLoanByAdmin {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  admin: web3.PublicKey;
  loan: web3.PublicKey;
  liquidityPool: web3.PublicKey;
  collectionInfo: web3.PublicKey;
  nftPrice: number | BN;
  discount: number | BN;
  user: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}

export interface CloseLoanByAdmin {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  loan: web3.PublicKey;
  admin: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}

export interface InitializeCollectionInfo {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  liquidityPool: web3.PublicKey;
  admin: web3.PublicKey;
  creatorAddress: web3.PublicKey;
  pricingLookupAddress: web3.PublicKey;
  loanToValue: number | BN;
  collaterizationRate: number | BN;
  royaltyAddress: web3.PublicKey;
  royaltyFeeTime: number | BN;
  royaltyFeePrice: number | BN;
  expirationTime: number | BN;
  isPriceBased: boolean;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}

export interface InitializeLiquidityPool {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  admin: web3.PublicKey;
  rewardInterestRateTime: number | BN;
  feeInterestRateTime: number | BN;
  rewardInterestRatePrice: number | BN;
  feeInterestRatePrice: number | BN;
  id: number | BN;
  period: number | BN;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}

export interface LiquidateLoanByAdmin {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  liquidator: web3.PublicKey;
  user: web3.PublicKey;
  loan: web3.PublicKey;
  nftMint: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}

export interface RejectLoanByAdmin {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  loan: web3.PublicKey;
  nftUserTokenAccount: web3.PublicKey;
  admin: web3.PublicKey;
  user: web3.PublicKey;
  nftMint: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}

export interface UpdateCollectionInfo {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  liquidityPool: web3.PublicKey;
  admin: web3.PublicKey;
  creatorAddress: web3.PublicKey;
  collectionInfo: web3.PublicKey;
  pricingLookupAddress: web3.PublicKey;
  loanToValue: number | BN;
  collaterizationRate: number | BN;
  royaltyAddress: web3.PublicKey;
  royaltyFeeTime: number | BN;
  royaltyFeePrice: number | BN;
  expirationTime: number | BN;
  isPriceBased: boolean;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}

export interface UpdateLiquidityPool {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  admin: web3.PublicKey;
  liquidityPool: web3.PublicKey;
  rewardInterestRateTime: number | BN;
  feeInterestRateTime: number | BN;
  rewardInterestRatePrice: number | BN;
  feeInterestRatePrice: number | BN;
  id: number | BN;
  period: number | BN;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}

export interface DepositLiquidity {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  liquidityPool: web3.PublicKey;
  user: web3.PublicKey;
  amount: number;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}

export interface HarvestLiquidity {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  liquidityPool: web3.PublicKey;
  user: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}

export interface PaybackLoan {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  user: web3.PublicKey;
  admin: web3.PublicKey;
  loan: web3.PublicKey;
  nftMint: web3.PublicKey;
  liquidityPool: web3.PublicKey;
  collectionInfo: web3.PublicKey;
  royaltyAddress: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}

export interface ProposeLoan {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  user: web3.PublicKey;
  nftMint: web3.PublicKey;
  proposedNftPrice: number | BN;
  isPriceBased: boolean;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}

export interface UnstakeLiquidity {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  liquidityPool: web3.PublicKey;
  user: web3.PublicKey;
  amount: BN | number;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}
