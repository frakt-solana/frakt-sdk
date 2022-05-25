import * as anchor from '@project-serum/anchor';
export {
  AllAccounts,
  CollectionInfoView,
  LiquidityPoolView,
  DepositView,
  LoanView,
} from '../../contract_model/accounts';
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import * as accounts from '../../contract_model/accounts';
import * as utils from '../../../common/utils';
import { Edition, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';

const encoder = new TextEncoder();

export async function liquidateLoanByAdmin({
  programId,
  provider,
  liquidator,
  user,
  loan,
  nftMint,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  liquidator: PublicKey;
  user: PublicKey;
  loan: PublicKey;
  nftMint: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  const program = await accounts.returnAnchorProgram(programId, provider);
  const [communityPoolsAuthority, bumpPoolsAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    program.programId,
  );

  const nftUserTokenAccount = await utils.findAssociatedTokenAddress(user, nftMint);
  const instructions: TransactionInstruction[] = [];
  const nftLiquidatorTokenAccount = await utils.findAssociatedTokenAddress(liquidator, nftMint);
  const editionId = await Edition.getPDA(nftMint);
  const instr = program.instruction.liquidateLoanByAdmin(bumpPoolsAuth, {
    accounts: {
      loan: loan,
      liquidator: liquidator,
      nftMint: nftMint,
      nftLiquidatorTokenAccount: nftLiquidatorTokenAccount,
      user: user,
      nftUserTokenAccount: nftUserTokenAccount,
      communityPoolsAuthority,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
      metadataProgram: MetadataProgram.PUBKEY,
      editionInfo: editionId,
    },
  });

  const transaction = new Transaction().add(instr);
  await sendTxn(transaction);
}
