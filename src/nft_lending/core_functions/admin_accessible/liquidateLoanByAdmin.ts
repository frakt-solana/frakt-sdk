import anchor from '@project-serum/anchor';
import { PublicKey, Transaction } from '@solana/web3.js';
import { Edition, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';

import { returnAnchorProgram } from '../../contract_model/accounts';
import { findAssociatedTokenAddress } from '../../../common/utils';

const liquidateLoanByAdmin = async (
  programId: PublicKey,
  provider: anchor.Provider,
  liquidator: PublicKey,
  user: PublicKey,
  loan: PublicKey,
  nftMint: PublicKey,
  sendTxn: (transaction: Transaction) => Promise<void>
): Promise<any> => {
  const encoder = new TextEncoder();
  const program = await returnAnchorProgram(programId, provider);
  const nftUserTokenAccount = await findAssociatedTokenAddress(user, nftMint);
  const nftLiquidatorTokenAccount = await findAssociatedTokenAddress(liquidator, nftMint);
  const editionId = await Edition.getPDA(nftMint);

  const [communityPoolsAuthority, bumpPoolsAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    program.programId,
  );

  const instruction = program.instruction.liquidateLoanByAdmin(bumpPoolsAuth, {
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

  const transaction = new Transaction().add(instruction);
  await sendTxn(transaction);
};

export default liquidateLoanByAdmin;
