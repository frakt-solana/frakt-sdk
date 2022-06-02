import { GetNftReturnPeriod } from '../types';
import { getNftCreators } from '../../common';

export const getNftReturnPeriod: GetNftReturnPeriod = ({ loanData, nft }) => {
  const nftCreators = getNftCreators(nft);

  return loanData?.collectionsInfo?.find(({ creator }) => nftCreators.includes(creator))?.expirationTime || 0;
};
