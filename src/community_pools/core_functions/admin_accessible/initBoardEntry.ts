import * as anchor from '@project-serum/anchor';

import { PublicKey, Transaction } from '@solana/web3.js';
import { returnCommunityPoolsAnchorProgram } from './../../contract_model/accounts';

export { Provider, Program } from '@project-serum/anchor';
const encoder = new TextEncoder();

export async function initBoardEntry(
  programId: PublicKey,
  provider: anchor.Provider,
  user: PublicKey,
  nftMint: PublicKey,
  message: string,
  sendTxn: any,
  initialBalance?: anchor.BN,
) {
  let encoder = new TextEncoder();

  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [boardEntry, bumpReward] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), user.toBuffer()],
    program.programId,
  );
  if (initialBalance == null) {
    initialBalance = new anchor.BN(0);
  }

  const ix = await program.instruction.initializeBoardEntry(initialBalance, message, {
    accounts: {
      user: user,
      nftMint: nftMint,
      boardEntry,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });
  let transaction = new Transaction().add(ix);
  await sendTxn(transaction, []);
}

export async function initBoardEntryInstruction(
  programId: PublicKey,
  provider: anchor.Provider,
  user: PublicKey,
  nftMint: PublicKey,
  message: string,
  initialBalance?: anchor.BN,
) {
  let encoder = new TextEncoder();

  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [boardEntry, bumpReward] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), user.toBuffer()],
    program.programId,
  );
  if (initialBalance == null) {
    initialBalance = new anchor.BN(0);
  }

  const ix = await program.instruction.initializeBoardEntry(initialBalance, message, {
    accounts: {
      user: user,
      nftMint: nftMint,
      boardEntry,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });
  return ix;
}
