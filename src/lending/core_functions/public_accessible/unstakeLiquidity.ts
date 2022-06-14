import { BN, web3 } from '@project-serum/anchor';

import { UnstakeLiquidity } from '../../types';
import { returnAnchorProgram } from '../../contract_model/accounts';

export const unstakeLiquidity = async (params: UnstakeLiquidity): Promise<any> => {
  const { programId, provider, liquidityPool, user, amount, sendTxn } = params;

  const encoder = new TextEncoder();
  const program = await returnAnchorProgram(programId, provider);

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
