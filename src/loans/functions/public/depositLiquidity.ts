import { BN, web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type DepositLiquidityIx = (params: {
  programId: web3.PublicKey;
  liquidityPool: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  amount: number;
}) => Promise<{deposit: web3.PublicKey, ix: web3.TransactionInstruction}>;

export const depositLiquidity: DepositLiquidityIx = async ({
  programId,
  liquidityPool,
  connection,
  user,
  amount,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);

  const [liqOwner] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );

  const [deposit] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('deposit'), liquidityPool.toBuffer(), user.toBuffer()],
    program.programId,
  );

  const ix = await program.methods.depositLiquidity(new BN(amount)).accountsStrict({
      liquidityPool: liquidityPool,
      liqOwner,
      deposit,
      user: user,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
    }).instruction();

  return {deposit, ix};
};
