import { LiquidityPoolInfo, LiquidityPoolKeysV4, Percent } from '@raydium-io/raydium-sdk';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

export interface TokenExtensions {
  readonly website?: string;
  readonly bridgeContract?: string;
  readonly assetContract?: string;
  readonly address?: string;
  readonly explorer?: string;
  readonly twitter?: string;
  readonly github?: string;
  readonly medium?: string;
  readonly tgann?: string;
  readonly tggroup?: string;
  readonly discord?: string;
  readonly serumV3Usdt?: string;
  readonly serumV3Usdc?: string;
  readonly coingeckoId?: string;
  readonly imageUrl?: string;
  readonly description?: string;
}
export interface TokenInfo {
  readonly chainId: number;
  readonly address: string;
  readonly name: string;
  readonly decimals: number;
  readonly symbol: string;
  readonly logoURI?: string;
  readonly tags?: string[];
  readonly extensions?: TokenExtensions;
}

export interface AccountInfoData {
  owner: PublicKey;
  state: number;
  mint: PublicKey;
  amount: BN;
  delegateOption: number;
  delegate: PublicKey;
  isNativeOption: number;
  isNative: BN;
  delegatedAmount: BN;
  closeAuthorityOption: number;
  closeAuthority: PublicKey;
}

export interface AccountInfoParsed {
  publicKey: PublicKey;
  accountInfo: AccountInfoData;
}

export type ParseTokenAccount = (params: {
  tokenAccountPubkey: PublicKey;
  tokenAccountEncoded: AccountInfo<Buffer>;
}) => AccountInfoParsed | null;

export interface GetTokenAccount {
  tokenMint: PublicKey;
  owner: PublicKey;
  connection: Connection;
}

export interface AccountInfoParsed {
  publicKey: PublicKey;
  accountInfo: AccountInfoData;
}

export interface TokenView {
  tokenAccountPubkey: string;
  mint: string;
  owner: string;
  amount: number;
  amountBN: BN;
  delegateOption: boolean;
  delegate: string;
  state: number;
  isNativeOption: boolean;
  isNative: number;
  delegatedAmount: number;
  closeAuthorityOption: boolean;
  closeAuthority: string;
}

export type GetAllUserTokens = (props: { connection: Connection; walletPublicKey: PublicKey }) => Promise<TokenView[]>;

export interface DepositView {
  depositPubkey: string;
  liquidityPool: string;
  user: string;
  amount: number;
  stakedAt: number;
  stakedAtCumulative: number;
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
  amountToGet: number;
  rewardAmount: number;
  feeAmount: number;
  royaltyAmount: number;
  rewardInterestRate: number;
  feeInterestRate: number;
  royaltyInterestRate: number;
  loanStatus: string;
  loanType: string;
}

export interface LoanData {
  collectionsInfo: CollectionInfoView[];
  deposits: DepositView[];
  liquidityPool: LiquidityPoolView;
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

export interface ArweaveAttribute {
  trait_type: string;
  value: number | string;
}

export interface NFTCreator {
  address: string;
  share: number;
  verified?: boolean;
}

interface NFTFile {
  type: string;
  uri: string;
}

export interface ArweaveMetadata {
  name: string;
  symbol: string;
  description: string;
  collectionName?: string;
  seller_fee_basis_points?: number;
  image: string;
  animation_url?: string;
  external_url?: string;
  attributes: ArweaveAttribute[];
  properties?: {
    creators?: NFTCreator[];
    files?: NFTFile[];
  };
}

export interface UserNFT {
  mint: string;
  metadata: ArweaveMetadata;
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
  amountToGet: number;
  rewardAmount: number;
  feeAmount: number;
  royaltyAmount: number;
  rewardInterestRate: number;
  feeInterestRate: number;
  royaltyInterestRate: number;
  loanStatus: string;
  loanType: string;
}

export enum PoolWhitelistType {
  SINGLE_NFT_WHITELIST = 'singleNftWhitelist',
  CREATOR_WHITELIST = 'creatorWhitelist',
}

export type RaydiumPoolInfoMap = Map<string, LiquidityPoolInfo>;

export interface PoolData {
  tokenInfo: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
}

export type PoolDataByMint = Map<string, PoolData>;
