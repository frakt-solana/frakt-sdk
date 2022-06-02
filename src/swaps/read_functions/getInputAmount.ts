import {
  Liquidity,
  Percent,
  Token,
  TokenAmount,
} from '@raydium-io/raydium-sdk';
import { GetInputAmount } from '../types';

export const getInputAmount = ({
  poolKeys,
  poolInfo,
  receiveToken,
  receiveAmount,
  payToken,
  slippage = new Percent(1, 100),
}: GetInputAmount): {
  amountIn: string;
  maxAmountIn: string;
  priceImpact: string;
} => {
  try {
    const amountOut = new TokenAmount(
      new Token(receiveToken.address, receiveToken.decimals, receiveToken.symbol, receiveToken.name),
      receiveAmount,
      false,
    );

    const { amountIn, maxAmountIn, priceImpact } = Liquidity.computeAmountIn({
      poolKeys,
      poolInfo,
      amountOut,
      currencyIn: payToken,
      slippage,
    });

    return {
      amountIn: amountIn.toSignificant(),
      maxAmountIn: maxAmountIn.toSignificant(),
      priceImpact: priceImpact.toSignificant(),
    };
  } catch (err) {
    console.error(err);
  }

  return {
    amountIn: '',
    maxAmountIn: '',
    priceImpact: '',
  };
};
