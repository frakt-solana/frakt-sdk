import { AnchorProvider, web3 } from '@project-serum/anchor';

import { findAssociatedTokenAddress, returnAnchorMultiRewardStaking } from '../../common';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '../../common/constants';

export const harvestSecondaryReward = async (
  programId: web3.PublicKey,
  provider: AnchorProvider,
  userPublicKey: web3.PublicKey,
  mintToStake: web3.PublicKey,
  mintToHarvest: web3.PublicKey,
  mintsToReward: web3.PublicKey[],
) => {
  const encoder = new TextEncoder();

  const program = await returnAnchorMultiRewardStaking(programId, provider);

  // const transaction = new Transaction()
  const ixs: web3.TransactionInstruction[] = [];
  const [vaultOwnerPda, bump] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), programId.toBuffer()],
    program.programId,
  );

  const [mainRouter, bumpRouter] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('mainRouter'), mintToStake.toBuffer(), mintToHarvest.toBuffer()],
    program.programId,
  );
  const [stakeAccount, bumpStake] = await web3.PublicKey.findProgramAddress(
    [userPublicKey.toBuffer(), mainRouter.toBuffer()],
    program.programId,
  );

  for (let i = 0; i < mintsToReward.length; i++) {
    const [secondaryReward, bumpReward] = await web3.PublicKey.findProgramAddress(
      [encoder.encode('SecondaryRewards'), mintsToReward[i].toBuffer(), mainRouter.toBuffer()],
      program.programId,
    );
    const userTokenAccountRewards = await findAssociatedTokenAddress(userPublicKey, mintsToReward[i]);

    const vaultTokenAccountRewards = await findAssociatedTokenAddress(vaultOwnerPda, mintsToReward[i]);
    const [secondaryStakeAccount, bumpSecondary] = await web3.PublicKey.findProgramAddress(
      [encoder.encode('SecondaryStakeAccount'), secondaryReward.toBuffer(), stakeAccount.toBuffer()],
      program.programId,
    );

    const ix = program.instruction.harvestSecondaryRewards(bump, bumpRouter, bumpReward, bumpSecondary, bumpStake, {
      accounts: {
        initializer: userPublicKey,
        userTokenAccountRewards,
        tokenMintInput: mintToStake,
        tokenMintOutput: mintToHarvest,
        tokenMintRewards: mintsToReward[i],
        vaultOwnerPda,
        vaultTokenAccountRewards,
        stakeAccount,
        mainRouter,
        secondaryReward,
        secondaryStakeAccount,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      },
    });
    ixs.push(ix);
  }

  await new Promise((f) => setTimeout(f, 100));

  return ixs;
};
