import { BN, web3 } from '@project-serum/anchor';
import { Edition, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';

import { ProposeLoan } from '../../types';
import { returnAnchorProgram } from '../../contract_model/accounts';
import { findAssociatedTokenAddress } from '../../../common';

interface IReturn {
  loanPubkey: any;
}

export const proposeLoan = async (params: ProposeLoan): Promise<IReturn> => {
  const { programId, provider, user, nftMint, proposedNftPrice, isPriceBased, sendTxn } = params;

  const encoder = new TextEncoder();
  const program = await returnAnchorProgram(programId, provider);
  const loan = web3.Keypair.generate();

  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    programId,
  );

  const editionId = await Edition.getPDA(nftMint);
  const nftUserTokenAccount = await findAssociatedTokenAddress(user, nftMint);

  const instruction = program.instruction.proposeLoan(bumpPoolsAuth, isPriceBased, new BN(proposedNftPrice), {
    accounts: {
      loan: loan.publicKey,
      user: user,
      nftUserTokenAccount,
      nftMint: nftMint,
      communityPoolsAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
      metadataProgram: MetadataProgram.PUBKEY,
      editionInfo: editionId,
    },
  });
  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction, [loan]);

  return { loanPubkey: loan.publicKey };
};
