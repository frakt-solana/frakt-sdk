import { web3, Program, AnchorProvider } from '@project-serum/anchor';

import {
  BoardEntryView,
  PoolConfigView,
  PermissionView,
  MainPoolConfigView,
  StakeAccountView,
  MainRouterView,
  SecondStakeAccountView,
  SecondaryRewardView
} from '../types';
import idl from '../contract_model/idl/community_pools_anchor.json';

export const returnCommunityPoolsAnchorProgram = async (
  programId: web3.PublicKey,
  provider: AnchorProvider,
): Promise<Program> => {
  return new Program(idl as any, programId, provider);
};

export const decodedBoardEntry = (decodedPoolState: any, stateAddress: web3.PublicKey): BoardEntryView => ({
  boardEntryPubkey: stateAddress.toBase58(),
  entryholder: decodedPoolState.entryholder.toBase58(),
  totaScore: decodedPoolState.totaScore.toString(),
  scoreToHarvest: decodedPoolState.scoreToHarvest.toString(),
  nftMint: decodedPoolState.nftMint.toBase58(),
  message: decodedPoolState.message,
});

export const decodedPoolConfig = (decodedStakeState: any, poolAddress: web3.PublicKey): PoolConfigView => ({
  poolConfigPubkey: poolAddress.toString(),
  vaultOwnerPda: decodedStakeState.vaultOwnerPda.toBase58(),
  tokenMint: decodedStakeState.tokenMint.toBase58(),
  vaultTokenAccount: decodedStakeState.vaultTokenAccount.toBase58(),
  poolVaultBalance: decodedStakeState.poolVaultBalance.toString(),
});

export const decodedPermission = (decodedState: any, permissionAddress: web3.PublicKey): PermissionView => ({
  permissionPubkey: permissionAddress.toBase58(),
  programPubkey: decodedState.programPubkey.toBase58(),
  expiration: decodedState.expiration.toString(),
  canAddScore: decodedState.canAddScore.toString(),
  canHarvestScore: decodedState.canHarvestScore.toString(),
});

export const decodedPoolBufferToUI = (decodedPoolState: any, poolAddress: web3.PublicKey): MainPoolConfigView => ({
  mainPoolPubkey: poolAddress.toBase58(),
  vaultOwnerPda: decodedPoolState.vaultOwnerPda.toBase58(),
  tokenMint: decodedPoolState.tokenMint.toBase58(),
  vaultTokenAccount: decodedPoolState.vaultTokenAccount.toBase58(),
  poolVaultBalance: decodedPoolState.poolVaultBalance.toString(),
});

export const decodedStakeAccountAddressToUI = (decodedStakeState: any, stakeAddress: web3.PublicKey): StakeAccountView => ({
  stakeAccountPubkey: stakeAddress.toBase58(),
  stakeOwner: decodedStakeState.stakeOwner.toBase58(),
  tokenMintInput: decodedStakeState.tokenMintInput.toBase58(),
  tokenMintOutput: decodedStakeState.tokenMintOutput.toBase58(),
  routerPubkey: decodedStakeState.router.toBase58(),
  amount: decodedStakeState.amount.toString(),
  stakedAt: decodedStakeState.stakedAt.toString(),
  stakedAtCumulative: decodedStakeState.stakedAtCumulative.toString(),
  stakeEnd: decodedStakeState.stakeEnd.toString(),
  unstakedAtCumulative: decodedStakeState.unstakedAtCumulative.toString(),
  lastHarvestedAt: decodedStakeState.lastHarvestedAt.toString(),
  isStaked: Boolean(decodedStakeState.isStaked),
});

export const decodedRouterToUI = (decodedState: any, mainRouterAddress: web3.PublicKey): MainRouterView => ({
  mainRouterPubkey: mainRouterAddress.toBase58(),
  tokenMintInput: decodedState.tokenMintInput.toBase58(),
  tokenMintOutput: decodedState.tokenMintOutput.toBase58(),
  poolConfigInput: decodedState.poolConfigInput.toBase58(),
  poolConfigOutput: decodedState.poolConfigOutput.toBase58(),
  amountOfStaked: decodedState.amountOfStaked.toString(),
  amountToReturn: decodedState.amountToReturn.toString(),
  apr: decodedState.apr.toString(),
  cumulative: decodedState.cumulative.toString(),
  lastTime: decodedState.lastTime.toString(),
  decimalsInput: decodedState.decimalsInput.toString(),
  decimalsOutput: decodedState.decimalsOutput.toString(),
  oldCumulative: decodedState.oldCumulative.toString(),
  endTime: decodedState.endTime.toString(),
  startTime: decodedState.startTime.toString(),
});

export const decodedSecondStakeToUI = (decodedState: any, secondStakeAccount: web3.PublicKey): SecondStakeAccountView => ({
  secondStakeAccount: secondStakeAccount.toBase58(),
  rewardOwner: decodedState.rewardOwner.toBase58(),
  stakeAccount: decodedState.stakeAccount.toBase58(),
  secondaryReward: decodedState.secondaryReward.toBase58(),
  startTime: decodedState.startTime.toString(),
  lastHarvestedAt: decodedState.lastHarvestedAt.toString(),
});

export const decodedSecondaryRewardToUI = (decodedState: any, secondaryRewardaccount: web3.PublicKey): SecondaryRewardView => ({
  secondaryRewardaccount: secondaryRewardaccount.toBase58(),
  routerPubkey: decodedState.routerPubkey.toBase58(),
  tokenMint: decodedState.tokenMint.toBase58(),
  poolVaultBalance: decodedState.poolVaultBalance.toString(),
  tokensPerSecondPerPoint: decodedState.tokensPerSecondPerPoint.toString(),
  decimalsOutput: decodedState.decimalsOutput.toString(),
  startTime: decodedState.startTime.toString(),
  endTime: decodedState.endTime.toString()
});
