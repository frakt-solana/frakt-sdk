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
  pubkey: PublicKey;
  accountInfo: AccountInfoData;
}

export type ParseTokenAccount = (params: {
  tokenAccountPubkey: PublicKey;
  tokenAccountEncoded: AccountInfo<Buffer> | null;
}) => AccountInfoParsed | null;

export interface GetTokenAccount {
  tokenMint: PublicKey;
  owner: PublicKey;
  connection: Connection;
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
/*
export interface AllAccounts {
  collectionInfos: CollectionInfoView[];
  deposits: DepositView[];
  liquidityPools: LiquidityPoolView[];
  loans: LoanView[];
}
*/
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

export interface PoolData {
  tokenInfo: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
}

export type PoolDataByMint = Map<string, PoolData>;

export type NftLendingV2 = {
  version: '0.1.0';
  name: 'nft_lending_v2';
  instructions: [
    {
      name: 'proposeLoan';
      accounts: [
        {
          name: 'loan';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'nftUserTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'communityPoolsAuthority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'metadataProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'editionInfo';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'bumpPoolsAuth';
          type: 'u8';
        },
        {
          name: 'isPriceBased';
          type: 'bool';
        },
        {
          name: 'originalPriceFromUser';
          type: 'u64';
        },
      ];
    },
    {
      name: 'approveLoanByAdmin';
      accounts: [
        {
          name: 'loan';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'liquidityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'liqOwner';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'collectionInfo';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'nftPrice';
          type: 'u64';
        },
        {
          name: 'discount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'depositLiquidity';
      accounts: [
        {
          name: 'liquidityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'liqOwner';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'deposit';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'initializeCollectionInfo';
      accounts: [
        {
          name: 'collectionInfo';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'creatorAddress';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'liquidityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pricingLookupAddress';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'royaltyAddress';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'params';
          type: {
            defined: 'CollectionInfoParams';
          };
        },
      ];
    },
    {
      name: 'updateCollectionInfo';
      accounts: [
        {
          name: 'collectionInfo';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'creatorAddress';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'liquidityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'pricingLookupAddress';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'royaltyAddress';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'params';
          type: {
            defined: 'CollectionInfoParams';
          };
        },
      ];
    },
    {
      name: 'initializeLiquidityPool';
      accounts: [
        {
          name: 'liquidityPool';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'liqOwner';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'bumpPoolsAuth';
          type: 'u8';
        },
        {
          name: 'params';
          type: {
            defined: 'LiqPoolInputParams';
          };
        },
      ];
    },
    {
      name: 'updateLiquidityPool';
      accounts: [
        {
          name: 'liquidityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'params';
          type: {
            defined: 'LiqPoolInputParams';
          };
        },
      ];
    },
    {
      name: 'liquidateLoanByAdmin';
      accounts: [
        {
          name: 'loan';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'liquidator';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'nftMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'nftLiquidatorTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'nftUserTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'communityPoolsAuthority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'metadataProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'editionInfo';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'bumpPoolsAuth';
          type: 'u8';
        },
      ];
    },
    {
      name: 'paybackLoan';
      accounts: [
        {
          name: 'loan';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'liquidityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'collectionInfo';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'nftMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'nftUserTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'royaltyAddress';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'liqOwner';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'communityPoolsAuthority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'metadataProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'editionInfo';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'bumpPoolsAuth';
          type: 'u8';
        },
      ];
    },
    {
      name: 'rejectLoanByAdmin';
      accounts: [
        {
          name: 'loan';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'nftMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'nftUserTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'communityPoolsAuthority';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'metadataProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'editionInfo';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'bumpPoolsAuth';
          type: 'u8';
        },
      ];
    },
    {
      name: 'unstakeLiquidity';
      accounts: [
        {
          name: 'liquidityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'deposit';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'liqOwner';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'depositBump';
          type: 'u8';
        },
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'harvestLiquidity';
      accounts: [
        {
          name: 'liquidityPool';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'liqOwner';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'deposit';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'depositBump';
          type: 'u8';
        },
      ];
    },
    {
      name: 'closeLoan';
      accounts: [
        {
          name: 'loan';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'communityPoolsAuthority';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'bumpPoolsAuth';
          type: 'u8';
        },
      ];
    },
    {
      name: 'updateDepositAmount';
      accounts: [
        {
          name: 'deposit';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: true;
        },
      ];
      args: [
        {
          name: 'newDepositAmount';
          type: 'u64';
        },
        {
          name: 'stakedAtCumulative';
          type: 'u64';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'collectionInfo';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'creator';
            type: 'publicKey';
          },
          {
            name: 'liquidityPool';
            type: 'publicKey';
          },
          {
            name: 'pricingLookupAddress';
            type: 'publicKey';
          },
          {
            name: 'royaltyAddress';
            type: 'publicKey';
          },
          {
            name: 'royaltyFeeTime';
            type: 'u64';
          },
          {
            name: 'royaltyFeePrice';
            type: 'u64';
          },
          {
            name: 'loanToValue';
            type: 'u64';
          },
          {
            name: 'collaterizationRate';
            type: 'u64';
          },
          {
            name: 'availableLoanTypes';
            type: {
              defined: 'AvailableLoanTypes';
            };
          },
          {
            name: 'expirationTime';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'deposit';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'liquidityPool';
            type: 'publicKey';
          },
          {
            name: 'user';
            type: 'publicKey';
          },
          {
            name: 'amount';
            type: 'u64';
          },
          {
            name: 'stakedAt';
            type: 'u64';
          },
          {
            name: 'stakedAtCumulative';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'liquidityPool';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'id';
            type: 'u64';
          },
          {
            name: 'rewardInterestRateTime';
            type: 'u64';
          },
          {
            name: 'feeInterestRateTime';
            type: 'u64';
          },
          {
            name: 'rewardInterestRatePrice';
            type: 'u64';
          },
          {
            name: 'feeInterestRatePrice';
            type: 'u64';
          },
          {
            name: 'liquidityAmount';
            type: 'u64';
          },
          {
            name: 'liqOwner';
            type: 'publicKey';
          },
          {
            name: 'liqSeed';
            type: 'u8';
          },
          {
            name: 'amountOfStaked';
            type: 'u64';
          },
          {
            name: 'userRewardsAmount';
            type: 'u64';
          },
          {
            name: 'apr';
            type: 'u64';
          },
          {
            name: 'cumulative';
            type: 'u64';
          },
          {
            name: 'lastTime';
            type: 'u64';
          },
          {
            name: 'oldCumulative';
            type: 'u64';
          },
          {
            name: 'period';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'loan';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'user';
            type: 'publicKey';
          },
          {
            name: 'nftMint';
            type: 'publicKey';
          },
          {
            name: 'nftUserTokenAccount';
            type: 'publicKey';
          },
          {
            name: 'liquidityPool';
            type: 'publicKey';
          },
          {
            name: 'collectionInfo';
            type: 'publicKey';
          },
          {
            name: 'startedAt';
            type: 'u64';
          },
          {
            name: 'expiredAt';
            type: {
              option: 'u64';
            };
          },
          {
            name: 'finishedAt';
            type: 'u64';
          },
          {
            name: 'originalPrice';
            type: 'u64';
          },
          {
            name: 'amountToGet';
            type: 'u64';
          },
          {
            name: 'rewardAmount';
            type: 'u64';
          },
          {
            name: 'feeAmount';
            type: 'u64';
          },
          {
            name: 'royaltyAmount';
            type: 'u64';
          },
          {
            name: 'rewardInterestRate';
            type: {
              option: 'u64';
            };
          },
          {
            name: 'feeInterestRate';
            type: {
              option: 'u64';
            };
          },
          {
            name: 'royaltyInterestRate';
            type: {
              option: 'u64';
            };
          },
          {
            name: 'loanStatus';
            type: {
              defined: 'LoanStatus';
            };
          },
          {
            name: 'loanType';
            type: {
              defined: 'LoanType';
            };
          },
        ];
      };
    },
  ];
  types: [
    {
      name: 'CollectionInfoParams';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'loanToValue';
            type: 'u64';
          },
          {
            name: 'collaterizationRate';
            type: 'u64';
          },
          {
            name: 'royaltyFeeTime';
            type: 'u64';
          },
          {
            name: 'royaltyFeePrice';
            type: 'u64';
          },
          {
            name: 'expirationTime';
            type: 'u64';
          },
          {
            name: 'isPriceBased';
            type: 'bool';
          },
        ];
      };
    },
    {
      name: 'LiqPoolInputParams';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'rewardInterestRateTime';
            type: 'u64';
          },
          {
            name: 'feeInterestRateTime';
            type: 'u64';
          },
          {
            name: 'id';
            type: 'u64';
          },
          {
            name: 'rewardInterestRatePrice';
            type: 'u64';
          },
          {
            name: 'feeInterestRatePrice';
            type: 'u64';
          },
          {
            name: 'period';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'AvailableLoanTypes';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'OnlyTimeBased';
          },
          {
            name: 'TimeBasedAndPriceBased';
          },
        ];
      };
    },
    {
      name: 'LoanStatus';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Proposed';
          },
          {
            name: 'Rejected';
          },
          {
            name: 'Activated';
          },
          {
            name: 'PaidBack';
          },
          {
            name: 'Liquidated';
          },
        ];
      };
    },
    {
      name: 'LoanType';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'TimeBased';
          },
          {
            name: 'PriceBased';
          },
        ];
      };
    },
  ];
  events: [
    {
      name: 'LoanApproved';
      fields: [
        {
          name: 'loan';
          type: 'string';
          index: false;
        },
        {
          name: 'period';
          type: 'u64';
          index: false;
        },
        {
          name: 'loanValue';
          type: 'u64';
          index: false;
        },
        {
          name: 'loanToValue';
          type: 'u64';
          index: false;
        },
        {
          name: 'interest';
          type: 'u64';
          index: false;
        },
        {
          name: 'nftMint';
          type: 'string';
          index: false;
        },
      ];
    },
    {
      name: 'LoanUpdate';
      fields: [
        {
          name: 'loan';
          type: 'string';
          index: false;
        },
        {
          name: 'status';
          type: {
            defined: 'LoanStatus';
          };
          index: false;
        },
      ];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'InvalidInstruction';
      msg: 'InvalidInstruction';
    },
    {
      code: 6001;
      name: 'MoreThanHave';
      msg: 'MoreThanHave';
    },
    {
      code: 6002;
      name: 'LoanIsNotProposed';
      msg: 'LoanIsNotProposed';
    },
    {
      code: 6003;
      name: 'CollectionInfoDoNotConnectWithNftMint';
      msg: 'CollectionInfoDoNotConnectWithNftMint';
    },
    {
      code: 6004;
      name: 'IncorrectNftMint';
      msg: 'IncorrectNftMint';
    },
    {
      code: 6005;
      name: 'IncorrectTokenAccount';
      msg: 'IncorrectTokenAccount';
    },
    {
      code: 6006;
      name: 'LoanIsNotActivated';
      msg: 'LoanIsNotActivated';
    },
    {
      code: 6007;
      name: 'TimeIsNotExpired';
      msg: 'TimeIsNotExpired';
    },
    {
      code: 6008;
      name: 'CollectionInfoDoesntMatchLiquidityPool';
      msg: 'CollectionInfoDoesntMatchLiquidityPool';
    },
    {
      code: 6009;
      name: 'CannotClose';
      msg: 'CannotClose';
    },
    {
      code: 6010;
      name: 'WrongTypeOfAvailableLoan';
      msg: 'WrongTypeOfAvailableLoan';
    },
    {
      code: 6011;
      name: 'InvalidLoan';
      msg: 'InvalidLoan';
    },
  ];
};
