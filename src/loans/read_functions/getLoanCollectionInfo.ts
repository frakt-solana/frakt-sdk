import { LoanData } from '../../common/types';

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

const getLoanCollectionInfo = (loanData: LoanData, collectionInfoPublicKey: string): GetLoanCollectionInfo | undefined => (
  loanData.collectionsInfo?.find(({ collectionInfoPubkey }) => collectionInfoPubkey === collectionInfoPublicKey)
);

export default getLoanCollectionInfo;
