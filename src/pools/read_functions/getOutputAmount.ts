import { Liquidity, LiquidityPoolInfo, LiquidityPoolKeysV4, Percent, Token, TokenAmount } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '../../common/types';

export interface GetOutputAmount {
  poolKeys: LiquidityPoolKeysV4;
  poolInfo: LiquidityPoolInfo;
  payToken: TokenInfo;
  payAmount: number;
  receiveToken: TokenInfo;
  slippage?: Percent;
}

const getOutputAmount = ({
  poolKeys,
  poolInfo,
  payToken,
  payAmount,
  receiveToken,
  slippage = new Percent(1, 100),
}: GetOutputAmount): {
  amountOut: string;
  minAmountOut: string;
  priceImpact: string;
} => {
  try {
    const amountIn = new TokenAmount(
      new Token(
        payToken.address,
        payToken.decimals,
        payToken.symbol,
        payToken.name,
      ),
      payAmount,
      false,
    );

    const { amountOut, minAmountOut, priceImpact } = Liquidity.computeAmountOut(
      {
        poolKeys,
        poolInfo,
        amountIn,
        currencyOut: receiveToken,
        slippage,
      },
    );

    return {
      amountOut: amountOut.toSignificant(),
      minAmountOut: minAmountOut.toSignificant(),
      priceImpact: priceImpact.toSignificant(),
    };
  } catch (err) {
    console.error(err);
  }

  return {
    amountOut: '',
    minAmountOut: '',
    priceImpact: '',
  };
};

export default getOutputAmount;
