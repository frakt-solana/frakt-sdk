import { LoanData, UserNFT } from '../../common/types';
import { getNftCreators } from '../../common/utils';

export type GetNftReturnPeriod = (props: {
  nft: UserNFT;
  loanData: LoanData;
}) => number;

const getNftReturnPeriod: GetNftReturnPeriod = ({ loanData, nft }) => {
  const nftCreators = getNftCreators(nft);

  return loanData?.collectionsInfo?.find(({creator}) => nftCreators.includes(creator))?.expirationTime || 0;
};

export default getNftReturnPeriod;
