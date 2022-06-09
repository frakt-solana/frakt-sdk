import * as anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Transaction, SystemProgram, TransactionInstruction } from '@solana/web3.js';

import { createAssociatedTokenAccountInstruction, findAssociatedTokenAddress } from '../../../common';
import { ACCOUNT_PREFIX } from '../../constants';
import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { DepositNftToCommunityPool, DepositNftToCommunityPoolIx } from '../../types';

export const depositNftToCommunityPool = async (params: DepositNftToCommunityPool) => {
  const {
    communityPool,
    nftMint,
    nftUserTokenAccount,
    fractionMint,
    poolWhitelist,
    metadataInfo,
    fusionProgramId,
    tokenMintInputFusion,
    feeConfig,
    adminAddress,
    programId,
    userPubkey,
    provider,
    sendTxn,
  } = params;

  let instructions: TransactionInstruction[] = [];
  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [community_pools_authority, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.toBuffer()],
    program.programId,
  );

  const [leaderboardAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );

  const safetyDepositBox = anchor.web3.Keypair.generate();
  const storeNftTokenAccount = anchor.web3.Keypair.generate();

  const userFractionsTokenAccount = await findAssociatedTokenAddress(userPubkey, fractionMint);
  const user = await provider.connection.getAccountInfo(userFractionsTokenAccount);

  if (!user) {
    instructions = [
      ...instructions,
      ...createAssociatedTokenAccountInstruction(userFractionsTokenAccount, userPubkey, userPubkey, fractionMint),
    ];
  }

  const [vaultOwnerPda, bumpPda] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  const vaultTokenAccountOutput = await findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  const admin = new PublicKey(adminAddress);
  const adminTokenAccount = await findAssociatedTokenAddress(admin, fractionMint);

  const [mainRouter] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), tokenMintInputFusion.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );

  const [configOutput] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouter.toBuffer()],
    fusionProgramId,
  );

  const [boardEntry] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPubkey.toBuffer()],
    program.programId,
  );

  const signers = [safetyDepositBox, storeNftTokenAccount];

  const instruction = program.instruction.depositNft(bump, bumpPda, {
    accounts: {
      safetyDepositBox: safetyDepositBox.publicKey,
      nftMint,
      communityPool,
      systemProgram: SystemProgram.programId,
      nftUserTokenAccount,
      storeNftTokenAccount: storeNftTokenAccount.publicKey,
      communityPoolsAuthority: community_pools_authority,
      user: userPubkey,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      fractionMint,
      userFractionsTokenAccount,
      poolWhitelist,
      metadataInfo,
      tokenMintInput: tokenMintInputFusion,
      fusionVaultOwnerPda: vaultOwnerPda,
      vaultTokenAccountOutput,
      mainRouter,
      configOutput,
      fusionId: fusionProgramId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      boardEntry,
      leaderboardAccount,
      feeConfig,
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
};

export const depositNftToCommunityPoolIx = async (params: DepositNftToCommunityPoolIx) => {
  const {
    communityPool,
    nftMint,
    nftUserTokenAccount,
    fractionMint,
    poolWhitelist,
    metadataInfo,
    fusionProgramId,
    tokenMintInputFusion,
    feeConfig,
    adminAddress,
    programId,
    userPubkey,
    provider,
  } = params;

  let instructions: TransactionInstruction[] = [];
  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [community_pools_authority, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.toBuffer()],
    program.programId,
  );
  const [leaderboardAccount, _bump] = await anchor.web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );
  const safetyDepositBox = anchor.web3.Keypair.generate();
  const storeNftTokenAccount = anchor.web3.Keypair.generate();

  const userFractionsTokenAccount = await findAssociatedTokenAddress(userPubkey, fractionMint);
  const user = await provider.connection.getAccountInfo(userFractionsTokenAccount);

  if (!user) {
    instructions = [
      ...instructions,
      ...createAssociatedTokenAccountInstruction(userFractionsTokenAccount, userPubkey, userPubkey, fractionMint),
    ];
  }

  let [vaultOwnerPda, bumpPda] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  let vaultTokenAccountOutput = await findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  const admin = new PublicKey(adminAddress);
  const adminTokenAccount = await findAssociatedTokenAddress(admin, fractionMint);

  let [mainRouter] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), tokenMintInputFusion.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );

  const main = await provider.connection.getAccountInfo(mainRouter);

  if (!main) {
    vaultTokenAccountOutput = adminTokenAccount;
    vaultOwnerPda = tokenMintInputFusion;
  }

  let [configOutput] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouter.toBuffer()],
    fusionProgramId,
  );

  let [boardEntry] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPubkey.toBuffer()],
    program.programId,
  );

  const signers = [safetyDepositBox, storeNftTokenAccount];

  const instruction = program.instruction.depositNft(bump, bumpPda, {
    accounts: {
      safetyDepositBox: safetyDepositBox.publicKey,
      nftMint,
      communityPool,
      systemProgram: SystemProgram.programId,
      nftUserTokenAccount,
      storeNftTokenAccount: storeNftTokenAccount.publicKey,
      communityPoolsAuthority: community_pools_authority,
      user: userPubkey,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      fractionMint,
      userFractionsTokenAccount,
      poolWhitelist,
      metadataInfo,
      tokenMintInput: tokenMintInputFusion,
      fusionVaultOwnerPda: vaultOwnerPda,
      vaultTokenAccountOutput,
      mainRouter,
      configOutput,
      fusionId: fusionProgramId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      boardEntry,
      leaderboardAccount,
      feeConfig,
      admin,
      adminTokenAccount,
    },
    signers: signers,
  });

  instructions.push(instruction);

  return { instructions, signers };
};
