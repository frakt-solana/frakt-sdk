import { AnchorProvider, web3 } from '@project-serum/anchor';
import { Edition, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/src/utils/token';

import { returnAnchorProgram } from '../../helpers';
import { findAssociatedTokenAddress } from '../../../common';

type LiquidateLoanByAdmin = (params: {
  programId: web3.PublicKey;
  provider: AnchorProvider;
  liquidator: web3.PublicKey;
  user: web3.PublicKey;
  loan: web3.PublicKey;
  nftMint: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;

export const liquidateLoanByAdmin: LiquidateLoanByAdmin = async ({
  programId,
  provider,
  liquidator,
  user,
  loan,
  nftMint,
  sendTxn,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, provider);
  const nftUserTokenAccount = await findAssociatedTokenAddress(user, nftMint);
  const nftLiquidatorTokenAccount = await findAssociatedTokenAddress(liquidator, nftMint);
  const editionId = await Edition.getPDA(nftMint);

  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
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
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
      metadataProgram: MetadataProgram.PUBKEY,
      editionInfo: editionId,
    },
  });

  const transaction = new web3.Transaction().add(instruction);
  await sendTxn(transaction);
};
