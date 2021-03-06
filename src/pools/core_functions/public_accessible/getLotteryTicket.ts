import { web3, utils } from '@project-serum/anchor';

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
  const [vaultOwnerPda, bumpPda] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  const vaultTokenAccountOutput = await findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  const [mainRouterLp] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), tokenMintInputFusion.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );

  const [configOutputLp] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouterLp.toBuffer()],
    fusionProgramId,
  );

  const [mainRouterIs] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), fractionMint.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );

  const [configOutputIs] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouterIs.toBuffer()],
    fusionProgramId,
  );

  const admin = new web3.PublicKey(adminAddress);
  const adminTokenAccount = await findAssociatedTokenAddress(admin, fractionMint);

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
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      tokenMintInput: tokenMintInputFusion,
      fusionVaultOwnerPda: vaultOwnerPda,
      vaultTokenAccountOutput: vaultTokenAccountOutput,
      mainRouterLp,
      configOutputLp,
      mainRouterIs,
      configOutputIs,
      fusionId: fusionProgramId,
      associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
      feeConfig: feeConfig,
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
  let [vaultOwnerPda, bumpPda] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  const instructions: web3.TransactionInstruction[] = [];

  let vaultTokenAccountOutput = await findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  const [mainRouterLp] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), tokenMintInputFusion.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );

  const [configOutputLp] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouterLp.toBuffer()],
    fusionProgramId,
  );

  const [mainRouterIs] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), fractionMint.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );

  const [configOutputIs] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouterIs.toBuffer()],
    fusionProgramId,
  );

  const admin = new web3.PublicKey(adminAddress);
  const adminTokenAccount = await findAssociatedTokenAddress(admin, fractionMint);

  const signers = [lotteryTicketAccount];
  const additionalComputeBudgetInstruction = web3.ComputeBudgetProgram.requestUnits({
    units: 400000,
    additionalFee: 0,
  });
  instructions.push(additionalComputeBudgetInstruction);
  const instruction = program.instruction.getLotteryTicket(bumpPda, {
    accounts: {
      lotteryTicket: lotteryTicketAccount.publicKey,
      communityPool: communityPool,
      user: userPubkey,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
      fractionMint: fractionMint,
      userFractionsTokenAccount: userFractionsTokenAccount,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      tokenMintInput: tokenMintInputFusion,
      fusionVaultOwnerPda: vaultOwnerPda,
      vaultTokenAccountOutput: vaultTokenAccountOutput,
      mainRouterLp,
      configOutputLp,
      mainRouterIs,
      configOutputIs,
      fusionId: fusionProgramId,
      associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
      feeConfig: feeConfig,
      admin,
      adminTokenAccount,
    },
    signers: signers,
  });

  instructions.push(instruction);

  return { lotteryTicketPubkey: lotteryTicketAccount.publicKey, instructions, signers };
};
