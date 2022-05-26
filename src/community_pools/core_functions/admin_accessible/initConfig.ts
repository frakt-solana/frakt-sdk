import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import * as utils from './../../../common/utils';

import { PublicKey, Transaction } from '@solana/web3.js';
import { returnCommunityPoolsAnchorProgram } from './../../contract_model/accounts';

export { Provider, Program } from '@project-serum/anchor';

export async function initConfig({
  programId,
  provider,
  admin,
  tokenMint,
  sendTxn,
}: {
  programId: PublicKey;
  provider: anchor.Provider;
  admin: PublicKey;
  tokenMint: PublicKey;
  sendTxn: (transaction: Transaction) => Promise<void>;
}) {
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);
  let encoder = new TextEncoder();

  const [vaultOwnerPda, bump] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('vaultownerpda'), programId.toBuffer()],
    program.programId,
  );

  const vaultTokenAccount = await utils.findAssociatedTokenAddress(vaultOwnerPda, tokenMint);

  const [config, bumpPerm] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('poolConfig'), tokenMint.toBuffer()],
    program.programId,
  );

  const tx = program.instruction.intializeConfig(bump, {
    accounts: {
      admin: admin,
      tokenMint: tokenMint,
      vaultOwnerPda,
      vaultTokenAccount,
      config,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    },
  });

  const transaction = new Transaction().add(tx);

  await sendTxn(transaction);
}
