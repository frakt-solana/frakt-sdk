import * as anchor from '@project-serum/anchor';

import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import * as accounts from './../../contract_model/accounts';
import { Edition, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
const encoder = new TextEncoder();

export async function rejectLoanByAdmin({
  programId,
  provider,
  loan,
  nftUserTokenAccount,
  admin,
  user,
  nftMint,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  loan: PublicKey;
  nftUserTokenAccount: PublicKey;
  admin: PublicKey;
  user: PublicKey;
  nftMint: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);
  const [communityPoolsAuthority, bumpPoolsAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    programId,
  );

  const editionId = await Edition.getPDA(nftMint);
  const ix = program.instruction.rejectLoanByAdmin(bumpPoolsAuth, {
    accounts: {
      loan: loan,
      admin: admin,
      nftMint: nftMint,
      nftUserTokenAccount: nftUserTokenAccount,
      user: user,
      communityPoolsAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      metadataProgram: MetadataProgram.PUBKEY,
      editionInfo: editionId,
    },
  });

  const transaction = new Transaction().add(ix);

  await sendTxn(transaction);
}
