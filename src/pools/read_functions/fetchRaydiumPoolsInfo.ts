import { web3 } from'@project-serum/anchor';
import { Liquidity, LiquidityPoolInfo, LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';

export const fetchRaydiumPoolsInfo =
  (connection: web3.Connection) =>
  async (raydiumPoolConfigs: LiquidityPoolKeysV4[]): Promise<LiquidityPoolInfo[]> =>
    await Liquidity.fetchMultipleInfo({ connection, pools: raydiumPoolConfigs });
