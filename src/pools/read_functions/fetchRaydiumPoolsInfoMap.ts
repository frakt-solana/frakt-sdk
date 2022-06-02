import { Connection } from '@solana/web3.js';
import { Liquidity, LiquidityPoolInfo, LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { RaydiumPoolInfoMap } from '../../common/types';

const fetchRaydiumPoolsInfoMap = async (
  connection: Connection,
  raydiumPoolConfigs: LiquidityPoolKeysV4[],
): Promise<RaydiumPoolInfoMap> => {
  const raydiumPoolInfoMap = new Map<string, LiquidityPoolInfo>();

  const allPoolsInfo = await Promise.all(
    raydiumPoolConfigs.map((poolKey) => Liquidity.fetchInfo({ connection, poolKeys: poolKey })),
  );

  allPoolsInfo.forEach((poolInfo, idx) => {
    raydiumPoolInfoMap.set(raydiumPoolConfigs?.[idx]?.baseMint.toBase58(), poolInfo);
  });

  return raydiumPoolInfoMap;
};

export default fetchRaydiumPoolsInfoMap;
