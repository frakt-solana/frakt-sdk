import { LoanData, UserNFT } from '../common/types';

export type LoanDataByPoolPublicKey = Map<string, LoanData>;

export interface GetFeePercent {
  (props: { nft: UserNFT; loanData: LoanData }): number;
}

export interface GetLoanCollectionInfo {
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

export type GetNftReturnPeriod = (props: { nft: UserNFT; loanData: LoanData }) => number;
