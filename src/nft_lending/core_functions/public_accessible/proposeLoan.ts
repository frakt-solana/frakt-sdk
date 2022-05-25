import * as anchor from '@project-serum/anchor';
export {
  AllAccounts,
  CollectionInfoView,
  LiquidityPoolView,
  DepositView,
  LoanView,
} from './../../contract_model/accounts';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import * as accounts from './../../contract_model/accounts';
import * as utils from './../../../common/utils';
import { Edition, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
const encoder = new TextEncoder();

export async function proposeLoan({
  proposedNftPrice,
  programId,
  provider,
  user,
  nftMint,
  isPriceBased,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  user: PublicKey;
  nftMint: PublicKey;
  proposedNftPrice: number | anchor.BN;
  isPriceBased: boolean;

  sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);
  const loan = Keypair.generate();
  const [communityPoolsAuthority, bumpPoolsAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    programId,
  );

  const editionId = await Edition.getPDA(nftMint);

  const nftUserTokenAccount = await utils.findAssociatedTokenAddress(user, nftMint);
  const ix = program.instruction.proposeLoan(bumpPoolsAuth, isPriceBased, new anchor.BN(proposedNftPrice), {
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
  const transaction = new Transaction().add(ix);

  await sendTxn(transaction, [loan]);

  return { loanPubkey: loan.publicKey };
}
