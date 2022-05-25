import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';

import { PublicKey, Keypair, Transaction, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { ACCOUNT_PREFIX } from './../../constants';
import { returnCommunityPoolsAnchorProgram } from './../../contract_model/accounts';
import * as utils from './../../../common/utils';

export { Provider, Program } from '@project-serum/anchor';
const encoder = new TextEncoder();

export async function depositNftToCommunityPool(
  {
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
  }: {
    communityPool: PublicKey;
    nftMint: PublicKey;
    nftUserTokenAccount: PublicKey;
    fractionMint: PublicKey;
    poolWhitelist: PublicKey;
    metadataInfo: PublicKey;
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

  const instructions = [];
  const userFractionsTokenAccount = await utils.findAssociatedTokenAddress(userPubkey, fractionMint);
  if (!(await provider.connection.getAccountInfo(userFractionsTokenAccount)))
    utils.createAssociatedTokenAccountInstruction(
      instructions,
      userFractionsTokenAccount,
      userPubkey,
      userPubkey,
      fractionMint,
    );

  let [vaultOwnerPda, bumpPda] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  let vaultTokenAccountOutput = await utils.findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  const admin = new PublicKey(adminAddress);
  const adminTokenAccount = await utils.findAssociatedTokenAddress(admin, fractionMint);

  let [mainRouter, bumpRouter] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), tokenMintInputFusion.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );

  let [configOutput, bumpConfigOutput] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), fractionMint.toBuffer(), mainRouter.toBuffer()],
    fusionProgramId,
  );

  let [boardEntry, bumpBoardEntry] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPubkey.toBuffer()],
    program.programId,
  );

  const signers = [safetyDepositBox, storeNftTokenAccount];
  const mainIx = program.instruction.depositNft(bump, bumpPda, {
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

  for (let instruction of instructions) transaction.add(instruction);

  transaction.add(mainIx);
  await sendTxn(transaction, signers);
}

export async function depositNftToCommunityPoolIx(
  {
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
  }: {
    communityPool: PublicKey;
    nftMint: PublicKey;
    nftUserTokenAccount: PublicKey;
    fractionMint: PublicKey;
    poolWhitelist: PublicKey;
    metadataInfo: PublicKey;
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

  const instructions: TransactionInstruction[] = [];
  const userFractionsTokenAccount = await utils.findAssociatedTokenAddress(userPubkey, fractionMint);
  if (!(await provider.connection.getAccountInfo(userFractionsTokenAccount)))
    utils.createAssociatedTokenAccountInstruction(
      instructions,
      userFractionsTokenAccount,
      userPubkey,
      userPubkey,
      fractionMint,
    );

  let [vaultOwnerPda, bumpPda] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  let vaultTokenAccountOutput = await utils.findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  const admin = new PublicKey(adminAddress);
  const adminTokenAccount = await utils.findAssociatedTokenAddress(admin, fractionMint);

  let [mainRouter, bumpRouter] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), tokenMintInputFusion.toBuffer(), fractionMint.toBuffer()],
    fusionProgramId,
  );

  if (!(await provider.connection.getAccountInfo(mainRouter))) {
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
  const mainIx = program.instruction.depositNft(bump, bumpPda, {
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
  instructions.push(mainIx);
  return { instructions, signers };
}
