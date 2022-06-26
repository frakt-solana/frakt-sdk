import { web3, BN, AnchorProvider } from '@project-serum/anchor';

import { findAssociatedTokenAddress, returnAnchorMultiRewardStaking } from '../../common';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '../../common/constants';

export const stakeInFusion = async (
  programId: web3.PublicKey,
  provider: AnchorProvider,
  userPublicKey: web3.PublicKey,
  mintToStake: web3.PublicKey,
  mintToHarvest: web3.PublicKey,
  stakeAmount: BN,
) => {
  const encoder = new TextEncoder();

  const program = await returnAnchorMultiRewardStaking(programId, provider);

  const [vaultOwnerPda, bump] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), programId.toBuffer()],
    program.programId,
  );
  const userToStake = await findAssociatedTokenAddress(userPublicKey, mintToStake);

  const vaultTokenAccountInput = await findAssociatedTokenAddress(vaultOwnerPda, mintToStake);
  const [mainRouter, bumpRouter] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), mintToStake.toBuffer(), mintToHarvest.toBuffer()],
    program.programId,
  );

  const [configInput, bumpConfigInput] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainConfigAccountInput'), mintToStake.toBuffer(), mainRouter.toBuffer()],
    program.programId,
  );

  const [stakeAccount, bumpStake] = await web3.PublicKey.findProgramAddress(
    [userPublicKey.toBuffer(), mainRouter.toBuffer()],
    program.programId,
  );

  return program.instruction.stakeSingle(bump, bumpConfigInput, bumpRouter, bumpStake, stakeAmount, {
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
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    },
  });
};
