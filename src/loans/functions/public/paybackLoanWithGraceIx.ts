import { web3, utils } from '@project-serum/anchor';

import { getMetaplexEditionPda, returnAnchorProgram } from '../../helpers';
import { createAssociatedTokenAccountInstruction, findAssociatedTokenAddress } from '../../../common';
import { METADATA_PROGRAM_PUBKEY } from '../../constants';

type PaybackLoanWithGraceIx = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  admin: web3.PublicKey;
  liquidationLot: web3.PublicKey;

  loan: web3.PublicKey;
  nftMint: web3.PublicKey;
  liquidityPool: web3.PublicKey;
  collectionInfo: web3.PublicKey;
  royaltyAddress: web3.PublicKey;
}) => Promise<{ixs: web3.TransactionInstruction[]}>;

export const paybackLoanWithGraceIx: PaybackLoanWithGraceIx = async ({
  programId,
  connection,
  user,
  admin,
  liquidationLot,
  loan,
  nftMint,
  liquidityPool,
  collectionInfo,
  royaltyAddress,
}) => {
  const encoder = new TextEncoder();
  const program = returnAnchorProgram(programId, connection);

  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    program.programId,
  );

  const [liqOwner] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );

  const nftUserTokenAccount = await findAssociatedTokenAddress(user, nftMint);
  const vaultNftTokenAccount = await findAssociatedTokenAddress(communityPoolsAuthority, nftMint);

  let instructions: web3.TransactionInstruction[] = [];
  const nftUserTokenAccountInfo = await connection.getAccountInfo(nftUserTokenAccount);
  if (!nftUserTokenAccountInfo)
    instructions = instructions.concat(
      createAssociatedTokenAccountInstruction(nftUserTokenAccount, user, user, nftMint),
    );
  const editionId = getMetaplexEditionPda(nftMint);

  const mainIx = program.instruction.paybackWithGrace(bumpPoolsAuth, {
    accounts: {
      loan: loan,
      liquidityPool,
      liquidationLot,
      collectionInfo,
      user: user,
      admin,
      nftMint: nftMint,
      nftUserTokenAccount: nftUserTokenAccount,
      royaltyAddress,
      liqOwner,
      communityPoolsAuthority,
      vaultNftTokenAccount,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
      metadataProgram: METADATA_PROGRAM_PUBKEY,
      editionInfo: editionId,
    },
  });

  instructions = instructions.concat(mainIx);

  return {ixs: instructions}
};
