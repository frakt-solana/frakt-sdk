import { LiquidityPoolInfo, LiquidityPoolKeysV4, Percent } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '../common/types';

export type RaydiumPoolInfoMap = Map<string, LiquidityPoolInfo>;

export interface GetInputAmount {
  poolKeys: LiquidityPoolKeysV4;
  poolInfo: LiquidityPoolInfo;
  receiveToken: TokenInfo;
  receiveAmount: number;
  payToken: TokenInfo;
  slippage?: Percent;
}

export interface GetOutputAmount {
  poolKeys: LiquidityPoolKeysV4;
  poolInfo: LiquidityPoolInfo;
  payToken: TokenInfo;
  payAmount: number;
  receiveToken: TokenInfo;
  slippage?: Percent;
}
