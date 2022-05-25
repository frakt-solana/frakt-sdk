import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import * as utils from './../../../common/utils';

import { PublicKey, Transaction } from '@solana/web3.js';
import { returnCommunityPoolsAnchorProgram } from './../../contract_model/accounts';

export { Provider, Program } from '@project-serum/anchor';

export async function harvestScore(
  programId: PublicKey,
  provider: anchor.Provider,
  userPublicKey: PublicKey,
  tokenMint: PublicKey,
  sendTxn: any,
) {
  let encoder = new TextEncoder();

  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [boardEntry, bumpBoard] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), userPublicKey.toBuffer()],
    program.programId,
  );

  const [config, bumpConfig] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('poolConfig'), tokenMint.toBuffer()],
    program.programId,
  );
  const [vaultOwnerPda, bumpAuth] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), program.programId.toBuffer()],
    program.programId,
  );
  const vaultTokenAccount = await utils.findAssociatedTokenAddress(vaultOwnerPda, tokenMint);
  const userTokenAccount = await utils.findAssociatedTokenAddress(userPublicKey, tokenMint);
  const ix = await program.instruction.harvestScore(bumpBoard, bumpAuth, bumpConfig, {
    accounts: {
      user: userPublicKey,
      tokenMint: tokenMint,
      userTokenAccount,
      vaultOwnerPda,
      vaultTokenAccount,
      config,
      boardEntry,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    },
  });
  let transaction = new Transaction().add(ix);

  await sendTxn(transaction);
}
