import { Program, Provider } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { CommunityPoolsAnchor, IDL } from './types/community_pools_anchor';

export async function returnCommunityPoolsAnchorProgram(
  programId: PublicKey,
  provider: Provider,
): Promise<Program<CommunityPoolsAnchor>> {
  const anchorProgram = new Program<CommunityPoolsAnchor>(IDL as any, programId, provider);
  return anchorProgram;
}

export interface BoardEntryView {
  boardEntryPubkey: string;
  entryholder: string;
  totaScore: string;
  scoreToHarvest: string;
  nftMint: string;
  message: string;
}

export function decodedBoardEntry(decodedPoolState: any, stateAddress: PublicKey): BoardEntryView {
  return {
    boardEntryPubkey: stateAddress.toBase58(),
    entryholder: decodedPoolState.entryholder.toBase58(),
    totaScore: decodedPoolState.totaScore.toString(),
    scoreToHarvest: decodedPoolState.scoreToHarvest.toString(),
    nftMint: decodedPoolState.nftMint.toBase58(),
    message: decodedPoolState.message,
  };
}

export interface PoolConfigView {
  poolConfigPubkey: string;
  vaultOwnerPda: string;
  tokenMint: string;
  vaultTokenAccount: string;
  poolVaultBalance: string;
}

export function decodedPoolConfig(decodedStakeState: any, poolAddress: PublicKey): PoolConfigView {
  return {
    poolConfigPubkey: poolAddress.toString(),
    vaultOwnerPda: decodedStakeState.vaultOwnerPda.toBase58(),
    tokenMint: decodedStakeState.tokenMint.toBase58(),
    vaultTokenAccount: decodedStakeState.vaultTokenAccount.toBase58(),
    poolVaultBalance: decodedStakeState.poolVaultBalance.toString(),
  };
}

export interface PermissionView {
  permissionPubkey: string;
  programPubkey: string;
  expiration: string;
  canAddScore: string;
  canHarvestScore: string;
}

export function decodedPermission(decodedState: any, permissionAddress: PublicKey): PermissionView {
  return {
    permissionPubkey: permissionAddress.toBase58(),
    programPubkey: decodedState.programPubkey.toBase58(),
    expiration: decodedState.expiration.toString(),
    canAddScore: decodedState.canAddScore.toString(),
    canHarvestScore: decodedState.canHarvestScore.toString(),
  };
}
