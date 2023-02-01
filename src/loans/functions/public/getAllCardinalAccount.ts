import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import { createFakeWallet } from '../../../common';
import { objectBNsAndPubkeysToNums } from '../../helpers';
import { RewardDistributorView, RewardEntryView, StakeEntryView, StakePoolView } from '../../types';
import { IDL } from '../../idl/cardinal_rewards_center';

type GetCardinalAccounts = (params: {
  cardinalProgramId: web3.PublicKey;
  connection: web3.Connection;
}) => Promise<{stakeEntries: StakeEntryView[], rewardEntries: RewardEntryView[], 
  rewardDistributors: RewardDistributorView[], stakePools: StakePoolView[]}>;

export const getCardinalAccounts: GetCardinalAccounts = async ({
  cardinalProgramId,
    connection,
}) => {    
  const anchorProgram = new Program(
    IDL as any,
    cardinalProgramId,
    new AnchorProvider(connection, createFakeWallet(), AnchorProvider.defaultOptions()),
  );

  const stakeEntriesRaw = await anchorProgram.account.stakeEntry.all();
  const rewardEntriesRaw = await anchorProgram.account.rewardEntry.all();
  const rewardDistributorsRaw = await anchorProgram.account.rewardDistributor.all();
  const stakePoolsRaw = await anchorProgram.account.stakePool.all();
  
  const stakeEntries = stakeEntriesRaw.map(objectBNsAndPubkeysToNums);
  const rewardEntries = rewardEntriesRaw.map(objectBNsAndPubkeysToNums);
  const rewardDistributors = rewardDistributorsRaw.map(objectBNsAndPubkeysToNums);
  const stakePools = stakePoolsRaw.map(objectBNsAndPubkeysToNums);
  return {stakeEntries, rewardDistributors, rewardEntries, stakePools}

};