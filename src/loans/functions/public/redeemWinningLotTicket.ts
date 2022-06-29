import { web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';
import { findAssociatedTokenAddress } from '../../../common';
import { getMetaplexEditionPda } from '../..';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID } from '../../../common/constants';
import { METADATA_PROGRAM_PUBKEY } from '../../constants';

type RedeemWinningLotTicket = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  admin: web3.PublicKey;
  liquidityPool: web3.PublicKey;
  royaltyAddress: web3.PublicKey;
  lotTicket: web3.PublicKey;
  collectionInfo: web3.PublicKey;
  liquidationLot: web3.PublicKey;
  loan: web3.PublicKey;
  nftMint: web3.PublicKey;
  sendTxn: (transaction: web3.Transaction) => Promise<void>;
}) => Promise<void>;

export const redeemWinningLotTicket: RedeemWinningLotTicket = async ({
  programId,
  connection,
  user,
  liquidationLot,
  liquidityPool,
  collectionInfo,
  loan,
  admin,
  lotTicket,
  royaltyAddress,
  nftMint,
  sendTxn,
}) => {
  const encoder = new TextEncoder();

  const program = returnAnchorProgram(programId, connection);

  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    program.programId,
  );
  const [liqOwner, liqOwnerBump] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.toBuffer()],
    program.programId,
  );
  const nftUserTokenAccount = await findAssociatedTokenAddress(user, nftMint);

  const vaultNftTokenAccount = await findAssociatedTokenAddress(communityPoolsAuthority, nftMint);
  const editionId = getMetaplexEditionPda(nftMint);
  const instr = program.instruction.redeemWinningLotTicket(bumpPoolsAuth, {
    accounts: {
      loan: loan,
      liquidityPool,
      liquidationLot,
      lotTicket,
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
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      metadataProgram: METADATA_PROGRAM_PUBKEY,
      editionInfo: editionId,
      rent: web3.SYSVAR_RENT_PUBKEY,
    },
  });

  const transaction = new web3.Transaction().add(instr);

  await sendTxn(transaction);
};
