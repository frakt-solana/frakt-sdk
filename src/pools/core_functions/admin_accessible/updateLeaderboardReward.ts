import { web3, utils } from '@project-serum/anchor';

import { returnCommunityPoolsAnchorProgram } from '../../contract_model/accounts';
import { UpdateLeaderboardReward } from '../../types';

export const updateLeaderboardReward = async (params: UpdateLeaderboardReward) => {
  const { communityPool, fractionMint, depositReward, withdrawReward, programId, admin, connection, sendTxn } = params;

  const encoder = new TextEncoder();
  const program = await returnCommunityPoolsAnchorProgram(programId, connection);
  const [leaderboardAccount, bump] = await web3.PublicKey.findProgramAddress(
    [communityPool.toBuffer(), encoder.encode('leaderBoard')],
    program.programId,
  );

  const instruction = program.instruction.updateLeaderboard(bump, depositReward, withdrawReward, {
    accounts: {
      communityPool,
      fractionMint,
      admin,
      systemProgram: web3.SystemProgram.programId,
      rent: web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: utils.token.TOKEN_PROGRAM_ID,
      leaderboardAccount,
    },
  });

  const transaction = new web3.Transaction();
  transaction.add(instruction);

  await sendTxn(transaction, []);
};
