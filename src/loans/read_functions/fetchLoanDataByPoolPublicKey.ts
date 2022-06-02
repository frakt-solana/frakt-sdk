import { Connection, PublicKey } from '@solana/web3.js';
import { groupBy } from 'lodash';

import { LoanDataByPoolPublicKey } from '../types';
import { getAllProgramAccounts } from '../../lending';

export const fetchLoanDataByPoolPublicKey = async (
  connection: Connection,
  loansProgramPubkey: string,
): Promise<LoanDataByPoolPublicKey> => {
  const { collectionInfos, deposits, liquidityPools, loans } = await getAllProgramAccounts(
    new PublicKey(loansProgramPubkey),
    connection,
  );

  const collectionInfosByPoolPublicKey = groupBy(collectionInfos, 'liquidityPool');
  const depositsByPoolPublicKey = groupBy(deposits, 'liquidityPool');
  const loansByPoolPublicKey = groupBy(loans, 'liquidityPool');

  return liquidityPools?.reduce((loansData, liquidityPool) => {
    const { liquidityPoolPubkey } = liquidityPool;

    return loansData.set(liquidityPoolPubkey, {
      collectionsInfo: collectionInfosByPoolPublicKey[liquidityPoolPubkey] || [],
      deposits: depositsByPoolPublicKey[liquidityPoolPubkey] || [],
      liquidityPool: liquidityPool,
      loans: loansByPoolPublicKey[liquidityPoolPubkey] || [],
    });
  }, new Map());
};
