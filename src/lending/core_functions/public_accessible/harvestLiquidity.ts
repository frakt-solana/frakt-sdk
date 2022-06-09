import * as anchor from '@project-serum/anchor';
import { Transaction } from '@solana/web3.js';

import { HarvestLiquidity } from '../../types';
import { returnAnchorProgram } from '../../contract_model/accounts';

export const harvestLiquidity = async (params: HarvestLiquidity): Promise<any> => {
  const { programId, provider, liquidityPool, user, sendTxn } = params;

  const encoder = new TextEncoder();
  const program = await returnAnchorProgram(programId, provider);

  const [liqOwner] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );

  const [deposit, depositBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('deposit'), liquidityPool.toBuffer(), user.toBuffer()],
    program.programId,
  );

  const instruction = program.instruction.harvestLiquidity(depositBump, {
    accounts: {
      liquidityPool,
      user,
      deposit,
      liqOwner,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction);
};
