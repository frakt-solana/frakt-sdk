import * as anchor from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';
import * as accounts from '../../contract_model/accounts';
const encoder = new TextEncoder();

export async function closeLoanByAdmin({
  programId,
  provider,
  loan,
  admin,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  loan: PublicKey;
  admin: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);
  const [communityPoolsAuthority, bumpPoolsAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    programId,
  );

  const ix = await program.methods
    .closeLoan(bumpPoolsAuth)
    .accounts({
      loan: loan,
      admin: admin,
      communityPoolsAuthority,
    })
    .instruction();

  const transaction = new Transaction().add(ix);

  await sendTxn(transaction);
}
