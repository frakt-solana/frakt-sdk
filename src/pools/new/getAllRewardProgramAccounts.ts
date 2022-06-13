import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';

import { createFakeWallet, returnAnchorMultiRewardStaking } from '../../common';
import { decodedPoolBufferToUI, decodedRouterToUI, decodedSecondaryRewardToUI, decodedStakeAccountAddressToUI, decodedSecondStakeToUI } from '../contract_model/accounts';

export const getAllRewardProgramAccounts = async (programId: PublicKey, connection: Connection) => {

  const provider = new anchor.Provider(connection, createFakeWallet(), anchor.Provider.defaultOptions());
  const program = await returnAnchorMultiRewardStaking(programId, provider);

  const mainPoolConfigsRaw = await program.account.mainConfig.all();
  const mainRoutersRaw = await program.account.mainRouter.all();
  const secondaryStakeAccountsRaw = await program.account.secondStakeAccount.all();
  const secondaryRewardsRaw = await program.account.secondaryReward.all();
  const stakeAccountsRaw = await program.account.stakeAccount.all();

  const mainPoolConfigs = mainPoolConfigsRaw.map(raw => decodedPoolBufferToUI(raw.account, raw.publicKey ))
  const mainRouters = mainRoutersRaw.map(raw => decodedRouterToUI(raw.account, raw.publicKey ))
  const secondaryStakeAccounts = secondaryStakeAccountsRaw.map(raw => decodedSecondStakeToUI(raw.account, raw.publicKey ))
  const secondaryRewards = secondaryRewardsRaw.map(raw => decodedSecondaryRewardToUI(raw.account, raw.publicKey ))
  const stakeAccounts = stakeAccountsRaw.map(raw => decodedStakeAccountAddressToUI(raw.account, raw.publicKey ))

  return { mainPoolConfigs, mainRouters, secondaryStakeAccounts, secondaryRewards, stakeAccounts }
}
