import { web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type InitializePriceBasedLiquidityPool = (params: {
  programId: web3.PublicKey;
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
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}) => Promise<web3.PublicKey>;

export const initializePriceBasedLiquidityPool: InitializePriceBasedLiquidityPool = async ({
  programId,
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
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const encoder = new TextEncoder();

  const liquidityPool = web3.Keypair.generate();
  const [liqOwner, liqOwnerBump] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.publicKey.toBuffer()],
    program.programId,
  );
  const ix = await program.methods.initializePriceBasedLiquidityPool(
    {
      id: id,
      baseBorrowRate: baseBorrowRate,
      variableSlope1: variableSlope1,
      variableSlope2: variableSlope2,
      utilizationRateOptimal: utilizationRateOptimal,
      reserveFactor: reserveFactor,
      depositCommission,
      borrowCommission,
    }).accounts( {
        liquidityPool: liquidityPool.publicKey,
        liqOwner,
        admin: admin,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
      }).instruction();

  const transaction = new web3.Transaction().add(ix);

  await sendTxn(transaction, [liquidityPool]);
  return liquidityPool.publicKey;
};
