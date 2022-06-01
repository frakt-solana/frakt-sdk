import { Liquidity, WSOL } from '@raydium-io/raydium-sdk';
import { Connection } from '@solana/web3.js';

import { PoolData, PoolDataByMint, TokenInfo} from '../../common/types';
import { BLOCKED_POOLS_IDS } from '../../common/constants';

export interface FetchPoolDataByMint {
  ({ connection, tokensMap }: { connection: Connection, tokensMap: Map<string, TokenInfo>; }): Promise<PoolDataByMint>;
}

const fetchPoolDataByMint: FetchPoolDataByMint = async ({ connection , tokensMap }) => {
  const allRaydiumConfigs = await Liquidity.fetchAllPoolKeys(connection);

  return allRaydiumConfigs.reduce((acc, raydiumPoolConfig) => {
    const { id, baseMint, quoteMint } = raydiumPoolConfig;

    const tokenInfo = tokensMap.get(baseMint.toBase58());

    if (
      tokenInfo &&
      quoteMint.toBase58() === WSOL.mint &&
      !BLOCKED_POOLS_IDS.includes(id.toBase58())
    ) {
      acc.set(baseMint.toBase58(), {
        tokenInfo,
        poolConfig: raydiumPoolConfig,
      });
    }

    return acc;
  }, new Map<string, PoolData>());
};

export default fetchPoolDataByMint;
