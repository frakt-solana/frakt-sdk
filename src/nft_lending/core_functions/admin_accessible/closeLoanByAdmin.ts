import anchor from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';

import { returnAnchorProgram } from '../../contract_model/accounts';

interface IParams {
  programId: PublicKey;
  provider: anchor.Provider;
  loan: PublicKey;
  admin: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}

const encoder = new TextEncoder();

const closeLoanByAdmin = async ({
  programId,
  provider,
  loan,
  admin,
  sendTxn,
}: IParams): Promise<any> => {
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
