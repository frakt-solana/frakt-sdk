import { web3, utils } from '@project-serum/anchor';

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
    connection,
    sendTxn,
  } = params;

  let instructions: web3.TransactionInstruction[] = [];
  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, connection);

  const [community_pools_authority, bump] = await web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.toBuffer()],
    program.programId,
  );

  const safetyDepositBox = web3.Keypair.generate();
  const storeNftTokenAccount = web3.Keypair.generate();

  const userFractionsTokenAccount = await findAssociatedTokenAddress(userPubkey, fractionMint);
  const user = await connection.getAccountInfo(userFractionsTokenAccount);

  if (!user) {
    instructions = instructions.concat(
      createAssociatedTokenAccountInstruction(userFractionsTokenAccount, userPubkey, userPubkey, fractionMint),
    );
  }

  const [vaultOwnerPda, bumpPda] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  const vaultTokenAccountOutput = await findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  const admin = new web3.PublicKey(adminAddress);
  const adminTokenAccount = await findAssociatedTokenAddress(admin, fractionMint);

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

  const signers = [safetyDepositBox, storeNftTokenAccount];

  const instruction = program.instruction.depositNft(bump, bumpPda, {
    accounts: {
      safetyDepositBox: safetyDepositBox.publicKey,
      nftMint,
      communityPool,
      systemProgram: web3.SystemProgram.programId,
      nftUserTokenAccount,
      storeNftTokenAccount: storeNftTokenAccount.publicKey,
      communityPoolsAuthority: community_pools_authority,
      user: userPubkey,
      rent: web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      fractionMint,
      userFractionsTokenAccount,
      poolWhitelist,
      metadataInfo,
      tokenMintInput: tokenMintInputFusion,
      fusionVaultOwnerPda: vaultOwnerPda,
      vaultTokenAccountOutput,
      mainRouterLp,
      configOutputLp,
      mainRouterIs,
      configOutputIs,
      fusionId: fusionProgramId,
      associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
      feeConfig,
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
    connection,
  } = params;

  let instructions: web3.TransactionInstruction[] = [];
  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, connection);

  const [community_pools_authority, bump] = await web3.PublicKey.findProgramAddress(
    [encoder.encode(ACCOUNT_PREFIX), program.programId.toBuffer(), communityPool.toBuffer()],
    program.programId,
  );
  const safetyDepositBox = web3.Keypair.generate();
  const storeNftTokenAccount = web3.Keypair.generate();

  const userFractionsTokenAccount = await findAssociatedTokenAddress(userPubkey, fractionMint);
  const user = await connection.getAccountInfo(userFractionsTokenAccount);

  if (!user) {
    instructions = instructions.concat(
      createAssociatedTokenAccountInstruction(userFractionsTokenAccount, userPubkey, userPubkey, fractionMint),
    );
  }

  let [vaultOwnerPda, bumpPda] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), fusionProgramId.toBuffer()],
    fusionProgramId,
  );

  let vaultTokenAccountOutput = await findAssociatedTokenAddress(vaultOwnerPda, fractionMint);

  const admin = new web3.PublicKey(adminAddress);
  const adminTokenAccount = await findAssociatedTokenAddress(admin, fractionMint);

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
  const signers = [safetyDepositBox, storeNftTokenAccount];
  const additionalComputeBudgetInstruction = web3.ComputeBudgetProgram.requestUnits({
    units: 400000,
    additionalFee: 0,
  });
  instructions.push(additionalComputeBudgetInstruction);
  const instruction = program.instruction.depositNft(bump, bumpPda, {
    accounts: {
      safetyDepositBox: safetyDepositBox.publicKey,
      nftMint,
      communityPool,
      systemProgram: web3.SystemProgram.programId,
      nftUserTokenAccount,
      storeNftTokenAccount: storeNftTokenAccount.publicKey,
      communityPoolsAuthority: community_pools_authority,
      user: userPubkey,
      rent: web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      fractionMint,
      userFractionsTokenAccount,
      poolWhitelist,
      metadataInfo,
      tokenMintInput: tokenMintInputFusion,
      fusionVaultOwnerPda: vaultOwnerPda,
      vaultTokenAccountOutput,
      mainRouterLp,
      configOutputLp,
      mainRouterIs,
      configOutputIs,
      fusionId: fusionProgramId,
      associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
      feeConfig,
      admin,
      adminTokenAccount,
    },
    signers: signers,
  });

  instructions.push(instruction);

  return { instructions, signers };
};
