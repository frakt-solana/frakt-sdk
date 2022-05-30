import anchor from '@project-serum/anchor';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { Edition, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';

import { returnAnchorProgram } from '../../contract_model/accounts';
import { findAssociatedTokenAddress } from '../../../common/utils';

interface IReturn {
  loanPubkey: any;
}

const proposeLoan = async (
  programId: PublicKey,
  provider: anchor.Provider,
  user: PublicKey,
  nftMint: PublicKey,
  proposedNftPrice: number | anchor.BN,
  isPriceBased: boolean,
  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>
): Promise<IReturn> => {
  const encoder = new TextEncoder();
  const program = await returnAnchorProgram(programId, provider);
  const loan = Keypair.generate();

  const [communityPoolsAuthority, bumpPoolsAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    programId,
  );

  const editionId = await Edition.getPDA(nftMint);
  const nftUserTokenAccount = await findAssociatedTokenAddress(user, nftMint);

  const instruction = program.instruction.proposeLoan(bumpPoolsAuth, isPriceBased, new anchor.BN(proposedNftPrice), {
    accounts: {
      loan: loan.publicKey,
      user: user,
      nftUserTokenAccount,
      nftMint: nftMint,
      communityPoolsAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
      metadataProgram: MetadataProgram.PUBKEY,
      editionInfo: editionId,
    },
  });
  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction, [loan]);

  return { loanPubkey: loan.publicKey };
};

export default proposeLoan;
