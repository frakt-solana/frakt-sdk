import anchor from '@project-serum/anchor';
import {PublicKey, Transaction} from '@solana/web3.js';
export { Provider, Program } from '@project-serum/anchor';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';

export interface InitBoardEntry {
  programId: PublicKey,
  provider: anchor.Provider,
  user: PublicKey,
  nftMint: PublicKey,
  message: string,
  sendTxn: (transaction: Transaction) => Promise<void>,
  initialBalance?: anchor.BN,
}

export const initBoardEntry = async (params: InitBoardEntry) => {
  const {
    programId,
    provider,
    user,
    nftMint,
    message,
    sendTxn,
    initialBalance = new anchor.BN(0)
  } = params;

  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [boardEntry] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), user.toBuffer()],
    program.programId,
  );

  const instruction = await program.instruction.initializeBoardEntry(initialBalance, message, {
    accounts: {
      user: user,
      nftMint: nftMint,
      boardEntry,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  const transaction = new Transaction().add(instruction);

  await sendTxn(transaction);
}

export interface InitBoardEntryInstruction {
  programId: PublicKey,
  provider: anchor.Provider,
  user: PublicKey,
  nftMint: PublicKey,
  message: string,
  initialBalance?: anchor.BN,
}

export const initBoardEntryInstruction = async (params: InitBoardEntryInstruction) => {
  const {
    programId,
    provider,
    user,
    nftMint,
    message,
    initialBalance = new anchor.BN(0)
  } = params;

  const encoder = new TextEncoder();
  const  program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [boardEntry] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), user.toBuffer()],
    program.programId,
  );

  return program.instruction.initializeBoardEntry(initialBalance, message, {
    accounts: {
      user: user,
      nftMint: nftMint,
      boardEntry,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });
}
