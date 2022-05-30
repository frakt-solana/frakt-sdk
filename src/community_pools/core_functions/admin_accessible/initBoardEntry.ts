import anchor from '@project-serum/anchor';
import {PublicKey, Transaction} from '@solana/web3.js';
export { Provider, Program } from '@project-serum/anchor';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';

export const initBoardEntry = async (
  programId: PublicKey,
  provider: anchor.Provider,
  user: PublicKey,
  nftMint: PublicKey,
  message: string,
  sendTxn: any,
  initialBalance?: anchor.BN,
) => {
  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [boardEntry] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), user.toBuffer()],
    program.programId,
  );

  if (initialBalance == null) {
    initialBalance = new anchor.BN(0);
  }

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

  await sendTxn(transaction, []);
}

export const initBoardEntryInstruction = async (
  programId: PublicKey,
  provider: anchor.Provider,
  user: PublicKey,
  nftMint: PublicKey,
  message: string,
  initialBalance?: anchor.BN,
) => {
  const encoder = new TextEncoder();
  const  program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const [boardEntry] = await anchor.web3.PublicKey.findProgramAddress(
    [encoder.encode('BoardEntry'), user.toBuffer()],
    program.programId,
  );

  if (initialBalance == null) {
    initialBalance = new anchor.BN(0);
  }

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
