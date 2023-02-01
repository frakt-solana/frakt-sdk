import { BN, web3, utils } from '@project-serum/anchor';

import { findAssociatedTokenAddress } from '../../../common';
import { METADATA_PROGRAM_PUBKEY } from '../../constants';
import { getMetaplexEditionPda, returnAnchorProgram } from '../../helpers';

type ProposeLoanIx = (params: {
  programId: web3.PublicKey;
  admin: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  nftMint: web3.PublicKey;
  proposedNftPrice: BN;
  loanToValue: BN;
  isPriceBased: boolean;
}) => Promise<{ loan: web3.Keypair, ix: web3.TransactionInstruction }>;

export const proposeLoanIx: ProposeLoanIx = async ({
  proposedNftPrice,
  programId,
  connection,
  user,
  nftMint,
  isPriceBased,
  loanToValue,
  admin,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const loan = web3.Keypair.generate();
  const encoder = new TextEncoder();
  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    programId,
  );

  const editionId = getMetaplexEditionPda(nftMint);

  const nftUserTokenAccount = await findAssociatedTokenAddress(user, nftMint);
  const ix = program.instruction.proposeLoan(bumpPoolsAuth, isPriceBased, proposedNftPrice, loanToValue, {
    accounts: {
      loan: loan.publicKey,
      user: user,
      nftUserTokenAccount,
      nftMint: nftMint,
      communityPoolsAuthority,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
      metadataProgram: METADATA_PROGRAM_PUBKEY,
      admin,
      editionInfo: editionId,
    },
    // signers: [loan]
  });

  return { loan: loan, ix };
};
