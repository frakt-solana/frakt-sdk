import { Connection } from '@solana/web3.js';
import { Liquidity, LiquidityPoolInfo, LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';

export const fetchRaydiumPoolsInfo =
  (connection: Connection) =>
  async (raydiumPoolConfigs: LiquidityPoolKeysV4[]): Promise<LiquidityPoolInfo[]> =>
    await Liquidity.fetchMultipleInfo({ connection, pools: raydiumPoolConfigs });
