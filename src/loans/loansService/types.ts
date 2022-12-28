import { web3 } from '@project-serum/anchor';
import { Wallet } from '../../common/classes/nodewallet';

import { SignAndSendAllTransactions, SignAndSendTransaction } from './transactions';

interface BorrowNftTimeBasedParams {
  returnPeriodDays: number; // 14
  ltvPercents: number; // 40
  fee: string; // 0.100
  feeDiscountPercents: string; // 2
  repayValue: string; // 1.101
  liquidityPoolPubkey: string;
  loanValue: string; // 1.020
  isCanStake: boolean;
}

interface BorrowNftPriceBasedParams {
  liquidityPoolPubkey: string;
  ltvPercents: number; // 40
  borrowAPRPercents: number; // 10
  collaterizationRate: number; // 10(%)
  isCanStake: boolean;
}

export interface BorrowNft {
  mint: string;
  name: string;
  imageUrl: string;
  valuation: string; // 2.508
  maxLoanValue: string; // 1.003
  isCanFreeze: boolean;
  timeBased: BorrowNftTimeBasedParams;
  priceBased?: BorrowNftPriceBasedParams;
}

interface BorrowNftBulkPriceBasedParams extends BorrowNftPriceBasedParams {
  ltv?: number;
  suggestedLoanValue?: number;
}

export interface BorrowNftBulk extends BorrowNft {
  solLoanValue: number;
  isPriceBased?: boolean;
  priceBased?: BorrowNftBulkPriceBasedParams;
}

export enum BulkTypes {
  BEST = 'best',
  CHEAPEST = 'cheapest',
  SAFEST = 'safest',
  MAX = 'max',
}

export type BulkSuggestion = {
  [key in BulkTypes]?: BorrowNftBulk[];
};

export type FetchWalletNfts = (props: {
  walletPublicKey: web3.PublicKey;
  limit?: number;
  offset?: number;
}) => Promise<BorrowNft[]>;

export type FetchBulkSuggestion = (props: {
  walletPublicKey: web3.PublicKey;
  totalValue: string | number;
}) => Promise<BulkSuggestion>;

export type ProposeLoan = (props: {
  nftMint: string;
  valuation: number;
  ltv: number;
  isPriceBased?: boolean;
  connection: web3.Connection;
  wallet: Wallet;
  onAfterSend?: () => void;
  onBeforeApprove?: () => void;
}) => ReturnType<SignAndSendTransaction>;

export type ProposeLoans = (props: {
  bulkNfts: BorrowNftBulk[];
  connection: web3.Connection;
  wallet: Wallet;
  onAfterSend?: () => void;
  onBeforeApprove?: () => void;
}) => ReturnType<SignAndSendAllTransactions>;
