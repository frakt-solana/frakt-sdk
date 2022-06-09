import * as anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Transaction } from '@solana/web3.js';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { findAssociatedTokenAddress } from '../../../common';
import { TopupConfig } from '../../types';

export const topupConfig = async (params: TopupConfig) => {
  const { programId, provider, admin, tokenMint, inputAmount, sendTxn } = params;

  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);
  const adminTokenAccount = await findAssociatedTokenAddress(admin, tokenMint);

  const [vaultOwnerPda, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), programId.toBuffer()],
    program.programId,
  );

  const vaultTokenAccount = await findAssociatedTokenAddress(vaultOwnerPda, tokenMint);

  const [config, bumpConfig] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('poolConfig'), tokenMint.toBuffer()],
    program.programId,
  );

  const instruction = program.instruction.topupConfig(bump, bumpConfig, inputAmount, {
    accounts: {
      admin: admin,
      tokenMint: tokenMint,
      adminTokenAccount,
      vaultOwnerPda,
      vaultTokenAccount,
      config,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    },
  });

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction);
};
