import { AnchorProvider, web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type CloseLoanByAdmin = (params: {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  loan: web3.PublicKey;
  admin: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;

export const closeLoanByAdmin: CloseLoanByAdmin = async ({ programId, provider, loan, admin, sendTxn }) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, provider);

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
