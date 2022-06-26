import { AnchorProvider, web3, utils } from '@project-serum/anchor';

import { METADATA_PROGRAM_PUBKEY } from '../../constants';
import { getMetaplexEditionPda, returnAnchorProgram } from '../../helpers';

type RejectLoanByAdmin = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  loan: web3.PublicKey;
  nftUserTokenAccount: web3.PublicKey;
  admin: web3.PublicKey;
  user: web3.PublicKey;
  nftMint: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;

export const rejectLoanByAdmin: RejectLoanByAdmin = async ({
  programId,
  connection,
  loan,
  nftUserTokenAccount,
  admin,
  user,
  nftMint,
  sendTxn,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);
  const editionId = getMetaplexEditionPda(nftMint);

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
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      metadataProgram: METADATA_PROGRAM_PUBKEY,
      editionInfo: editionId,
    },
  });

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction);
};
