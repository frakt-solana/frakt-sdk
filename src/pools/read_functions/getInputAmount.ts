import { Liquidity, LiquidityPoolInfo, LiquidityPoolKeysV4, Percent, Token, TokenAmount } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '../../common/types';

export interface GetInputAmount {
  poolKeys: LiquidityPoolKeysV4;
  poolInfo: LiquidityPoolInfo;
  receiveToken: TokenInfo;
  receiveAmount: number;
  payToken: TokenInfo;
  slippage?: Percent;
}

const getInputAmount = ({
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
      new Token(
        receiveToken.address,
        receiveToken.decimals,
        receiveToken.symbol,
        receiveToken.name,
      ),
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

export default getInputAmount;
