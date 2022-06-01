import anchor from '@project-serum/anchor';
import { PublicKey, Connection } from '@solana/web3.js';
import {
  decodedBoardEntry,
  decodedPermission,
  decodedPoolConfig,
  returnCommunityPoolsAnchorProgram,
} from '../contract_model/accounts';
import { createFakeWallet } from '../../common/utils';

const getAllProgramAccounts = async (programId: PublicKey, connection: Connection) => {
  const provider = new anchor.Provider(connection, createFakeWallet(), anchor.Provider.defaultOptions());
  const program = await returnCommunityPoolsAnchorProgram(programId, provider);

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

export default getAllProgramAccounts;
