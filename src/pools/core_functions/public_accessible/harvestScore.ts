import { web3 } from '@project-serum/anchor';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { findAssociatedTokenAddress } from '../../../common';
import { HarvestScore } from '../../types';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '../../../common/constants';

export const harvestScore = async (params: HarvestScore) => {
  const { programId, connection, userPublicKey, tokenMint, sendTxn } = params;

  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, connection);

  const [boardEntry, bumpBoard] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPublicKey.toBuffer()],
    program.programId,
  );

  const [config, bumpConfig] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('poolConfig'), tokenMint.toBuffer()],
    program.programId,
  );

  const [vaultOwnerPda, bumpAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), program.programId.toBuffer()],
    program.programId,
  );

  const vaultTokenAccount = await findAssociatedTokenAddress(vaultOwnerPda, tokenMint);
  const userTokenAccount = await findAssociatedTokenAddress(userPublicKey, tokenMint);

  const instruction = await program.instruction.harvestScore(bumpBoard, bumpAuth, bumpConfig, {
    accounts: {
      user: userPublicKey,
      tokenMint: tokenMint,
      userTokenAccount,
      vaultOwnerPda,
      vaultTokenAccount,
      config,
      boardEntry,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    },
  });

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction);
};
