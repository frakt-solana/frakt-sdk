import anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Transaction, SystemProgram, TransactionInstruction } from '@solana/web3.js';

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
    provider,
    sendTxn,
  } = params;

  const encoder = new TextEncoder();
  const instructions = [];
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const lotteryTicketAccount = anchor.web3.Keypair.generate();
  const [leaderboardAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );

  const [vaultOwnerPda, bumpPda] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  const vaultTokenAccountOutput = await findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  const [mainRouter] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), tokenMintInputFusion.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );

  const [configOutput] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouter.toBuffer()],
    fusionProgramId,
  );

  const admin = new PublicKey(adminAddress);
  const adminTokenAccount = await findAssociatedTokenAddress(admin, fractionMint);

  const [boardEntry] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPubkey.toBuffer()],
    programId,
  );

  const signers = [lotteryTicketAccount];

  const instruction = program.instruction.getLotteryTicket(bumpPda, {
    accounts: {
      lotteryTicket: lotteryTicketAccount.publicKey,
      communityPool: communityPool,
      user: userPubkey,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
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

  const transaction = new Transaction();

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
    provider,
  } = params;

  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const lotteryTicketAccount = anchor.web3.Keypair.generate();
  const [leaderboardAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );

  let [vaultOwnerPda, bumpPda] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  const instructions: TransactionInstruction[] = [];

  const vaultTokenAccountOutput = await findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  const [mainRouter] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), tokenMintInputFusion.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );

  const [configOutput] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouter.toBuffer()],
    fusionProgramId,
  );

  const admin = new PublicKey(adminAddress);
  const adminTokenAccount = await findAssociatedTokenAddress(admin, fractionMint);
  const main = await provider.connection.getAccountInfo(mainRouter);

  if (!main) {
    vaultOwnerPda = tokenMintInputFusion;
  }

  const [boardEntry] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPubkey.toBuffer()],
    programId,
  );

  const signers = [lotteryTicketAccount];

  const instruction = program.instruction.getLotteryTicket(bumpPda, {
    accounts: {
      lotteryTicket: lotteryTicketAccount.publicKey,
      communityPool: communityPool,
      user: userPubkey,
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
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
