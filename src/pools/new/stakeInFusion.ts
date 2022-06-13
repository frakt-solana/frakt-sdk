import * as anchor from '@project-serum/anchor';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { findAssociatedTokenAddress, returnAnchorMultiRewardStaking } from '../../common';

export const stakeInFusion = async (programId: PublicKey, provider: anchor.Provider, userPublicKey: PublicKey, mintToStake: PublicKey, mintToHarvest: PublicKey, stakeAmount: anchor.BN) => {
  const encoder = new TextEncoder();

  const program = await returnAnchorMultiRewardStaking(programId, provider)

  const [vaultOwnerPda, bump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [encoder.encode("vaultownerpda"), programId.toBuffer()],
      program.programId
    );
  const userToStake = await findAssociatedTokenAddress(userPublicKey, mintToStake)

  const vaultTokenAccountInput = await findAssociatedTokenAddress(vaultOwnerPda, mintToStake)
  const [mainRouter, bumpRouter] =
    await anchor.web3.PublicKey.findProgramAddress(
      [encoder.encode("mainRouter"), mintToStake.toBuffer(), mintToHarvest.toBuffer()],
      program.programId
    );

  const [configInput, bumpConfigInput] =
    await anchor.web3.PublicKey.findProgramAddress(
      [encoder.encode("mainConfigAccountInput"), mintToStake.toBuffer(), mainRouter.toBuffer()],
      program.programId
    );


  const [stakeAccount, bumpStake] =
    await anchor.web3.PublicKey.findProgramAddress(
      [userPublicKey.toBuffer(), mainRouter.toBuffer()],
      program.programId
    );


  return program.instruction.stakeSingle(
    bump,
    bumpConfigInput,
    bumpRouter,
    bumpStake,
    stakeAmount,
    {
      accounts: {
        initializer: userPublicKey,
        userTokenAccountInput: userToStake,
        tokenMintInput: mintToStake,
        tokenMintOutput: mintToHarvest,
        vaultOwnerPda,
        vaultTokenAccountInput,
        stakeAccount,
        mainRouter,
        configInput,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      },
    }
  );
}
