import { AnchorProvider, web3, utils } from '@project-serum/anchor';

import { findAssociatedTokenAddress, returnAnchorMultiRewardStaking } from '../../common';

export const harvestInFusion = async (
  programId: web3.PublicKey,
  connection: web3.Connection,
  userPublicKey: web3.PublicKey,
  mintToStake: web3.PublicKey,
  mintToHarvest: web3.PublicKey,
) => {
  const encoder = new TextEncoder();

  const program = await returnAnchorMultiRewardStaking(programId, connection);

  const [vaultOwnerPda, bump] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), programId.toBuffer()],
    program.programId,
  );
  const userToHarvest = await findAssociatedTokenAddress(userPublicKey, mintToHarvest);

  const vaultTokenAccountOutput = await findAssociatedTokenAddress(vaultOwnerPda, mintToHarvest);
  const [mainRouter, bumpRouter] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), mintToStake.toBuffer(), mintToHarvest.toBuffer()],
    program.programId,
  );

  const [configOutput, bumpConfigOutput] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountOutput'), mintToHarvest.toBuffer(), mainRouter.toBuffer()],
    program.programId,
  );
  const [stakeAccount, bumpStake] = await web3.PublicKey.findProgramAddress(
    [userPublicKey.toBuffer(), mainRouter.toBuffer()],
    program.programId,
  );

  return program.instruction.harvestMainReward(bump, bumpConfigOutput, bumpRouter, bumpStake, {
    accounts: {
      initializer: userPublicKey,
      userTokenAccountOutput: userToHarvest,
      tokenMintInput: mintToStake,
      tokenMintOutput: mintToHarvest,
      vaultOwnerPda,
      vaultTokenAccountOutput,
      stakeAccount: stakeAccount,
      mainRouter,
      configOutput,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
    },
  });
};
