import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import * as utils from './../../../common/utils';

import { PublicKey, Keypair, Transaction, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { returnCommunityPoolsAnchorProgram } from './../../contract_model/accounts';

export { Provider, Program } from '@project-serum/anchor';
const encoder = new TextEncoder();

export async function getLotteryTicket(
  {
    communityPool,
    fractionMint,
    userFractionsTokenAccount,
    fusionProgramId,
    tokenMintInputFusion,
    feeConfig,
    adminAddress,
  }: {
    communityPool: PublicKey;
    fractionMint: PublicKey;
    userFractionsTokenAccount: PublicKey;
    fusionProgramId: PublicKey;
    tokenMintInputFusion: PublicKey;
    feeConfig: PublicKey;
    adminAddress: PublicKey;
  },
  {
    userPubkey,
    provider,
    programId,
    sendTxn,
  }: {
    programId: PublicKey;
    userPubkey: PublicKey;
    provider: anchor.Provider;
    sendTxn: (transaction: Transaction, signers: Keypair[]) => Promise<void>;
  },
) {
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const lotteryTicketAccount = anchor.web3.Keypair.generate();
  const [leaderboardAccount, _bump] = await anchor.web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );
  const [leaderboardAuthority, bumpLead] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('leaderBoardProgramAuthority'), programId.toBuffer()],
    program.programId,
  );
  let [vaultOwnerPda, bumpPda] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  const instructions = [];

  let vaultTokenAccountOutput = await utils.findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  let [mainRouter, bumpRouter] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), tokenMintInputFusion.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );

  let [configOutput, bumpConfigOutput] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouter.toBuffer()],
    fusionProgramId,
  );

  const admin = new PublicKey(adminAddress);
  const adminTokenAccount = await utils.findAssociatedTokenAddress(admin, fractionMint);

  let [boardEntry, bumpBoardEntry] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPubkey.toBuffer()],
    programId,
  );

  const signers = [lotteryTicketAccount];
  const tx = program.instruction.getLotteryTicket(bumpPda, {
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

  for (let instruction of instructions) transaction.add(instruction);

  transaction.add(tx);

  await sendTxn(transaction, signers);

  return { lotteryTicketPubkey: lotteryTicketAccount.publicKey };
}

export async function getLotteryTicketIx(
  {
    communityPool,
    fractionMint,
    userFractionsTokenAccount,
    fusionProgramId,
    tokenMintInputFusion,
    feeConfig,
    adminAddress,
  }: {
    communityPool: PublicKey;
    fractionMint: PublicKey;
    userFractionsTokenAccount: PublicKey;
    fusionProgramId: PublicKey;
    tokenMintInputFusion: PublicKey;
    feeConfig: PublicKey;
    adminAddress: PublicKey;
  },
  {
    userPubkey,
    provider,
    programId,
  }: {
    programId: PublicKey;
    userPubkey: PublicKey;
    provider: anchor.Provider;
  },
) {
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const lotteryTicketAccount = anchor.web3.Keypair.generate();
  const [leaderboardAccount, _bump] = await anchor.web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );
  const [leaderboardAuthority, bumpLead] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('leaderBoardProgramAuthority'), programId.toBuffer()],
    program.programId,
  );
  let [vaultOwnerPda, bumpPda] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  const instructions: TransactionInstruction[] = [];

  let vaultTokenAccountOutput = await utils.findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  let [mainRouter] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), tokenMintInputFusion.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );
  let [configOutput] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouter.toBuffer()],
    fusionProgramId,
  );

  const admin = new PublicKey(adminAddress);
  const adminTokenAccount = await utils.findAssociatedTokenAddress(admin, fractionMint);

  if (!(await provider.connection.getAccountInfo(mainRouter))) {
    vaultOwnerPda = tokenMintInputFusion;
  }
  let [boardEntry] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPubkey.toBuffer()],
    programId,
  );

  const signers = [lotteryTicketAccount];
  const tx = program.instruction.getLotteryTicket(bumpPda, {
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

  instructions.push(tx);

  return { lotteryTicketPubkey: lotteryTicketAccount.publicKey, instructions, signers };
}
