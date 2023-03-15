import { web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type UpdatePriceBasedLiquidityPool = (params: {
  programId: web3.PublicKey;
  liquidityPool: web3.PublicKey;
  connection: web3.Connection;
  admin: web3.PublicKey;
  baseBorrowRate: number;
  variableSlope1: number;
  variableSlope2: number;
  utilizationRateOptimal: number;
  reserveFactor: number;
  depositCommission: number;
  borrowCommission: number;
  id: number;
}) => Promise<{ix: web3.TransactionInstruction}>;

export const updatePriceBasedLiquidityPool: UpdatePriceBasedLiquidityPool = async ({
  programId,
  liquidityPool,
  connection,
  admin,
  baseBorrowRate,
  variableSlope1,
  variableSlope2,
  utilizationRateOptimal,
  reserveFactor,
  depositCommission,
  borrowCommission,
  id,
}) => {
  const program = returnAnchorProgram(programId, connection);

  const ix = await program.methods.updatePriceBasedLiquidityPool(
    {
      id,
      baseBorrowRate,
      variableSlope1,
      variableSlope2,
      utilizationRateOptimal,
      reserveFactor,
      depositCommission,
      borrowCommission,
    }).accountsStrict({
        liquidityPool: liquidityPool,
        admin: admin,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
      },).instruction();

  return {ix};
  // return liquidityPool;
};
