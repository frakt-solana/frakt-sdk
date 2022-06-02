import { LoanView } from '../../common/types';
import { SOL_TOKEN } from '../../common/constants';

export const getAmountToReturnForPriceBasedLoan = (loan: LoanView): number => {
  const { amountToGet, rewardAmount, feeAmount, royaltyAmount } = loan;

  return (amountToGet + rewardAmount + feeAmount + royaltyAmount) / 10 ** SOL_TOKEN.decimals;
};
