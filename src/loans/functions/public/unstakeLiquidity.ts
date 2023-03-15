import { BN, web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type UnstakeLiquidity = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  liquidityPool: web3.PublicKey;
  user: web3.PublicKey;
  amount: BN | number;
  adminPubkey: web3.PublicKey;
}) => Promise<{ix: web3.TransactionInstruction}>;

export const unstakeLiquidity: UnstakeLiquidity = async ({
  programId,
  connection,
  liquidityPool,
  adminPubkey,
  user,
  amount,
}) => {
  const encoder = new TextEncoder();
  const program = await returnAnchorProgram(programId, connection);

  const [liqOwner] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );

  const [deposit, depositBump] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('deposit'), liquidityPool.toBuffer(), user.toBuffer()],
    program.programId,
  );

  const ix = await program.methods.unstakeLiquidity(depositBump, new BN(amount)).accountsStrict({
      liquidityPool,
      user,
      deposit,
      liqOwner,
      systemProgram: web3.SystemProgram.programId,
      admin: adminPubkey,
    }).instruction();

  return {ix}
};
