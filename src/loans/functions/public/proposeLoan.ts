import { AnchorProvider, BN, web3 } from '@project-serum/anchor';
import { Edition, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/src/utils/token';

import { findAssociatedTokenAddress } from '../../../common';
import { returnAnchorProgram } from '../../helpers';

type ProposeLoan = (params: {
  programId: web3.PublicKey;
  admin: web3.PublicKey;
  provider: AnchorProvider;
  user: web3.PublicKey;
  nftMint: web3.PublicKey;
  proposedNftPrice: number | BN;
  loanToValue: BN;
  isPriceBased: boolean;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}) => Promise<{ loanPubkey: web3.PublicKey }>;

export const proposeLoan: ProposeLoan = async ({
  proposedNftPrice,
  programId,
  provider,
  user,
  nftMint,
  isPriceBased,
  loanToValue,
  admin,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, provider);
  const loan = web3.Keypair.generate();
  const encoder = new TextEncoder();
  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    programId,
  );

  const editionId = await Edition.getPDA(nftMint);

  const nftUserTokenAccount = await findAssociatedTokenAddress(user, nftMint);
  const ix = program.instruction.proposeLoan(bumpPoolsAuth, isPriceBased, proposedNftPrice, loanToValue, {
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
      admin,
      editionInfo: editionId,
    },
    // signers: [loan]
  });
  const transaction = new web3.Transaction().add(ix);

  await sendTxn(transaction, [loan]);

  return { loanPubkey: loan.publicKey };
};
