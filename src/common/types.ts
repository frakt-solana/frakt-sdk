import { BN, web3 } from'@project-serum/anchor';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';

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
  owner: web3.PublicKey;
  state: number;
  mint: web3.PublicKey;
  amount: BN;
  delegateOption: number;
  delegate: web3.PublicKey;
  isNativeOption: number;
  isNative: BN;
  delegatedAmount: BN;
  closeAuthorityOption: number;
  closeAuthority: web3.PublicKey;
}

export interface AccountInfoParsed {
  pubkey: web3.PublicKey;
  accountInfo: AccountInfoData;
}

export type ParseTokenAccount = (params: {
  tokenAccountPubkey: web3.PublicKey;
  tokenAccountEncoded: web3.AccountInfo<Buffer> | null;
}) => AccountInfoParsed | null;

export interface GetTokenAccount {
  tokenMint: web3.PublicKey;
  owner: web3.PublicKey;
  connection: web3.Connection;
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

export type GetAllUserTokens = (props: { connection: web3.Connection; walletPublicKey: web3.PublicKey }) => Promise<TokenView[]>;

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

export enum PoolWhitelistType {
  SINGLE_NFT_WHITELIST = 'singleNftWhitelist',
  CREATOR_WHITELIST = 'creatorWhitelist',
}

export interface PoolData {
  tokenInfo: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
}

export type PoolDataByMint = Map<string, PoolData>;
