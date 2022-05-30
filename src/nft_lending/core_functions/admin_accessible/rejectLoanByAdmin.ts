import anchor from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';
import { Edition, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';

import { returnAnchorProgram } from '../../contract_model/accounts';

const rejectLoanByAdmin = async (
  programId: PublicKey,
  provider: anchor.Provider,
  loan: PublicKey,
  nftUserTokenAccount: PublicKey,
  admin: PublicKey,
  user: PublicKey,
  nftMint: PublicKey,
  sendTxn: (transaction: Transaction) => Promise<void>
): Promise<any> => {
  const encoder = new TextEncoder();
  const program = await returnAnchorProgram(programId, provider);
  const editionId = await Edition.getPDA(nftMint);

  const [communityPoolsAuthority, bumpPoolsAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    programId,
  );

  const instruction = program.instruction.rejectLoanByAdmin(bumpPoolsAuth, {
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

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction);
};

export default rejectLoanByAdmin;
