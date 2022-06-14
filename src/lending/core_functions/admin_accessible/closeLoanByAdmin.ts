import { web3 } from'@project-serum/anchor';

import { CloseLoanByAdmin } from '../../types';
import { returnAnchorProgram } from '../../contract_model/accounts';

export const closeLoanByAdmin = async (params: CloseLoanByAdmin): Promise<any> => {
  const { programId, provider, loan, admin, sendTxn } = params;

  const encoder = new TextEncoder();
  const program = await returnAnchorProgram(programId, provider);

  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    programId,
  );

  const instruction = await program.methods
    .closeLoan(bumpPoolsAuth)
    .accounts({
      loan: loan,
      admin: admin,
      communityPoolsAuthority,
    })
    .instruction();

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction);
};
