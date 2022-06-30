import { web3, utils } from '@project-serum/anchor';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { findAssociatedTokenAddress } from '../../../common';
import { InitConfig } from '../../types';

export const initConfig = async (params: InitConfig) => {
  const { programId, connection, admin, tokenMint, sendTxn } = params;

  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, connection);

  const [vaultOwnerPda, bump] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), programId.toBuffer()],
    program.programId,
  );

  const vaultTokenAccount = await findAssociatedTokenAddress(vaultOwnerPda, tokenMint);

  const [config] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('poolConfig'), tokenMint.toBuffer()],
    program.programId,
  );

  const instruction = program.instruction.intializeConfig(bump, {
    accounts: {
      admin: admin,
      tokenMint: tokenMint,
      vaultOwnerPda,
      vaultTokenAccount,
      config,
      rent: web3.SYSVAR_RENT_PUBKEY,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
    },
  });

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction);
};
