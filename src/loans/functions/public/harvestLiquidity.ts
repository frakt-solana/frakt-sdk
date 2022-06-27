import { AnchorProvider, web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type HarvestLiquidity = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  liquidityPool: web3.PublicKey;
  user: web3.PublicKey;
  adminPubkey: web3.PublicKey;

  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;

export const harvestLiquidity: HarvestLiquidity = async ({
  programId,
  adminPubkey,
  connection,
  liquidityPool,
  user,
  sendTxn,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);

  const [liqOwner] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );

  const [deposit, depositBump] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('deposit'), liquidityPool.toBuffer(), user.toBuffer()],
    program.programId,
  );

  const instruction = program.instruction.harvestLiquidity(depositBump, {
    accounts: {
      liquidityPool,
      user,
      deposit,
      liqOwner,
      systemProgram: web3.SystemProgram.programId,
      admin: adminPubkey,
    },
  });

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction);
};
