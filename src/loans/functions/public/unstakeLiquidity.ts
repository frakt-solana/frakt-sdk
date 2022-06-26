import { AnchorProvider, BN, web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type UnstakeLiquidity = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  liquidityPool: web3.PublicKey;
  user: web3.PublicKey;
  amount: BN | number;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;

export const unstakeLiquidity: UnstakeLiquidity = async ({
  programId,
  connection,
  liquidityPool,
  user,
  amount,
  sendTxn,
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

  const instruction = program.instruction.unstakeLiquidity(depositBump, new BN(amount), {
    accounts: {
      liquidityPool,
      user,
      deposit,
      liqOwner,
      systemProgram: web3.SystemProgram.programId,
    },
  });

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction);
};
