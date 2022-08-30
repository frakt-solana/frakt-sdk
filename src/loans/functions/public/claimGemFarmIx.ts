import { web3, utils } from '@project-serum/anchor';
import { returnAnchorProgram } from '../../helpers';
import { findAssociatedTokenAddress } from '../../../common';

type ClaimGemFarmIx = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  user: web3.PublicKey;
  gemFarm: web3.PublicKey;
  farm: web3.PublicKey;
  nftMint: web3.PublicKey;
  loan: web3.PublicKey;
  isDegod: boolean;
  rewardAMint: web3.PublicKey;
  rewardBMint: web3.PublicKey;
}) => Promise<web3.TransactionInstruction[]>;

export const claimGemFarmIx: ClaimGemFarmIx = async ({
  programId,
  connection,
  user,
  gemFarm,
  farm,
  nftMint,
  loan,
  isDegod,
  rewardAMint,
  rewardBMint,
}) => {
  const encoder = new TextEncoder();
  const ixs: web3.TransactionInstruction[] = [];
  const program = returnAnchorProgram(programId, connection);
  const [identity, bumpAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('degod_stake'), nftMint.toBuffer(), loan.toBuffer()],
    programId,
  );

  const [farmer, bumpFarmer] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('farmer'), farm.toBuffer(), identity.toBuffer()],
    gemFarm,
  );

  const [farmAuthority, bumpAuthAuthority] = await web3.PublicKey.findProgramAddress(
    [farm.toBuffer()],
    gemFarm,
  );
  const [lendingStake] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('stake_acc'), loan.toBuffer()],
    programId,
  );

  const [rewardAPot, bumpPotA] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('reward_pot'), farm.toBuffer(), rewardAMint.toBuffer()],
    gemFarm,
  );

  const [rewardBPot, bumpPotB] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('reward_pot'), farm.toBuffer(), rewardBMint.toBuffer()],
    gemFarm,
  );

  const rewardADestinationIdentity = await findAssociatedTokenAddress(identity, rewardAMint);
  const rewardBDestinationIdentity = await findAssociatedTokenAddress(identity, rewardBMint);
  const rewardADestination = await findAssociatedTokenAddress(user, rewardAMint);
  const rewardBDestination = await findAssociatedTokenAddress(user, rewardBMint);

  const claim = program.instruction.claimGemFarmStaking(
    {
      bumpAuth,
      bumpFarmer,
      bumpAuthAuthority,
      bumpPotA,
      bumpPotB,
      isDegod
    },
    {
      accounts: {
        user,
        gemFarm,
        farm,
        farmAuthority,
        farmer,
        loan,
        identity,
        gemMint: nftMint,
        rewardADestinationIdentity,
        rewardAMint,
        rewardAPot,
        rewardBDestinationIdentity,
        rewardBMint,
        rewardBPot,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
      }
    }
  );
  ixs.push(claim);

  const claimed = program.instruction.getClaimedGemFarmStaking(
    bumpAuth,
    {
      accounts: {
        user,
        loan,
        identity,
        gemMint: nftMint,
        rewardADestinationIdentity,
        rewardADestination,
        rewardAMint,
        lendingStake,
        rewardBDestinationIdentity,
        rewardBDestination,
        rewardBMint,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
      }
    }
  );
  ixs.push(claimed);
  return ixs;
};
