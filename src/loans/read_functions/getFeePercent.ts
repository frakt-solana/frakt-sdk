import { LoanData, UserNFT } from '../../common/types';
import { getNftCreators } from '../../common/utils';

export interface GetFeePercent {
  (props: { nft: UserNFT; loanData: LoanData }): number;
}

const getFeePercent: GetFeePercent = ({ loanData, nft }) => {
  const PERCENT_PRECISION = 100;

  const nftCreators = getNftCreators(nft);

  const royaltyFeeRaw =
    loanData?.collectionsInfo?.find(({ creator }) =>
      nftCreators.includes(creator),
    )?.royaltyFeeTime || 0;

  const rewardInterestRateRaw =
    loanData?.liquidityPool?.rewardInterestRateTime || 0;

  const feeInterestRateRaw = loanData?.liquidityPool?.feeInterestRateTime || 0;

  const feesPercent =
    (royaltyFeeRaw + rewardInterestRateRaw + feeInterestRateRaw) /
    (100 * PERCENT_PRECISION);

  return feesPercent || 0;
};

export default getFeePercent;
