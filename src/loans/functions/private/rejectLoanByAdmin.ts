import { AnchorProvider, web3 } from '@project-serum/anchor';
import { Edition, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/src/utils/token';

import { returnAnchorProgram } from '../../helpers';

type RejectLoanByAdmin = (params: {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  loan: web3.PublicKey;
  nftUserTokenAccount: web3.PublicKey;
  admin: web3.PublicKey;
  user: web3.PublicKey;
  nftMint: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;

export const rejectLoanByAdmin: RejectLoanByAdmin = async ({
  programId,
  provider,
  loan,
  nftUserTokenAccount,
  admin,
  user,
  nftMint,
  sendTxn,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, provider);
  const editionId = await Edition.getPDA(nftMint);

  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
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
      systemProgram: web3.SystemProgram.programId,
      metadataProgram: MetadataProgram.PUBKEY,
      editionInfo: editionId,
    },
  });

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction);
};
