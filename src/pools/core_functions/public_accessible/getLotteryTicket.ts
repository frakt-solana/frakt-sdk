import { web3 } from '@project-serum/anchor';

import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '../../../common/constants';
import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { findAssociatedTokenAddress } from '../../../common';
import { GetLotteryTicket, GetLotteryTicketIx } from '../../types';

export const getLotteryTicket = async (params: GetLotteryTicket) => {
  const {
    communityPool,
    fractionMint,
    userFractionsTokenAccount,
    fusionProgramId,
    tokenMintInputFusion,
    feeConfig,
    adminAddress,
    programId,
    userPubkey,
    connection,
    sendTxn,
  } = params;

  const encoder = new TextEncoder();
  const instructions = [];
  const program = await returnCommunityPoolsAnchorProgram(programId, connection);

  const lotteryTicketAccount = web3.Keypair.generate();
  const [leaderboardAccount] = await web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );

  const [vaultOwnerPda, bumpPda] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  const vaultTokenAccountOutput = await findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  const [mainRouter] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), tokenMintInputFusion.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );

  const [configOutput] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouter.toBuffer()],
    fusionProgramId,
  );

  const admin = new web3.PublicKey(adminAddress);
  const adminTokenAccount = await findAssociatedTokenAddress(admin, fractionMint);

  const [boardEntry] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPubkey.toBuffer()],
    programId,
  );

  const signers = [lotteryTicketAccount];

  const instruction = program.instruction.getLotteryTicket(bumpPda, {
    accounts: {
      lotteryTicket: lotteryTicketAccount.publicKey,
      communityPool: communityPool,
      user: userPubkey,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
      fractionMint: fractionMint,
      userFractionsTokenAccount: userFractionsTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenMintInput: tokenMintInputFusion,
      fusionVaultOwnerPda: vaultOwnerPda,
      vaultTokenAccountOutput: vaultTokenAccountOutput,
      mainRouter: mainRouter,
      configOutput: configOutput,
      fusionId: fusionProgramId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      boardEntry,
      feeConfig: feeConfig,
      leaderboardAccount,
      admin,
      adminTokenAccount,
    },
    signers: signers,
  });

  const transaction = new web3.Transaction();

  for (const instruction of instructions) {
    transaction.add(instruction);
  }

  transaction.add(instruction);

  await sendTxn(transaction, signers);

  return { lotteryTicketPubkey: lotteryTicketAccount.publicKey };
};

export const getLotteryTicketIx = async (params: GetLotteryTicketIx) => {
  const {
    communityPool,
    fractionMint,
    userFractionsTokenAccount,
    fusionProgramId,
    tokenMintInputFusion,
    feeConfig,
    adminAddress,
    programId,
    userPubkey,
    connection,
  } = params;

  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, connection);

  const lotteryTicketAccount = web3.Keypair.generate();
  const [leaderboardAccount] = await web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );
  const [leaderboardAuthority, bumpLead] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('leaderBoardProgramAuthority'), programId.toBuffer()],
    program.programId,
  );
  let [vaultOwnerPda, bumpPda] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  const instructions: web3.TransactionInstruction[] = [];

  let vaultTokenAccountOutput = await findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  const [mainRouter] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), tokenMintInputFusion.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );

  const [configOutput] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouter.toBuffer()],
    fusionProgramId,
  );

  const admin = new web3.PublicKey(adminAddress);
  const adminTokenAccount = await findAssociatedTokenAddress(admin, fractionMint);
  const main = await connection.getAccountInfo(mainRouter);

  if (!main) {
    vaultTokenAccountOutput = adminTokenAccount;
    vaultOwnerPda = tokenMintInputFusion;
  }

  const [boardEntry] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPubkey.toBuffer()],
    programId,
  );

  const signers = [lotteryTicketAccount];

  const instruction = program.instruction.getLotteryTicket(bumpPda, {
    accounts: {
      lotteryTicket: lotteryTicketAccount.publicKey,
      communityPool: communityPool,
      user: userPubkey,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
      fractionMint: fractionMint,
      userFractionsTokenAccount: userFractionsTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenMintInput: tokenMintInputFusion,
      fusionVaultOwnerPda: vaultOwnerPda,
      vaultTokenAccountOutput: vaultTokenAccountOutput,
      mainRouter: mainRouter,
      configOutput: configOutput,
      fusionId: fusionProgramId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      boardEntry,
      feeConfig: feeConfig,
      leaderboardAccount,
      admin,
      adminTokenAccount,
    },
    signers: signers,
  });

  instructions.push(instruction);

  return { lotteryTicketPubkey: lotteryTicketAccount.publicKey, instructions, signers };
};
