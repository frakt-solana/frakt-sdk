import { BN, AnchorProvider, web3 } from '@project-serum/anchor';

import { PoolDataByMint, TokenInfo } from '../common/types';

export interface BoardEntryView {
  boardEntryPubkey: string;
  entryholder: string;
  totaScore: string;
  scoreToHarvest: string;
  nftMint: string;
  message: string;
}

export interface PoolConfigView {
  poolConfigPubkey: string;
  vaultOwnerPda: string;
  tokenMint: string;
  vaultTokenAccount: string;
  poolVaultBalance: string;
}

export interface PermissionView {
  permissionPubkey: string;
  programPubkey: string;
  expiration: string;
  canAddScore: string;
  canHarvestScore: string;
}

export interface ActivateCommunityPool {
  communityPool: web3.PublicKey;
  programId: web3.PublicKey;
  userPubkey: web3.PublicKey;
  connection: web3.Connection;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}

export interface AddToWhitelist {
  isCreator: boolean;
  communityPool: web3.PublicKey;
  whitelistedAddress: web3.PublicKey;
  programId: web3.PublicKey;
  userPubkey: web3.PublicKey;
  connection: web3.Connection;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}

export interface EmergencyWithdrawByAdmin {
  communityPool: web3.PublicKey;
  safetyDepositBox: web3.PublicKey;
  nftMint: web3.PublicKey;
  storeNftTokenAccount: web3.PublicKey;
  programId: web3.PublicKey;
  admin: web3.PublicKey;
  connection: web3.Connection;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}

export interface InitBoardEntry {
  programId: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  nftMint: web3.PublicKey;
  message: string;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
  initialBalance?: BN;
}

export interface InitBoardEntryInstruction {
  programId: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  nftMint: web3.PublicKey;
  message: string;
  initialBalance?: BN;
}

export interface InitCommunityPool {
  programId: web3.PublicKey;
  userPubkey: web3.PublicKey;
  connection: web3.Connection;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}

export interface InitConfig {
  programId: web3.PublicKey;
  connection: web3.Connection;
  admin: web3.PublicKey;
  tokenMint: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}

export interface InitializeFee {
  programId: web3.PublicKey;
  connection: web3.Connection;
  userPubkey: web3.PublicKey;
  depositFeeAdmin: number;
  depositFeePool: number;
  getLotteryFeeAdmin: number;
  getLotteryFeePool: number;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
  communityPool?: web3.PublicKey;
}

export interface InitLeaderboardReward {
  communityPool: web3.PublicKey;
  fractionMint: web3.PublicKey;
  depositReward: BN;
  withdrawReward: BN;
  programId: web3.PublicKey;
  admin: web3.PublicKey;
  connection: web3.Connection;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}

export interface InitPermission {
  programId: web3.PublicKey;
  connection: web3.Connection;
  admin: web3.PublicKey;
  programPubkey: web3.PublicKey;
  expiration: BN;
  canAdd: boolean;
  canHarvest: boolean;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}

export interface RevealLotteryTicket {
  communityPool: web3.PublicKey;
  lotteryTicket: web3.PublicKey;
  safetyDepositBox: web3.PublicKey;
  programId: web3.PublicKey;
  userPubkey: web3.PublicKey;
  connection: web3.Connection;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}

export interface TopupConfig {
  programId: web3.PublicKey;
  connection: web3.Connection;
  admin: web3.PublicKey;
  tokenMint: web3.PublicKey;
  inputAmount: BN;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}

export interface UpdateConnection {
  programId: web3.PublicKey;
  connection: web3.Connection;
  userPubkey: web3.PublicKey;
  communityPool: web3.PublicKey;
  fractionMint: web3.PublicKey;
  fusion: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}

export interface UpdateFee {
  programId: web3.PublicKey;
  connection: web3.Connection;
  userPubkey: web3.PublicKey;
  config: web3.PublicKey;
  depositFeeAdmin: number;
  depositFeePool: number;
  getLotteryFeeAdmin: number;
  getLotteryFeePool: number;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}

export interface UpdateLeaderboardReward {
  communityPool: web3.PublicKey;
  fractionMint: web3.PublicKey;
  depositReward: BN;
  withdrawReward: BN;
  programId: web3.PublicKey;
  admin: web3.PublicKey;
  connection: web3.Connection;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}

export interface WithdrawNftByAdmin {
  communityPool: web3.PublicKey;
  lotteryTicket: web3.PublicKey;
  ticketHolder: web3.PublicKey;
  safetyDepositBox: web3.PublicKey;
  nftMint: web3.PublicKey;
  storeNftTokenAccount: web3.PublicKey;
  programId: web3.PublicKey;
  admin: web3.PublicKey;
  connection: web3.Connection;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}

export interface WithdrawNftByTicket {
  communityPool: web3.PublicKey;
  lotteryTicket: web3.PublicKey;
  safetyDepositBox: web3.PublicKey;
  nftMint: web3.PublicKey;
  storeNftTokenAccount: web3.PublicKey;
  programId: web3.PublicKey;
  userPubkey: web3.PublicKey;
  connection: web3.Connection;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}

export interface DepositNftToCommunityPool {
  communityPool: web3.PublicKey;
  nftMint: web3.PublicKey;
  nftUserTokenAccount: web3.PublicKey;
  fractionMint: web3.PublicKey;
  poolWhitelist: web3.PublicKey;
  metadataInfo: web3.PublicKey;
  fusionProgramId: web3.PublicKey;
  tokenMintInputFusion: web3.PublicKey;
  feeConfig: web3.PublicKey;
  adminAddress: web3.PublicKey;
  programId: web3.PublicKey;
  userPubkey: web3.PublicKey;
  connection: web3.Connection;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}

export interface GetLotteryTicket {
  communityPool: web3.PublicKey;
  fractionMint: web3.PublicKey;
  userFractionsTokenAccount: web3.PublicKey;
  fusionProgramId: web3.PublicKey;
  tokenMintInputFusion: web3.PublicKey;
  feeConfig: web3.PublicKey;
  adminAddress: web3.PublicKey;
  programId: web3.PublicKey;
  userPubkey: web3.PublicKey;
  connection: web3.Connection;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}

export interface HarvestScore {
  programId: web3.PublicKey;
  connection: web3.Connection;
  userPublicKey: web3.PublicKey;
  tokenMint: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}

export interface FetchPoolDataByMint {
  ({
    connection,
    tokensMap,
  }: {
    connection: web3.Connection;
    tokensMap: Map<string, TokenInfo>;
  }): Promise<PoolDataByMint>;
}

export interface DepositNftToCommunityPoolIx {
  communityPool: web3.PublicKey;
  nftMint: web3.PublicKey;
  nftUserTokenAccount: web3.PublicKey;
  fractionMint: web3.PublicKey;
  poolWhitelist: web3.PublicKey;
  metadataInfo: web3.PublicKey;
  fusionProgramId: web3.PublicKey;
  tokenMintInputFusion: web3.PublicKey;
  feeConfig: web3.PublicKey;
  adminAddress: web3.PublicKey;
  programId: web3.PublicKey;
  userPubkey: web3.PublicKey;
  connection: web3.Connection;
}

export interface GetLotteryTicketIx {
  communityPool: web3.PublicKey;
  fractionMint: web3.PublicKey;
  userFractionsTokenAccount: web3.PublicKey;
  fusionProgramId: web3.PublicKey;
  tokenMintInputFusion: web3.PublicKey;
  feeConfig: web3.PublicKey;
  adminAddress: web3.PublicKey;
  programId: web3.PublicKey;
  userPubkey: web3.PublicKey;
  connection: web3.Connection;
}

export interface MainRouterView {
  mainRouterPubkey: string;
  tokenMintInput: string;
  tokenMintOutput: string;
  poolConfigInput: string;
  poolConfigOutput: string;
  amountOfStaked: string;
  amountToReturn: string;
  apr: string;
  cumulative: string;
  lastTime: string;
  decimalsInput: string;
  decimalsOutput: string;
  oldCumulative: string;
  endTime: string;
  startTime: string;
}

export interface SecondaryRewardView {
  secondaryRewardaccount: string;
  routerPubkey: string;
  tokenMint: string;
  poolVaultBalance: string;
  tokensPerSecondPerPoint: string;
  decimalsOutput: string;
  startTime: string;
  endTime: string;
}

export interface StakeAccountView {
  stakeAccountPubkey: string;
  stakeOwner: string;
  tokenMintInput: string;
  tokenMintOutput: string;
  routerPubkey: string;
  amount: string;
  stakedAt: string;
  stakeEnd: string;
  stakedAtCumulative: string;
  unstakedAtCumulative: string;
  lastHarvestedAt: string;
  isStaked: boolean;
}

export interface StakeAccountView {
  stakeAccountPubkey: string;
  stakeOwner: string;
  tokenMintInput: string;
  tokenMintOutput: string;
  routerPubkey: string;
  amount: string;
  stakedAt: string;
  stakeEnd: string;
  stakedAtCumulative: string;
  unstakedAtCumulative: string;
  lastHarvestedAt: string;
  isStaked: boolean;
}

export interface MainPoolConfigView {
  mainPoolPubkey: string;
  vaultOwnerPda: string;
  tokenMint: string;
  vaultTokenAccount: string;
  poolVaultBalance: string;
}

export interface StakeAccountView {
  stakeAccountPubkey: string;
  stakeOwner: string;
  tokenMintInput: string;
  tokenMintOutput: string;
  routerPubkey: string;
  amount: string;
  stakedAt: string;
  stakeEnd: string;
  stakedAtCumulative: string;
  unstakedAtCumulative: string;
  lastHarvestedAt: string;
  isStaked: boolean;
}

export interface MainRouterView {
  mainRouterPubkey: string;
  tokenMintInput: string;
  tokenMintOutput: string;
  poolConfigInput: string;
  poolConfigOutput: string;
  amountOfStaked: string;
  amountToReturn: string;
  apr: string;
  cumulative: string;
  lastTime: string;
  decimalsInput: string;
  decimalsOutput: string;
  oldCumulative: string;
  endTime: string;
  startTime: string;
}

export interface SecondStakeAccountView {
  secondStakeAccount: string;
  rewardOwner: string;
  stakeAccount: string;
  secondaryReward: string;
  startTime: string;
  lastHarvestedAt: string;
}

export interface SecondaryRewardView {
  secondaryRewardaccount: string;
  routerPubkey: string;
  tokenMint: string;
  poolVaultBalance: string;
  tokensPerSecondPerPoint: string;
  decimalsOutput: string;
  startTime: string;
  endTime: string;
}
