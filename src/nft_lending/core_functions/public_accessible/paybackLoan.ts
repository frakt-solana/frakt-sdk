import * as anchor from '@project-serum/anchor';
export {
  AllAccounts,
  CollectionInfoView,
  LiquidityPoolView,
  DepositView,
  LoanView,
} from './../../contract_model/accounts';
import { PublicKey, Transaction } from '@solana/web3.js';
import * as accounts from './../../contract_model/accounts';
import * as utils from './../../../common/utils';
import { Edition, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';

const encoder = new TextEncoder();

export async function paybackLoan({
  programId,
  provider,
  user,
  admin,

  loan,
  nftMint,
  liquidityPool,
  collectionInfo,
  royaltyAddress,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  user: PublicKey;
  admin: PublicKey;

  loan: PublicKey;
  nftMint: PublicKey;
  liquidityPool: PublicKey;
  collectionInfo: PublicKey;
  royaltyAddress: PublicKey;

  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);

  const [communityPoolsAuthority, bumpPoolsAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    program.programId,
  );
  const [liqOwner, liqOwnerBump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );
  const nftUserTokenAccount = await utils.findAssociatedTokenAddress(user, nftMint);
  const editionId = await Edition.getPDA(nftMint);
  const instr = program.instruction.paybackLoan(bumpPoolsAuth, {
    accounts: {
      loan: loan,
      liquidityPool: liquidityPool,
      collectionInfo,
      user: user,
      admin,
      nftMint: nftMint,
      nftUserTokenAccount: nftUserTokenAccount,
      royaltyAddress,
      liqOwner,
      communityPoolsAuthority,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      // associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      metadataProgram: MetadataProgram.PUBKEY,
      editionInfo: editionId,
    },
  });

  const transaction = new Transaction().add(instr);

  await sendTxn(transaction);
}
