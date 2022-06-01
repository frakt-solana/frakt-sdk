import anchor from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';

import { returnAnchorProgram } from '../../contract_model/accounts';

export interface CloseLoanByAdmin {
  programId: PublicKey,
  provider: anchor.Provider,
  loan: PublicKey,
  admin: PublicKey,
  sendTxn: (transaction: Transaction) => Promise<void>
}

const closeLoanByAdmin = async (params: CloseLoanByAdmin): Promise<any> => {
  const {
    programId,
    provider,
    loan,
    admin,
    sendTxn
  } = params;

  const encoder = new TextEncoder();
  const program = await returnAnchorProgram(programId, provider);

  const [communityPoolsAuthority, bumpPoolsAuth] = await anchor.web3.PublicKey.findProgramAddress(
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

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction);
};

export default closeLoanByAdmin;
