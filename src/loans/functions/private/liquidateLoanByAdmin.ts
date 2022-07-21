import { web3, utils } from '@project-serum/anchor';

import { getMetaplexEditionPda, returnAnchorProgram } from '../../helpers';
import { findAssociatedTokenAddress } from '../../../common';
import { METADATA_PROGRAM_PUBKEY } from '../../constants';

type LiquidateLoanByAdmin = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  liquidator: web3.PublicKey;
  user: web3.PublicKey;
  loan: web3.PublicKey;
  nftMint: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;

export const liquidateLoanByAdmin: LiquidateLoanByAdmin = async ({
  programId,
  connection,
  liquidator,
  user,
  loan,
  nftMint,
  sendTxn,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);
  const nftUserTokenAccount = await findAssociatedTokenAddress(user, nftMint);
  const nftLiquidatorTokenAccount = await findAssociatedTokenAddress(liquidator, nftMint);
  const editionId = getMetaplexEditionPda(nftMint);

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
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
      metadataProgram: METADATA_PROGRAM_PUBKEY,
      editionInfo: editionId,
    },
  });

  const transaction = new web3.Transaction().add(instruction);
  await sendTxn(transaction);
};
