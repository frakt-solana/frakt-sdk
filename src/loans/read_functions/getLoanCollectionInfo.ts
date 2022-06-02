import { GetLoanCollectionInfo } from '../types';
import { LoanData } from '../../common/types';

export const getLoanCollectionInfo = (
  loanData: LoanData,
  collectionInfoPublicKey: string,
): GetLoanCollectionInfo | undefined =>
  loanData.collectionsInfo?.find(({ collectionInfoPubkey }) => collectionInfoPubkey === collectionInfoPublicKey);
