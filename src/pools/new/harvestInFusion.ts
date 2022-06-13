import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { findAssociatedTokenAddress, returnAnchorMultiRewardStaking } from '../../common';

export const harvestInFusion = async (programId: PublicKey, provider: anchor.Provider, userPublicKey: PublicKey, mintToStake: PublicKey, mintToHarvest: PublicKey) =>{
  const encoder = new TextEncoder();

  const program = await returnAnchorMultiRewardStaking(programId, provider)

  const [vaultOwnerPda, bump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [encoder.encode("vaultownerpda"), programId.toBuffer()],
      program.programId
    );
  const userToHarvest = await findAssociatedTokenAddress(userPublicKey, mintToHarvest)

  const vaultTokenAccountOutput = await findAssociatedTokenAddress(vaultOwnerPda, mintToHarvest)
  const [mainRouter, bumpRouter] =
    await anchor.web3.PublicKey.findProgramAddress(
      [encoder.encode("mainRouter"), mintToStake.toBuffer(), mintToHarvest.toBuffer()],
      program.programId
    );

  const [configOutput, bumpConfigOutput] =
    await anchor.web3.PublicKey.findProgramAddress(
      [encoder.encode("mainConfigAccountOutput"), mintToHarvest.toBuffer(), mainRouter.toBuffer()],
      program.programId
    );
  const [stakeAccount, bumpStake] =
    await anchor.web3.PublicKey.findProgramAddress(
      [userPublicKey.toBuffer(), mainRouter.toBuffer()],
      program.programId
    );


  return program.instruction.harvestMainReward(
    bump,
    bumpConfigOutput,
    bumpRouter,
    bumpStake,
    {
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
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      },
    }
  );
}
