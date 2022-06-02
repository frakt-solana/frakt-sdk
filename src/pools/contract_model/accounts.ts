import { Program, Provider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import { CommunityPoolsAnchor, IDL, BoardEntryView, PoolConfigView, PermissionView } from './types';

export const returnCommunityPoolsAnchorProgram = async (
  programId: PublicKey,
  provider: Provider,
): Promise<Program<CommunityPoolsAnchor>> => {
  return new Program<CommunityPoolsAnchor>(IDL as any, programId, provider);
};

export const decodedBoardEntry = (decodedPoolState: any, stateAddress: PublicKey): BoardEntryView => ({
  boardEntryPubkey: stateAddress.toBase58(),
  entryholder: decodedPoolState.entryholder.toBase58(),
  totaScore: decodedPoolState.totaScore.toString(),
  scoreToHarvest: decodedPoolState.scoreToHarvest.toString(),
  nftMint: decodedPoolState.nftMint.toBase58(),
  message: decodedPoolState.message,
});

export const decodedPoolConfig = (decodedStakeState: any, poolAddress: PublicKey): PoolConfigView => ({
  poolConfigPubkey: poolAddress.toString(),
  vaultOwnerPda: decodedStakeState.vaultOwnerPda.toBase58(),
  tokenMint: decodedStakeState.tokenMint.toBase58(),
  vaultTokenAccount: decodedStakeState.vaultTokenAccount.toBase58(),
  poolVaultBalance: decodedStakeState.poolVaultBalance.toString(),
});

export const decodedPermission = (decodedState: any, permissionAddress: PublicKey): PermissionView => ({
  permissionPubkey: permissionAddress.toBase58(),
  programPubkey: decodedState.programPubkey.toBase58(),
  expiration: decodedState.expiration.toString(),
  canAddScore: decodedState.canAddScore.toString(),
  canHarvestScore: decodedState.canHarvestScore.toString(),
});
