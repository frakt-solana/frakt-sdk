import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';

import { PublicKey, Connection, Keypair, Transaction, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import {
  decodedBoardEntry,
  decodedPermission,
  decodedPoolConfig,
  returnCommunityPoolsAnchorProgram,
} from './../contract_model/accounts';
import { createFakeWallet } from './../../common/utils';

export { Provider, Program } from '@project-serum/anchor';

export async function getAllProgramAccounts(programId: PublicKey, connection: Connection) {
  const provider = new anchor.Provider(connection, createFakeWallet(), anchor.Provider.defaultOptions());
  let program = await returnCommunityPoolsAnchorProgram(programId, provider);

  const communityPools = await program.account.communityPool.all();
  const lotteryTickets = await program.account.lotteryTicket.all();
  const poolWhitelists = await program.account.poolWhitelist.all();
  const safetyDepositBoxes = await program.account.safetyDepositBox.all();

  const boardEntrysRaw = await program.account.boardEntry.all();
  const poolConfigsRaw = await program.account.poolConfig.all();
  const permissionsRaw = await program.account.permission.all();
  const feeConfig = await program.account.feeConfig.all();

  const boardEntrys = boardEntrysRaw.map((raw) => decodedBoardEntry(raw.account, raw.publicKey));
  const poolConfigs = poolConfigsRaw.map((raw) => decodedPoolConfig(raw.account, raw.publicKey));
  const permissions = permissionsRaw.map((raw) => decodedPermission(raw.account, raw.publicKey));

  return {
    communityPools,
    lotteryTickets,
    poolWhitelists,
    safetyDepositBoxes,
    boardEntrys,
    poolConfigs,
    permissions,
    feeConfig,
  };
}
