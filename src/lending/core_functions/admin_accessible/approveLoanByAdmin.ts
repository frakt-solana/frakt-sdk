import * as anchor from '@project-serum/anchor';
import { Transaction } from '@solana/web3.js';

import { ApproveLoanByAdmin } from '../../types';
import { returnAnchorProgram } from '../../contract_model/accounts';

export const approveLoanByAdmin = async (params: ApproveLoanByAdmin): Promise<any> => {
  const { programId, provider, admin, loan, liquidityPool, collectionInfo, nftPrice, discount, user, sendTxn } = params;

  const encoder = new TextEncoder();
  const program = await returnAnchorProgram(programId, provider);

  const [liqOwner] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    programId,
  );

  const instruction = program.instruction.approveLoanByAdmin(new anchor.BN(nftPrice), new anchor.BN(discount), {
    accounts: {
      loan: loan,
      user,
      liquidityPool,
      liqOwner,
      collectionInfo,
      admin,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction);
};
