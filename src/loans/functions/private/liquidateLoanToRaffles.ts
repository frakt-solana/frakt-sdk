import { web3, utils, BN } from '@project-serum/anchor';

import { getMetaplexEditionPda, returnAnchorProgram } from '../../helpers';
import { findAssociatedTokenAddress } from '../../../common';
import { METADATA_PROGRAM_PUBKEY } from '../../constants';

type LiquidateLoanToRaffles = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  liquidator: web3.PublicKey;

  gracePeriod: number;
  loan: web3.PublicKey;
  nftMint: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction, signers: web3.Keypair[]) => Promise<void>;
}) => Promise<web3.PublicKey>;

export const liquidateLoanToRaffles: LiquidateLoanToRaffles = async ({
  programId,
  connection,
  user,
  liquidator,
  gracePeriod,
  loan,
  nftMint,
  sendTxn,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);

  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    program.programId,
  );

  const nftUserTokenAccount = await findAssociatedTokenAddress(user, nftMint);
  const vaultNftTokenAccount = await findAssociatedTokenAddress(communityPoolsAuthority, nftMint);
  const editionId = getMetaplexEditionPda(nftMint);
  const liquidationLot = web3.Keypair.generate();

  const ix = program.instruction.liquidateNftToRaffles(bumpPoolsAuth, new BN(gracePeriod), {
    accounts: {
      loan,
      liquidationLot: liquidationLot.publicKey,
      user,
      liquidator: liquidator,
      nftMint,
      vaultNftTokenAccount,
      nftUserTokenAccount,
      communityPoolsAuthority,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
      metadataProgram: METADATA_PROGRAM_PUBKEY,
      editionInfo: editionId,
      rent: web3.SYSVAR_RENT_PUBKEY,
    },
  });
  const transaction = new web3.Transaction().add(ix);

  await sendTxn(transaction, [liquidationLot]);
  return liquidationLot.publicKey;
};
